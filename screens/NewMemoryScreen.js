
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { TextInput as PaperInput, Button } from 'react-native-paper';
import { globalStyles } from '../styles/global';
import { saveMemory } from '../services/db';

function NewMemoryScreen({ navigation }) {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (recording) {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      // Mock Whisper API
      const transcript = 'Sample transcript from Whisper API';
      saveMemory(transcript, tags, () => {
        navigation.goBack();
      });
      setRecording(null);
    }
  };

  const handleSave = () => {
    if (content) {
      saveMemory(content, tags, () => {
        navigation.goBack();
      });
    } else {
      alert('Please enter a note or record audio.');
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>New Memory</Text>
      <PaperInput
        label="Note"
        value={content}
        onChangeText={setContent}
        multiline
        style={[globalStyles.input, styles.textInput]}
        mode="outlined"
      />
      <PaperInput
        label="Tags (comma-separated)"
        value={tags}
        onChangeText={setTags}
        style={globalStyles.input}
        mode="outlined"
      />
      {isRecording && <ActivityIndicator size="small" color="#6200EE" />}
      <Button
        mode="contained"
        onPress={recording ? stopRecording : startRecording}
        style={globalStyles.button}
        disabled={isRecording && !recording}
      >
        {recording ? 'Stop Recording' : 'Start Recording'}
      </Button>
      <Button
        mode="contained"
        onPress={handleSave}
        style={globalStyles.button}
      >
        Save Memory
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    height: 100,
  },
});

export default NewMemoryScreen;
