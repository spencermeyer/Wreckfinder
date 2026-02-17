import React from 'react';
import WreckTable from './WreckTable.tsx'

import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

export default function App(): React.JSX.Element {
	return (
		<View>
      <Text>
        Welcome to Wreckypedia
      </Text>
      <WreckTable />
    </View>
	)	
}
