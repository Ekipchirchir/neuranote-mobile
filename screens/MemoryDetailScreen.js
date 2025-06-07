
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { globalStyles } from '../styles/global';
import { getMemoryById, saveTask } from '../services/db';

function MemoryDetailScreen({ route, navigation }) {
  const { memoryId } = route.params;
  const [memory, setMemory] = useState(null);
  const [taskName, setTaskName] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');

  useEffect(() => {
    getMemoryById(memoryId, (result) => {
      setMemory(result);
    });
  }, [memoryId]);

  const handleCreateTask = () => {
    if (taskName && taskDueDate) {
      saveTask(taskName, taskDueDate, () => {
        alert('Task created!');
        setTaskName('');
        setTaskDueDate('');
      });
    } else {
      alert('Please enter task name and due date.');
    }
  };

  if (!memory) {
    return (
      <View style={globalStyles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Memory Details</Text>
      <Card style={globalStyles.memoryItem}>
        <Card.Content>
          <Text style={globalStyles.memoryText}>Content: {memory.content}</Text>
          <Text style={globalStyles.memoryDate}>Created: {memory.createdAt}</Text>
          <Text style={globalStyles.memoryText}>Summary: {memory.summary}</Text>
          <Text style={globalStyles.memoryText}>Sentiment: {memory.sentiment}</Text>
          <Text style={globalStyles.memoryText}>Tags: {memory.tags || 'None'}</Text>
        </Card.Content>
      </Card>
      <Button
        mode="contained"
        onPress={() => alert('Summary updated (mock GPT-4)')}
        style={globalStyles.button}
      >
        Generate Summary
      </Button>
      <Button
        mode="contained"
        onPress={() => alert('Sentiment updated (mock AWS Comprehend)')}
        style={globalStyles.button}
      >
        Analyze Sentiment
      </Button>
      <Text style={styles.sectionTitle}>Create Task</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="Task Name"
        value={taskName}
        onChangeText={setTaskName}
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Due Date (YYYY-MM-DD)"
        value={taskDueDate}
        onChangeText={setTaskDueDate}
      />
      <Button
        mode="contained"
        onPress={handleCreateTask}
        style={globalStyles.button}
      >
        Create Task
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
});

export default MemoryDetailScreen;
