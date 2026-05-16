import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { DataTable } from 'react-native-paper';
import { fetchWrecks } from '../api/dataService';

const WreckTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [])

  const loadData = async() => {
    const result = await fetchWrecks();
    setData(result);
    console.log(result);
  }

  return (
  	<>
  	 <Text>Table of Wrecks</Text>
  	 <DataTable style={styles.container}>
  	 	<DataTable.Header style={styles.tableHeader}>
  	 	  <DataTable.Title>Title</DataTable.Title>
  	 	  <DataTable.Title>Latitude</DataTable.Title>
  	 	  <DataTable.Title>Longitude</DataTable.Title>
  	 	</DataTable.Header>
      {data.map((wreck, index) => {
        console.log('create row')
        return(
    	 	<DataTable.Row>
    	 	  <DataTable.Cell>{wreck.title}</DataTable.Cell>
    	 	  <DataTable.Cell>{wreck.latitude}</DataTable.Cell>
    	 	  <DataTable.Cell>{wreck.longitude}</DataTable.Cell>
    	 	</DataTable.Row>
        )
      })}

 	
  	 </DataTable>
  	</>
  );
};

export default WreckTable;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff'
  },
  tableHeader: {
    backgroundColor: '#D3D3D3',
  },
});
