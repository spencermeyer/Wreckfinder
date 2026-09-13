import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import { DataTable } from 'react-native-paper';
import { fetchWrecks } from '../api/dataService';
import tableStyles from '../styles/table';

interface WrecksTableProps {
  onSelectWreck?: (id: string | number) => void;
}

const WrecksTable: React.FC<WrecksTableProps> = ({ onSelectWreck }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [])

  const loadData = async() => {
    const result = await fetchWrecks();

    setData(result);
  }

  return (
  	<>
     <ScrollView style={tableStyles.container}>
    	 <DataTable style={tableStyles.tableWrapper}>
    	 	<DataTable.Header style={tableStyles.headerRow}>
    	 	  <DataTable.Title textStyle={tableStyles.headerText}>Title</DataTable.Title>
    	 	  <DataTable.Title textStyle={tableStyles.headerText}>Latitude</DataTable.Title>
    	 	  <DataTable.Title textStyle={tableStyles.headerText}>Longitude</DataTable.Title>
          <DataTable.Title textStyle={tableStyles.headerText}>Notes</DataTable.Title>
    	 	</DataTable.Header>
        {data.map((wreck, index) => {
          return(
      	 	<DataTable.Row key={wreck.id} style={tableStyles.row, index %2 === 0 ? tableStyles.evenRow : tableStyles.oddRow}>
      	 	  <DataTable.Cell
                textStyle={[tableStyles.cellText, styles.linkText]}
                onPress={() => onSelectWreck && onSelectWreck(wreck.id)}
              >
                {wreck.title}
              </DataTable.Cell>
      	 	  <DataTable.Cell textStyle={tableStyles.cellText} numeric>{wreck.latitude}</DataTable.Cell>
      	 	  <DataTable.Cell textStyle={tableStyles.cellText} numeric>{wreck.longitude}</DataTable.Cell>
            <DataTable.Cell textStyle={tableStyles.cellText}>{wreck.notes}</DataTable.Cell>
      	 	</DataTable.Row>
          )
        })}
    	 </DataTable>
     </ScrollView>
  	</>
  );
};

export default WrecksTable;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff'
  },
  tableHeader: {
    backgroundColor: '#D3D3D3',
  },
  linkText: {
    color: '#2563EB',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
