// App.jsx
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { Provider as PaperProvider, Appbar, Menu, Divider } from 'react-native-paper';
import styles from '../styles/styles';

// Import your views (or use the placeholders below to test)
import WrecksTable from './WrecksTable';
import Map from './Map';

const App = () => {
  // 'list' will show your table, 'details' will show row details
  const [currentScreen, setCurrentScreen] = useState('list');
  const [selectedWreck, setSelectedWreck] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // Helper function to handle row selection from your table
  const handleSelectWreck = (wreckData) => {
    setSelectedWreck(wreckData);
    setCurrentScreen('details');
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        {/* Top Header Bar */}
        <Appbar.Header style={styles.header}>
          {currentScreen === 'details' ? (
            // Show a back arrow if we are looking at a wreck's details
            <Appbar.BackAction color="#fff" onPress={() => setCurrentScreen('list')} />
          ) : (
            // Simple Action Menu for the main dashboard
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={<Appbar.Action
                       // icon="menu" color="#fff" 
                       icon={({ size, color }) => <Text style={{ fontSize: 24, color: '#fff' }}>☰</Text>}
                       onPress={() => setMenuVisible(true)} />}
            >
              <Menu.Item onPress={() => { setCurrentScreen('list'); setMenuVisible(false); }} title="Wrecks Database" />
              <Divider />
              <Menu.Item onPress={() => { alert('Settings Clicked'); setMenuVisible(false); }} title="Settings" />
              <Divider />
              <Menu.Item onPress={() => { setCurrentScreen('map'); setMenuVisible(false) }} title="Map" />
            </Menu>
          )}
          <Appbar.Content 
            title={currentScreen === 'list' ? "Shipwrecks Database" : selectedWreck?.name || "Details"} 
            titleStyle={styles.headerTitle}
          />
        </Appbar.Header>

        {/* Dynamic Screen Layout Layer */}
        <View style={styles.content}>
        {(() => {
            console.log('MENU ITEM CHOSEN', currentScreen);
            switch (currentScreen) {
              case 'list':           
                return <Map/>;                
                // return <WrecksTable onSelectWreck={handleSelectWreck} />;
              case 'details':
                // Renders the specific shipwreck detail layout
                return (
                  <View style={styles.center}>
                    <Text style={styles.title}>{selectedWreck?.name || "Unknown Vessel"}</Text>
                    <Text style={styles.detailText}>Depth: {selectedWreck?.depth || "N/A"} meters</Text>
                    <Text style={styles.detailText}>Location: {selectedWreck?.location || "Unknown"}</Text>
                  </View>
                );
              case 'map':
                return (<Map/>);                
              default:
                // Fail-safe: fallback to the main list if something goes wrong
                return <WrecksTable onSelectWreck={handleSelectWreck} />;
            }
          })()}
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default App;
