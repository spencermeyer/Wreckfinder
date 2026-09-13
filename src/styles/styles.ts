// styles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#1E3A8A', // Deep Ocean Blue
    height: 75,
    justifyContent: 'center',
    elevation: 4,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  menuBurger: {
    fontSize: 24,
    color: '#fff',
    lineHeight: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  backIcon: {
    fontSize: 24,
    color: '#fff',
    lineHeight: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  content: {
    flex: 1,
  },
  menuOverlayContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  menuDropdown: {
    position: 'absolute',
    top: 80,
    right: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    minWidth: 220,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    paddingVertical: 6,
  },
  menuItemContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  menuItemContent: {
    alignItems: 'flex-end',
  },
  menuItemTitle: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'right',
  },
  menuDivider: {
    backgroundColor: '#E2E8F0',
    height: 1,
  },
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
});

export default styles;
