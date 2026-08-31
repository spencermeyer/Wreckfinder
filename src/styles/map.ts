import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

// Theme tokens for easy customization
export const MAP_THEME = {
};

interface MapStyles {
  container: ViewStyle;
  tableWrapper: ViewStyle;
  headerRow: ViewStyle;
  headerCell: ViewStyle;
  headerText: TextStyle;
  row: ViewStyle;
  evenRow: ViewStyle;
  oddRow: ViewStyle;
  cell: ViewStyle;
  cellText: TextStyle;
  numberCell: TextStyle;
  badge: ViewStyle;
  badgeText: TextStyle;
}

export const mapStyles = StyleSheet.create<MapStyles>({
  center: {
	  flex: 1,
	  justifyContent: 'center',
	  alignItems: 'center',
	  padding: 20,
	},
	title: {
	  fontSize: 24,
	  fontWeight: 'bold',
	  marginBottom: 10,
	  color: '#1E3A8A',
	},
	detailText: {
	  fontSize: 18,
	  marginVertical: 4,
	},
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  callout: {
    padding: 6,
    minWidth: 120,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  calloutText: {
    fontSize: 12,
    color: '#4B5563',
  },
  calloutCoords: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
});

export default mapStyles;
