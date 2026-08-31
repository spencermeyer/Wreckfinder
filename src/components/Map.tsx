import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import mapStyles from '../styles/map';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { fetchWrecks } from '../api/dataService';

interface WreckPoint {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
}

const Map = () => {
  const [data, setData] = useState<WreckPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState({
    latitude: 50.96,
    longitude: -1.39,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const result = await fetchWrecks();
    console.log(result);
    setData(result);
    setLoading(false);
  };

  return (
    <View style={mapStyles.center}>
      <Text style={mapStyles.title}>🗺️ Map View</Text>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={mapStyles.map}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Render markers once data loads */}
        {data.map((point) => (
          <Marker
            key={point.id}
            coordinate={{
              latitude: Number(point.latitude),
              longitude: Number(point.longitude),
            }}
            title={point.title}
            description={point.description}
          />
        ))}
      </MapView>
    </View>
  );
};

export default Map;
