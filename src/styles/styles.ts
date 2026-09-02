// styles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#1E3A8A', // Deep Ocean Blue
    zIndex: 10,
    elevation: 10,
    height: 75,
    justifyContent: 'center',
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
  content: {
    flex: 1,
    zindex: 10,
    elevation: 10,
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
