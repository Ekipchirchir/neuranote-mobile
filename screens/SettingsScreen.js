
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Switch } from 'react-native-paper';
import { globalStyles } from '../styles/global';
import { clearAllData } from '../services/db';

function SettingsScreen() {
  const [isEnglish, setIsEnglish] = useState(true);

  const handleClearData = () => {
    clearAllData(() => {
      alert('All data cleared!');
    });
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Settings</Text>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Language: English</Text>
        <Switch
          value={isEnglish}
          onValueChange={() => setIsEnglish(!isEnglish)}
          disabled // Mock multi-language
        />
      </View>
      <Button
        mode="contained"
        onPress={() => alert('Dark Mode TBD')}
        style={globalStyles.button}
      >
        Toggle Dark Mode
      </Button>
      <Button
        mode="contained"
        onPress={() => alert('Sync TBD')}
        style={globalStyles.button}
      >
        Manage Sync
      </Button>
      <Button
        mode="contained"
        onPress={handleClearData}
        style={globalStyles.button}
      >
        Clear All Data
      </Button>
      <Button
        mode="contained"
        onPress={() => alert('Train AI TBD')}
        style={globalStyles.button}
      >
        Train AI
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
});

export default SettingsScreen;
