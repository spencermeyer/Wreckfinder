import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import type { MapStyleElement } from 'react-native-maps';

// Theme tokens for easy customization (balanced mid-tone palette)
export const MAP_THEME = {
  water: '#6b8fa8',
  landscape: '#bcc7d1',
  landNatural: '#b4c0cb',
  road: '#e9eef2',
  roadBorder: '#94a3b8',
  park: '#9cb89f',
  textPrimary: '#1e293b',
  border: '#64748b',
};

// Balanced mid-tone map styling for Google Maps (halfway between dark and light)
export const mapStyle: MapStyleElement[] = [
  {
    // Base geometry - balanced mid-tone cool grey/slate
    elementType: 'geometry',
    stylers: [{ color: '#c0c9d2' }],
  },
  {
    // Text labels - crisp dark slate for high legibility
    elementType: 'labels.text.fill',
    stylers: [{ color: '#1e293b' }],
  },
  {
    // Text label stroke - soft light halo
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#e2e8f0' }, { weight: 2 }],
  },
  {
    // Subtle POI icons
    elementType: 'labels.icon',
    stylers: [{ lightness: -10 }],
  },
  {
    // Landscape / Land
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#bcc7d1' }],
  },
  {
    // Natural landscape
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [{ color: '#b4c0cb' }],
  },
  {
    // Water - medium ocean slate blue (halfway between dark navy and light sky blue)
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#6b8fa8' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#1e3a5f' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#c4d7e6' }, { weight: 1.5 }],
  },
  {
    // Roads - clean off-white
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#e9eef2' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#94a3b8' }, { weight: 0.8 }],
  },
  {
    // Highways - warm amber tone
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#fcd34d' }, { lightness: 10 }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#d97706' }, { weight: 0.8 }],
  },
  {
    // Arterial & local roads
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#f1f5f9' }],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [{ color: '#e2e8f0' }],
  },
  {
    // Points of interest - muted cool tone
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#b8c4ce' }],
  },
  {
    // Parks - muted sage/coastal green
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#9cb89f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#1f4e2b' }],
  },
  {
    // Transit lines
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#a0aec0' }],
  },
  {
    // Administrative boundaries
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#64748b' }, { weight: 1.2 }],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#cbd5e1' }],
  },
];

export const lightMapStyle = mapStyle;
export const mediumMapStyle = mapStyle;

interface MapStyles {
  center: ViewStyle;
  title: TextStyle;
  detailText: TextStyle;
  container: ViewStyle;
  map: ViewStyle;
  callout: ViewStyle;
  calloutTitle: TextStyle;
  calloutText: TextStyle;
  calloutCoords: TextStyle;
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
