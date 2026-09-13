import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  Keyboard,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native';
import { DataTable } from 'react-native-paper';
import { fetchWrecks, searchWrecks } from '../api/dataService';
import tableStyles from '../styles/table';

interface WrecksTableProps {
  onSelectWreck?: (id: string | number) => void;
  searchOpen?: boolean;
  onToggleSearch?: () => void;
}

const WrecksTable: React.FC<WrecksTableProps> = ({
  onSelectWreck,
  searchOpen,
  onToggleSearch,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [internalSearchOpen, setInternalSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  // Keep a synchronous ref to guarantee the full typed string is always read on submit
  const searchInputRef = useRef('');

  const isSearchOpen = searchOpen !== undefined ? searchOpen : internalSearchOpen;

  const toggleSearch = () => {
    if (onToggleSearch) {
      onToggleSearch();
    } else {
      setInternalSearchOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    loadData('');
  }, []);

  const loadData = async (query = '') => {
    setLoading(true);
    try {
      const trimmedQuery = query.trim();
      let result;
      if (trimmedQuery) {
        console.log('Searching wrecks with query:', trimmedQuery);
        result = await searchWrecks(trimmedQuery);
      } else {
        console.log('Loading all wrecks');
        result = await fetchWrecks();
      }
      setData(Array.isArray(result) ? result : []);
      setSubmittedQuery(trimmedQuery);
    } catch (err) {
      console.error('Failed to load wrecks:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Called when user presses "Done" button or hits Search on keyboard
  const handleSearchSubmit = async (explicitTerm?: string) => {
    Keyboard.dismiss();
    const term = (explicitTerm !== undefined ? explicitTerm : searchInputRef.current).trim();
    console.log('handleSearchSubmit submitting full term:', term);
    setSearchQuery(term);
    searchInputRef.current = term;
    await loadData(term);
  };

  // Called to clear/reset search and fetch full list
  const handleClearSearch = async () => {
    Keyboard.dismiss();
    searchInputRef.current = '';
    setSearchQuery('');
    await loadData('');
  };

  const hasSearchText = searchQuery.length > 0;

  return (
    <View style={styles.container}>
      {/* Search Bar placed outside ScrollView so keyboard and layout remain completely stable */}
      {isSearchOpen && (
        <View style={styles.searchCard}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search wreck title..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={(text) => {
                searchInputRef.current = text;
                setSearchQuery(text);
              }}
              onSubmitEditing={(e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
                handleSearchSubmit(e.nativeEvent.text || searchInputRef.current);
              }}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
            />
            {/* Kept permanently in tree to prevent native Android layout shift/focus loss */}
            <Pressable
              onPress={handleClearSearch}
              hitSlop={8}
              style={[
                styles.clearButton,
                { opacity: hasSearchText ? 1 : 0 },
              ]}
              pointerEvents={hasSearchText ? 'auto' : 'none'}
              accessibilityLabel="Clear search"
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </Pressable>
            <Pressable
              onPress={() => handleSearchSubmit(searchInputRef.current)}
              hitSlop={8}
              style={styles.doneButton}
              accessibilityLabel="Done - submit search"
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          </View>

          {submittedQuery.length > 0 && (
            <View style={styles.searchStatusRow}>
              <Text style={styles.searchStatusText}>
                {loading ? 'Searching API...' : `Query: "${submittedQuery}" (${data.length} results)`}
              </Text>
              <Pressable onPress={handleClearSearch} hitSlop={6}>
                <Text style={styles.clearFilterLink}>Show all</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}

      {/* Scrollable Data Table */}
      <ScrollView
        style={tableStyles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E3A8A" />
            <Text style={styles.loadingText}>Loading shipwrecks...</Text>
          </View>
        )}

        {/* Data Table directly rendered from API results */}
        {!loading && (
          <DataTable style={tableStyles.tableWrapper}>
            <DataTable.Header style={tableStyles.headerRow}>
              <DataTable.Title
                textStyle={[
                  tableStyles.headerText,
                  isSearchOpen && styles.activeHeaderTitle,
                ]}
                onPress={toggleSearch}
              >
                {isSearchOpen ? 'Title ✕' : 'Title 🔍'}
              </DataTable.Title>
              <DataTable.Title textStyle={tableStyles.headerText}>Latitude</DataTable.Title>
              <DataTable.Title textStyle={tableStyles.headerText}>Longitude</DataTable.Title>
              <DataTable.Title textStyle={tableStyles.headerText}>Notes</DataTable.Title>
            </DataTable.Header>

            {data.map((wreck, index) => (
              <DataTable.Row
                key={wreck.id}
                style={[
                  tableStyles.row,
                  index % 2 === 0 ? tableStyles.evenRow : tableStyles.oddRow,
                ]}
              >
                <DataTable.Cell
                  textStyle={[tableStyles.cellText, styles.linkText]}
                  onPress={() => onSelectWreck && onSelectWreck(wreck.id)}
                >
                  {wreck.title}
                </DataTable.Cell>
                <DataTable.Cell textStyle={tableStyles.cellText} numeric>
                  {wreck.latitude}
                </DataTable.Cell>
                <DataTable.Cell textStyle={tableStyles.cellText} numeric>
                  {wreck.longitude}
                </DataTable.Cell>
                <DataTable.Cell textStyle={tableStyles.cellText}>
                  {wreck.notes || '—'}
                </DataTable.Cell>
              </DataTable.Row>
            ))}

            {data.length === 0 && (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsTitle}>No shipwrecks found</Text>
                <Text style={styles.noResultsText}>
                  {submittedQuery ? `No results returned for "${submittedQuery}"` : 'No shipwreck data available.'}
                </Text>
                {submittedQuery ? (
                  <Pressable onPress={handleClearSearch} style={styles.resetButton}>
                    <Text style={styles.resetButtonText}>Reset Search</Text>
                  </Pressable>
                ) : null}
              </View>
            )}
          </DataTable>
        )}
      </ScrollView>
    </View>
  );
};

export default WrecksTable;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  linkText: {
    color: '#2563EB',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  activeHeaderTitle: {
    color: '#93C5FD',
    textDecorationLine: 'underline',
  },
  searchCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 8,
    marginTop: 6,
    marginBottom: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
    paddingVertical: 6,
  },
  clearButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginRight: 4,
  },
  clearButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  doneButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  searchStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 4,
  },
  searchStatusText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  clearFilterLink: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#64748B',
  },
  noResultsContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  noResultsText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  resetButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
