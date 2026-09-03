import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Platform, PermissionsAndroid } from 'react-native';
import mapStyles, { lightMapStyle } from '../styles/map';
import MapView, { Marker, PROVIDER_GOOGLE, Region, UserLocationChangeEvent, Details, PanDragEvent } from 'react-native-maps';
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
  const initialRegion: Region = {
    latitude: 50.96,
    longitude: -1.39,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  };

  const mapRef = useRef<MapView>(null);
  const userLocationRef = useRef<{ latitude: number; longitude: number } | null>(null);
  const hasInitialCenteredRef = useRef(false);
  const currentRegionRef = useRef<Region>(initialRegion);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [data, setData] = useState<WreckPoint[]>([]);
  const [_loading, setLoading] = useState(true);
  const [region, setRegion] = useState<Region>(initialRegion);

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
      currentRegionRef.current = userLoc;
      mapRef.current?.animateToRegion(userLoc, 1000);
      loadData(userLoc);
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
        currentRegionRef.current = targetRegion;
        mapRef.current?.animateToRegion(targetRegion, 1000);
        loadData(targetRegion);
      }
    }
  };

  /**
   * Listener called when the user finishes scrolling/moving the map.
   * `details.isGesture` is true when triggered directly by a user touch/drag gesture.
   */
  const handleRegionChangeComplete = (newRegion: Region, details?: Details) => {
    // Silently update the current scrolled position ref without triggering re-renders
    currentRegionRef.current = newRegion;

    // Only fetch new data if the user physically scrolled/zoomed the map
    if (details?.isGesture) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce 500ms so we only fetch after the user stops scrolling
      debounceTimerRef.current = setTimeout(() => {
        console.log('Map scroll settled, fetching wrecks for region:', newRegion);
        loadData(newRegion);
      }, 500);
    }
  };

  /**
   * Listener called actively as the user drags/scrolls their finger on the map.
   */
  const handlePanDrag = (event: PanDragEvent) => {
    console.log('User dragging map at:', event.nativeEvent?.coordinate);
  };

  useEffect(() => {
    loadData();
    centerOnUserLocation();

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const loadData = async (targetRegion = currentRegionRef.current) => {
    setLoading(true);
    const result = await fetchWrecks(targetRegion);
    console.log('Wrecks result for region:', targetRegion, 'count:', result?.length);
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
        onRegionChangeComplete={handleRegionChangeComplete}
        onPanDrag={handlePanDrag}
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
