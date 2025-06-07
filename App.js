
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import NewMemoryScreen from './screens/NewMemoryScreen';
import MemoryDetailScreen from './screens/MemoryDetailScreen';
import SearchScreen from './screens/SearchScreen';
import SettingsScreen from './screens/SettingsScreen';
import { initDB } from './services/db';

const Stack = createStackNavigator();

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text>Something went wrong.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  initDB();

  return (
    <PaperProvider>
      <ErrorBoundary>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="NewMemory" component={NewMemoryScreen} />
            <Stack.Screen name="MemoryDetail" component={MemoryDetailScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ErrorBoundary>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});
