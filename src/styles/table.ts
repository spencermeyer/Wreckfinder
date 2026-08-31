import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

// Theme tokens for easy customization
export const TABLE_THEME = {
  primary: '#2563EB',       // Blue header/brand accent
  headerText: '#FFFFFF',
  border: '#E2E8F0',        // Light gray border
  textPrimary: '#1E293B',   // Dark gray body text
  textSecondary: '#64748B', // Muted text for sub-labels
  bgHeader: '#1E293B',      // Dark slate for header
  bgEvenRow: '#FFFFFF',     // Clean white
  bgOddRow: '#F8FAFC',      // Soft off-white zebra stripe
  bgHover: '#F1F5F9',
};

interface TableStyles {
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

export const tableStyles = StyleSheet.create<TableStyles>({
  // Outer container padding & scrolling safety
  container: {
    // flex: 1,
    // paddingVertical: 12,
  },
  // Table card wrapper with rounded corners and subtle shadow
  tableWrapper: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: TABLE_THEME.border,
    overflow: 'hidden', // Keeps header rounded corners clean
    backgroundColor: '#FFFFFF',
    // iOS Shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    // Android Elevation
    elevation: 2,
  },
  // Header Row Layout
  headerRow: {
    flexDirection: 'row',
    backgroundColor: TABLE_THEME.bgHeader,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  headerCell: {
    flex: 1,
    paddingHorizontal: 6,
  },
  headerText: {
    fontSize: 13,
    fontWeight: '700',
    color: TABLE_THEME.headerText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Data Row Layout
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: TABLE_THEME.border,
  },
  evenRow: {
    backgroundColor: TABLE_THEME.bgEvenRow,
  },
  oddRow: {
    backgroundColor: TABLE_THEME.bgOddRow,
  },
  // Data Cell Layout
  cell: {
    flex: 1,
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 14,
    color: TABLE_THEME.textPrimary,
  },
  // Utility typography for numeric values (right-aligned, tabular feel)
  numberCell: {
    fontSize: 14,
    color: TABLE_THEME.textPrimary,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  // Optional status badge component style
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: TABLE_THEME.primary,
  },
});

export default tableStyles;
