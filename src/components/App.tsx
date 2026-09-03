import React, { useState } from 'react';
import { SafeAreaView, View, Text, Pressable } from 'react-native';
import { Provider as PaperProvider, Appbar, Menu, Divider, Surface } from 'react-native-paper';
import styles from '../styles/styles';

// Import your views (or use the placeholders below to test)
import WrecksTable from './WrecksTable';
import Map from './Map';
import About from './About';

const BurgerIcon = () => <Text style={styles.menuBurger}>☰</Text>;

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

  const handleOpenMenu = () => {
    console.log('Menu burger icon pressed');
    setMenuVisible(true);
  };

  const handleCloseMenu = () => {
    console.log('Menu dismissed');
    setMenuVisible(false);
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
            <Appbar.Action
              icon={BurgerIcon}
              onPress={handleOpenMenu}
              accessibilityLabel="Open menu"
            />
          )}
          <Appbar.Content 
            title={
              currentScreen === 'list'
                ? "Shipwrecks Database"
                : currentScreen === 'map'
                ? "Shipwrecks Map"
                : currentScreen === 'about'
                ? "About"
                : selectedWreck?.name || "Details"
            } 
            titleStyle={styles.headerTitle}
          />
        </Appbar.Header>

        {/* Dynamic Screen Layout Layer */}
        <View style={styles.content}>
        {(() => {
            console.log('MENU ITEM CHOSEN', currentScreen);
            switch (currentScreen) {
              case 'list':           
                // return <Map/>;               
                return <WrecksTable onSelectWreck={handleSelectWreck} />;
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
              case 'about':
                return (<About/>);
              default:
                // Fail-safe: fallback to the main list if something goes wrong
                return <WrecksTable onSelectWreck={handleSelectWreck} />;
            }
          })()}
        </View>

        {/* Dropdown Menu Overlay */}
        {menuVisible && (
          <View style={styles.menuOverlayContainer}>
            <Pressable style={styles.modalBackdrop} onPress={handleCloseMenu} />
            <Surface style={styles.menuDropdown} elevation={5}>
              <Menu.Item
                onPress={() => {
                  console.log('Menu item chosen: Wrecks Database');
                  setCurrentScreen('list');
                  setMenuVisible(false);
                }}
                title="Wrecks Database"
                titleStyle={styles.menuItemTitle}
              />
              <Divider style={styles.menuDivider} />
              <Menu.Item
                onPress={() => {
                  console.log('Menu item chosen: About');
                  setCurrentScreen('about');
                  setMenuVisible(false);
                }}
                title="About"
                titleStyle={styles.menuItemTitle}
              />
              <Divider style={styles.menuDivider} />
              <Menu.Item
                onPress={() => {
                  console.log('Menu item chosen: Map');
                  setCurrentScreen('map');
                  setMenuVisible(false);
                }}
                title="Map"
                titleStyle={styles.menuItemTitle}
              />
            </Surface>
          </View>
        )}
      </SafeAreaView>
    </PaperProvider>
  );
};

export default App;
