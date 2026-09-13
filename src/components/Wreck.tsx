import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Surface } from 'react-native-paper';
import { fetchWreck } from '../api/dataService';

export interface WreckProps {
  wreck?: Record<string, any> | null;
  wreckId?: string | number | null;
  onViewOnMap?: (target: {
    latitude: number;
    longitude: number;
    wreckId?: string | number;
    title?: string;
  }) => void;
}

const formatKey = (key: string): string => {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatValue = (value: any): string => {
  if (value === null || value === undefined || value === '') {
    return '—';
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
};

const Wreck: React.FC<WreckProps> = ({ wreck: initialWreck, wreckId, onViewOnMap }) => {
  const [wreck, setWreck] = useState<Record<string, any> | null>(initialWreck || null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const targetId = wreckId || initialWreck?.id;

  useEffect(() => {
    // If we have an ID, fetch the full wreck data from the API
    if (targetId) {
      let isMounted = true;
      const loadWreck = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchWreck(targetId);
          if (isMounted) {
            if (data) {
              setWreck((prev) => ({ ...prev, ...data }));
            } else if (!initialWreck) {
              setError('Failed to load wreck information.');
            }
          }
        } catch (err: any) {
          if (isMounted) {
            console.error('Error in Wreck component loadWreck:', err);
            setError(err.message || 'Error loading wreck details');
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };
      loadWreck();
      return () => {
        isMounted = false;
      };
    } else if (initialWreck) {
      setWreck(initialWreck);
    }
  }, [targetId]);

  if (loading && !wreck) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1E3A8A" />
        <Text style={styles.loadingText}>Loading wreck details...</Text>
      </View>
    );
  }

  if (error && !wreck) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!wreck || Object.keys(wreck).length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>No Wreck Data</Text>
        <Text style={styles.emptyText}>No information is available for this wreck.</Text>
      </View>
    );
  }

  const title = wreck.title || wreck.name || 'Unknown Vessel';
  const entries = Object.entries(wreck).filter(([key]) => key.toLowerCase() !== 'id');

  // Parse coordinates safely for Map navigation
  const rawLat = wreck.latitude ?? wreck.lat;
  const rawLng = wreck.longitude ?? wreck.lng ?? wreck.long;
  const lat = rawLat != null && rawLat !== '' ? parseFloat(String(rawLat)) : null;
  const lng = rawLng != null && rawLng !== '' ? parseFloat(String(rawLng)) : null;
  const hasCoordinates = lat != null && !isNaN(lat) && lng != null && !isNaN(lng);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Banner */}
      <Surface style={styles.headerCard} elevation={2}>
        <Text style={styles.headerTitle}>{title}</Text>
        {loading && <ActivityIndicator size="small" color="#1E3A8A" style={styles.refreshIndicator} />}

        {/* View on Map Action Banner */}
        {hasCoordinates && (
          <View style={styles.mapActionContainer}>
            <View style={styles.coordsBadge}>
              <Text style={styles.coordsText}>
                📍 {lat.toFixed(4)}°, {lng.toFixed(4)}°
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.viewOnMapButton,
                pressed && styles.viewOnMapButtonPressed,
              ]}
              onPress={() => {
                if (onViewOnMap) {
                  onViewOnMap({
                    latitude: lat,
                    longitude: lng,
                    wreckId: targetId,
                    title,
                  });
                }
              }}
              accessibilityLabel="View on map"
              accessibilityRole="button"
            >
              <Text style={styles.viewOnMapButtonText}>🗺️ View on Map</Text>
            </Pressable>
          </View>
        )}
      </Surface>

      {/* Properties Table */}
      <Surface style={styles.tableCard} elevation={1}>
        {entries.map(([key, val], index) => {
          const isCoordKey = ['latitude', 'longitude', 'lat', 'lng', 'long'].includes(key.toLowerCase());
          return (
            <View
              key={key}
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.evenRow : styles.oddRow,
                index === entries.length - 1 && styles.lastRow,
              ]}
            >
              <View style={styles.keyColumn}>
                <Text style={styles.propertyKey}>{formatKey(key)}</Text>
              </View>
              <View style={styles.valueColumn}>
                <Text style={styles.propertyValue} selectable>
                  {formatValue(val)}
                </Text>
                {isCoordKey && hasCoordinates && onViewOnMap && (
                  <Pressable
                    hitSlop={6}
                    onPress={() =>
                      onViewOnMap({
                        latitude: lat,
                        longitude: lng,
                        wreckId: targetId,
                        title,
                      })
                    }
                    accessibilityLabel="View this coordinate on map"
                  >
                    <Text style={styles.tableMapLink}>View on map →</Text>
                  </Pressable>
                )}
              </View>
            </View>
          );
        })}
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748B',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: '#1E3A8A',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  refreshIndicator: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tableColumnHeader: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerDivider: {
    backgroundColor: '#CBD5E1',
    height: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  evenRow: {
    backgroundColor: '#FFFFFF',
  },
  oddRow: {
    backgroundColor: '#F8FAFC',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  keyColumn: {
    flex: 1,
    paddingRight: 8,
  },
  propertyKey: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  valueColumn: {
    flex: 1.4,
    paddingLeft: 8,
  },
  propertyValue: {
    fontSize: 14,
    color: '#0F172A',
    lineHeight: 20,
  },
  mapActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexWrap: 'wrap',
    gap: 8,
  },
  coordsBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  coordsText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  viewOnMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  viewOnMapButtonPressed: {
    backgroundColor: '#1E40AF',
    transform: [{ scale: 0.98 }],
  },
  viewOnMapButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  tableMapLink: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
    marginTop: 3,
  },
});

export default Wreck;
