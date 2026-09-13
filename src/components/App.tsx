import React, { useState } from 'react';
import { SafeAreaView, View, Text, Pressable, Image } from 'react-native';
import { Provider as PaperProvider, Appbar, Menu, Divider, Surface } from 'react-native-paper';
import styles from '../styles/styles';

// Import your views (or use the placeholders below to test)
import WrecksTable from './WrecksTable';
import Map from './Map';
import About from './About';
import Wreck from './Wreck';

const shipwreckIcon = require('../assets/shipwreck-icon.png');

const BurgerIcon = () => <Text style={styles.menuBurger}>☰</Text>;
const BackIcon = () => <Text style={styles.backIcon}>←</Text>;
const SearchIcon = () => <Text style={styles.searchIcon}>🔍</Text>;

const App = () => {
  // 'list' will show your table, 'details' will show row details
  const [currentScreen, setCurrentScreen] = useState('list');
  const [previousScreen, setPreviousScreen] = useState('list');
  const [selectedWreck, setSelectedWreck] = useState<any>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mapInitialCenter, setMapInitialCenter] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta?: number;
    longitudeDelta?: number;
    wreckId?: string | number;
    title?: string;
  } | null>(null);

  // Helper function to handle row selection from table or map
  const handleSelectWreck = (wreckData: any) => {
    setSearchOpen(false);
    setPreviousScreen(currentScreen);
    setSelectedWreck(wreckData);
    setCurrentScreen('details');
  };

  // Helper function to navigate from wreck details to map centered on wreck
  const handleViewOnMap = (target: {
    latitude: number;
    longitude: number;
    wreckId?: string | number;
    title?: string;
  }) => {
    setSearchOpen(false);
    setPreviousScreen('details');
    setMapInitialCenter({
      latitude: target.latitude,
      longitude: target.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
      wreckId: target.wreckId,
      title: target.title,
    });
    setCurrentScreen('map');
  };

  const handleOpenMenu = () => {
    console.log('Menu burger icon pressed');
    setMenuVisible(true);
  };

  const handleCloseMenu = () => {
    console.log('Menu dismissed');
    setMenuVisible(false);
  };

  const getHeaderTitle = () => {
    switch (currentScreen) {
      case 'list':
        return 'Shipwrecks Database';
      case 'map':
        return 'Shipwrecks Map';
      case 'about':
        return 'About';
      default:
        return selectedWreck?.title || selectedWreck?.name || 'Wreck Details';
    }
  };

  const showShipwreckIcon = ['list', 'map', 'about'].includes(currentScreen);
  const headerTitle = getHeaderTitle();

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        {/* Top Header Bar */}
        <Appbar.Header style={styles.header}>
          {(currentScreen === 'details' || (currentScreen === 'map' && previousScreen === 'details')) && (
            <Appbar.Action
              icon={BackIcon}
              isLeading={true}
              onPress={() => {
                if (currentScreen === 'map' && previousScreen === 'details') {
                  setCurrentScreen('details');
                } else {
                  setCurrentScreen(previousScreen || 'list');
                }
              }}
              accessibilityLabel="Back"
            />
          )}
          <Appbar.Content 
            title={
              showShipwreckIcon ? (
                <View style={styles.headerTitleRow}>
                  <Image source={shipwreckIcon} style={styles.headerTitleIcon} />
                  <Text style={styles.headerTitleText}>{headerTitle}</Text>
                </View>
              ) : (
                headerTitle
              )
            } 
            titleStyle={styles.headerTitle}
          />
          {currentScreen === 'list' && (
            <Appbar.Action
              icon={SearchIcon}
              onPress={() => setSearchOpen((prev) => !prev)}
              accessibilityLabel="Search wreck titles"
            />
          )}
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
                return (
                  <WrecksTable
                    onSelectWreck={handleSelectWreck}
                    searchOpen={searchOpen}
                    onToggleSearch={() => setSearchOpen((prev) => !prev)}
                  />
                );
              case 'details':
                return (
                  <Wreck
                    wreckId={typeof selectedWreck === 'object' && selectedWreck !== null ? selectedWreck.id : selectedWreck}
                    wreck={typeof selectedWreck === 'object' ? selectedWreck : null}
                    onViewOnMap={handleViewOnMap}
                  />
                );
              case 'map':
                return (
                  <Map
                    onSelectWreck={handleSelectWreck}
                    initialCenter={mapInitialCenter}
                  />
                );
              case 'about':
                return (<About/>);
              default:
                // Fail-safe: fallback to the main list if something goes wrong
                return (
                  <WrecksTable
                    onSelectWreck={handleSelectWreck}
                    searchOpen={searchOpen}
                    onToggleSearch={() => setSearchOpen((prev) => !prev)}
                  />
                );
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
                  setSearchOpen(false);
                  setMapInitialCenter(null);
                  setPreviousScreen(currentScreen);
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
                  setSearchOpen(false);
                  setMapInitialCenter(null);
                  setPreviousScreen(currentScreen);
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
                  setSearchOpen(false);
                  setMapInitialCenter(null);
                  setPreviousScreen(currentScreen);
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
