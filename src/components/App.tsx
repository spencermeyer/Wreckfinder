import React, { useState } from 'react';
import { SafeAreaView, View, Text, Pressable } from 'react-native';
import { Provider as PaperProvider, Appbar, Menu, Divider, Surface } from 'react-native-paper';
import styles from '../styles/styles';

// Import your views (or use the placeholders below to test)
import WrecksTable from './WrecksTable';
import Map from './Map';
import About from './About';
import Wreck from './Wreck';

const BurgerIcon = () => <Text style={styles.menuBurger}>☰</Text>;
const BackIcon = () => <Text style={styles.backIcon}>←</Text>;

const App = () => {
  // 'list' will show your table, 'details' will show row details
  const [currentScreen, setCurrentScreen] = useState('list');
  const [previousScreen, setPreviousScreen] = useState('list');
  const [selectedWreck, setSelectedWreck] = useState<any>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // Helper function to handle row selection from table or map
  const handleSelectWreck = (wreckData: any) => {
    setPreviousScreen(currentScreen);
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
          {currentScreen === 'details' && (
            <Appbar.Action
              icon={BackIcon}
              isLeading={true}
              onPress={() => setCurrentScreen(previousScreen || 'list')}
              accessibilityLabel="Back"
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
                : selectedWreck?.title || selectedWreck?.name || "Wreck Details"
            } 
            titleStyle={styles.headerTitle}
          />
          <Appbar.Action
            icon={BurgerIcon}
            onPress={handleOpenMenu}
            accessibilityLabel="Open menu"
          />
        </Appbar.Header>

        {/* Dynamic Screen Layout Layer */}
        <View style={styles.content}>
        {(() => {
            console.log('MENU ITEM CHOSEN', currentScreen);
            switch (currentScreen) {
              case 'list':           
                return <WrecksTable onSelectWreck={handleSelectWreck} />;
              case 'details':
                return (
                  <Wreck
                    wreckId={typeof selectedWreck === 'object' && selectedWreck !== null ? selectedWreck.id : selectedWreck}
                    wreck={typeof selectedWreck === 'object' ? selectedWreck : null}
                  />
                );
              case 'map':
                return <Map onSelectWreck={handleSelectWreck} />;
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
                containerStyle={styles.menuItemContainer}
                contentStyle={styles.menuItemContent}
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
                containerStyle={styles.menuItemContainer}
                contentStyle={styles.menuItemContent}
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
                containerStyle={styles.menuItemContainer}
                contentStyle={styles.menuItemContent}
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
