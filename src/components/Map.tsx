import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Platform, PermissionsAndroid } from 'react-native';
import mapStyles, { lightMapStyle } from '../styles/map';
import MapView, { Marker, PROVIDER_GOOGLE, Region, UserLocationChangeEvent } from 'react-native-maps';
import { fetchWrecks } from '../api/dataService';

export interface UserLocation {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface WreckPoint {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
}

const Map = () => {
  const mapRef = useRef<MapView>(null);
  const userLocationRef = useRef<{ latitude: number; longitude: number } | null>(null);
  const hasInitialCenteredRef = useRef(false);

  const [data, setData] = useState<WreckPoint[]>([]);
  const [_loading, setLoading] = useState(true);
  const [region, setRegion] = useState<Region>({
    latitude: 50.96,
    longitude: -1.39,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  });

  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Wreckfinder needs access to your location to center the map on your position.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Error requesting location permission:', err);
        return false;
      }
    }
    return true;
  };

  const getCurrentLocation = async (): Promise<UserLocation | null> => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      console.warn('Location permission denied');
      return null;
    }

    // If a location fix has already been captured from the map
    if (userLocationRef.current) {
      return {
        latitude: userLocationRef.current.latitude,
        longitude: userLocationRef.current.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }

    // Wait for the next location update from MapView
    return new Promise((resolve) => {
      const startTime = Date.now();
      const interval = setInterval(() => {
        if (userLocationRef.current) {
          clearInterval(interval);
          resolve({
            latitude: userLocationRef.current.latitude,
            longitude: userLocationRef.current.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        } else if (Date.now() - startTime > 5000) {
          clearInterval(interval);
          console.warn('Timed out waiting for user location');
          resolve(null);
        }
      }, 200);
    });
  };

  /**
   * Centers the map on the user's location with a smooth animation.
   */
  const centerOnUserLocation = async () => {
    const userLoc = await getCurrentLocation();
    if (userLoc) {
      hasInitialCenteredRef.current = true;
      setRegion(userLoc);
      mapRef.current?.animateToRegion(userLoc, 1000);
    }
  };

  const handleUserLocationChange = (event: UserLocationChangeEvent) => {
    const coordinate = event.nativeEvent?.coordinate;
    if (coordinate) {
      const newLoc = {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      };
      userLocationRef.current = newLoc;

      // Automatically center on the user's location the first time it is received
      if (!hasInitialCenteredRef.current) {
        hasInitialCenteredRef.current = true;
        const targetRegion: Region = {
          latitude: newLoc.latitude,
          longitude: newLoc.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        setRegion(targetRegion);
        mapRef.current?.animateToRegion(targetRegion, 1000);
      }
    }
  };

  useEffect(() => {
    loadData();
    centerOnUserLocation();
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
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={mapStyles.map}
        customMapStyle={lightMapStyle}
        loadingBackgroundColor="#c0c9d2"
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onUserLocationChange={handleUserLocationChange}
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
