import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';

interface TableColumn {
  key: string;
  title: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
}

interface TableProps {
  columns: TableColumn[];
  data: Record<string, any>[];
  style?: any;
}

const Table: React.FC<TableProps> = ({ columns, data, style }) => {
  const screenWidth = Dimensions.get('window').width;
  const availableWidth = screenWidth - 32; // Account for padding

  const getColumnWidth = (column: TableColumn) => {
    if (column.width) {
      return column.width;
    }
    return availableWidth / columns.length;
  };

  const renderCell = (item: any, column: TableColumn) => {
    const cellValue = item[column.key];
    const cellStyle = [
      styles.cell,
      { width: getColumnWidth(column) },
      column.align === 'center' && styles.centerAlign,
      column.align === 'right' && styles.rightAlign,
    ];

    return (
      <View key={column.key} style={cellStyle}>
        <Text style={styles.cellText}>{cellValue || '-'}</Text>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerRow}>
      {columns.map((column) => (
        <View
          key={column.key}
          style={[
            styles.headerCell,
            { width: getColumnWidth(column) },
            column.align === 'center' && styles.centerAlign,
            column.align === 'right' && styles.rightAlign,
          ]}
        >
          <Text style={styles.headerText}>{column.title}</Text>
        </View>
      ))}
    </View>
  );

  const renderRow = (item: any, index: number) => (
    <View key={index} style={styles.dataRow}>
      {columns.map((column) => renderCell(item, column))}
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View style={styles.table}>
          {renderHeader()}
          {data.map((item, index) => renderRow(item, index))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  table: {
    minWidth: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerCell: {
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    justifyContent: 'center',
  },
  cell: {
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: '#eee',
    justifyContent: 'center',
    minHeight: 50,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  cellText: {
    fontSize: 14,
    color: '#666',
  },
  centerAlign: {
    alignItems: 'center',
  },
  rightAlign: {
    alignItems: 'flex-end',
  },
});

export default Table;
