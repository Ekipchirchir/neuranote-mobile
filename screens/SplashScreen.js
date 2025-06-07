
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/global';

function SplashScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Home');
    }, 2000);
  }, []);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>NeuraNote</Text>
      <ActivityIndicator size="large" color="#6200EE" />
      <Text style={styles.syncStatus}>Syncing with MongoDB Atlas...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  syncStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default SplashScreen;
