import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';

const Map = () => {

	return (
		<View style={styles.center}>
		  <Text style={styles.title}>🗺️ Map View</Text>
		  <Text style={styles.detailText}>Interactive coordinates will load here.</Text>
		</View>
	)
}

export default Map;

const styles = StyleSheet.create({
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
});

