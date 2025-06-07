import AsyncStorage from '@react-native-async-storage/async-storage';
import { encode, decode } from 'base-64';

export const initDB = async () => {
  try {
    const memories = await AsyncStorage.getItem('memories_guest');
    const tasks = await AsyncStorage.getItem('tasks_guest');
    if (!memories) await AsyncStorage.setItem('memories_guest', JSON.stringify([]));
    if (!tasks) await AsyncStorage.setItem('tasks_guest', JSON.stringify([]));
    console.log('AsyncStorage initialized');
  } catch (error) {
    console.error('Failed to initialize AsyncStorage:', error);
  }
};

export const saveMemory = async (content, tags = '', callback) => {
  try {
    const key = 'memories_guest';
    const memories = JSON.parse(await AsyncStorage.getItem(key) || '[]');
    const encodedContent = encode(content);
    const newMemory = {
      id: Date.now(),
      userId: 'guest',
      content: encodedContent,
      summary: content.split(' ').slice(0, 10).join(' ') + '...',
      sentiment: content.length < 50 ? 'Positive' : 'Neutral',
      createdAt: new Date().toISOString(),
      tags: tags.split(',').map((t) => t.trim()).filter((t) => t),
      isPinned: false,
    };
    memories.push(newMemory);
    await AsyncStorage.setItem(key, JSON.stringify(memories));
    callback(memories);
  } catch (error) {
    console.error('Failed to save memory:', error);
  }
};

export const getMemories = async (callback) => {
  try {
    const key = 'memories_guest';
    const memories = JSON.parse(await AsyncStorage.getItem(key) || '[]');
    const decodedMemories = memories.map((m) => ({
      ...m,
      content: decode(m.content),
    }));
    callback(decodedMemories);
  } catch (error) {
    console.error('Failed to get memories:', error);
  }
};

export const getMemoryById = async (id, callback) => {
  try {
    const key = 'memories_guest';
    const memories = JSON.parse(await AsyncStorage.getItem(key) || '[]');
    const memory = memories.find((m) => m.id === id);
    if (memory) {
      memory.content = decode(memory.content);
    }
    callback(memory || null);
  } catch (error) {
    console.error('Failed to get memory by ID:', error);
  }
};

export const togglePinMemory = async (id, callback) => {
  try {
    const key = 'memories_guest';
    const memories = JSON.parse(await AsyncStorage.getItem(key) || '[]');
    const updatedMemories = memories.map((m) =>
      m.id === id ? { ...m, isPinned: !m.isPinned } : m
    );
    await AsyncStorage.setItem(key, JSON.stringify(updatedMemories));
    callback(updatedMemories);
  } catch (error) {
    console.error('Failed to toggle pin:', error);
  }
};

export const saveTask = async (title, dueDate, callback) => {
  try {
    const key = 'tasks_guest';
    const tasks = JSON.parse(await AsyncStorage.getItem(key) || '[]');
    const newTask = {
      id: Date.now(),
      title,
      dueDate,
      createdAt: new Date().toISOString(),
      completed: false,
    };
    tasks.push(newTask);
    await AsyncStorage.setItem(key, JSON.stringify(tasks));
    callback(tasks);
  } catch (error) {
    console.error('Failed to save task:', error);
  }
};

export const toggleTaskCompletion = async (id, callback) => {
  try {
    const key = 'tasks_guest';
    const tasks = JSON.parse(await AsyncStorage.getItem(key) || '[]');
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    await AsyncStorage.setItem(key, JSON.stringify(updatedTasks));
    callback(updatedTasks);
  } catch (error) {
    console.error('Failed to toggle task completion:', error);
  }
};

export const deleteTask = async (id, callback) => {
  try {
    const key = 'tasks_guest';
    const tasks = JSON.parse(await AsyncStorage.getItem(key) || '[]');
    const updatedTasks = tasks.filter((t) => t.id !== id);
    await AsyncStorage.setItem(key, JSON.stringify(updatedTasks));
    callback(updatedTasks);
  } catch (error) {
    console.error('Failed to delete task:', error);
  }
};

export const getTasks = async (callback) => {
  try {
    const key = 'tasks_guest';
    const tasks = JSON.parse(await AsyncStorage.getItem(key) || '[]');
    callback(tasks);
  } catch (error) {
    console.error('Failed to get tasks:', error);
  }
};

export const clearAllData = async (callback) => {
  try {
    await AsyncStorage.removeItem('memories_guest');
    await AsyncStorage.removeItem('tasks_guest');
    await initDB();
    callback();
  } catch (error) {
    console.error('Failed to clear data:', error);
  }
};