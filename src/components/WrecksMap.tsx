import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

// Sample coordinates database list to display pins on the map grid layout
const SAMPLE_WRECKS = [
  { id: 1, name: "HMS Invincible", lat: 50.724, lng: -1.023, depth: 12 },
  { id: 2, name: "SS Shirala", lat: 50.685, lng: -1.092, depth: 24 },
  { id: 3, name: "The Mary Rose", lat: 50.796, lng: -1.107, depth: 15 }
];

const WrecksMap = ({ wrecksList = SAMPLE_WRECKS }) => {
  
  // 1. Generate JavaScript injection strings to build the Leaflet marker pins array dynamically
  const markersHtml = wrecksList.map(wreck => `
    L.marker([${wreck.lat}, ${wreck.lng}]).addTo(map)
      .bindPopup("<b>${wreck.name}</b><br>Depth: ${wreck.depth} meters");
  `).join('\n');

  // 2. Pure HTML/JS Leaflet mapping engine template string
  const leafletBoilerplateHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <title>Leaflet Shipwrecks Map Engine</title>
      
      <!-- Leaflet CSS Stylesheet File Link -->
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      
      <!-- Leaflet Core Logic JavaScript Engine Link -->
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      
      <style>
        body, html, #map {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          background-color: #e5e9f0;
        }
      </style>
    </head>
    <body>

      <div id="map"></div>

      <script>
        // Set central camera view point (Centered around South Coast UK area default coordinates)
        var map = L.map('map', {
          zoomControl: false // Hide default buttons so they don't fight native UI gestures
        }).setView([50.75, -1.05], 11);

        // Load free OpenStreetMap tile asset graphics layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Re-inject our automated pins matrix array from the React Native runtime context
        ${markersHtml}
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: leafletBoilerplateHtml }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        
        // Native performance configurations
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#1E3A8A" />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default WrecksMap;