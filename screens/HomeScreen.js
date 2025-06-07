import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { Card, Button, FAB, Divider, ProgressBar, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { globalStyles } from '../styles/global';
import { getMemories, getTasks, togglePinMemory, toggleTaskCompletion, deleteTask, saveMemory, saveTask } from '../services/db';

function HomeScreen({ navigation }) {
  const [memories, setMemories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [fabScale] = useState(new Animated.Value(1));
  const [selectedTag, setSelectedTag] = useState(null);

  useEffect(() => {
    getMemories((result) => {
      setMemories(result.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)));
    });
    getTasks((result) => setTasks(result)).catch((err) => {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks');
    });

    // Add test content for scrolling (remove after testing)
    saveMemory("Test memory 1", "test", () => {});
    saveMemory("Test memory 2", "test", () => {});
    saveTask("Test task 1", "2025-06-01", () => {});
    saveTask("Test task 2", "2025-06-01", () => {});
  }, []);

  const animateFab = () => {
    Animated.sequence([
      Animated.timing(fabScale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fabScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePinMemory = (id) => {
    togglePinMemory(id, (updatedMemories) => {
      setMemories(updatedMemories.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)));
    });
  };

  const handleToggleTask = (id) => {
    toggleTaskCompletion(id, (updatedTasks) => setTasks(updatedTasks));
  };

  const handleDeleteTask = (id) => {
    deleteTask(id, (updatedTasks) => setTasks(updatedTasks));
  };

  const recentMemories = memories.slice(0, 5);
  const pinnedMemories = memories.filter((m) => m.isPinned);
  const taskProgress = tasks.length
    ? tasks.filter((t) => t.completed).length / tasks.length
    : 0;
  const tags = [...new Set(memories.flatMap((m) => m.tags || []))];
  const filteredMemories = selectedTag
    ? memories.filter((m) => m.tags && m.tags.includes(selectedTag))
    : memories;
  const filteredPinnedMemories = selectedTag
    ? pinnedMemories.filter((m) => m.tags && m.tags.includes(selectedTag))
    : pinnedMemories;

  const sections = [
    { type: 'welcome', key: 'welcome' },
    { type: 'header', key: 'header' },
    { type: 'recentMemories', key: 'recentMemories', data: recentMemories },
    { type: 'divider', key: 'divider1' },
    { type: 'tagFilter', key: 'tagFilter', data: ['All', ...tags] },
    { type: 'divider', key: 'divider2' },
    { type: 'moodInsights', key: 'moodInsights' },
    { type: 'divider', key: 'divider3' },
    { type: 'tasksProgress', key: 'tasksProgress' },
    { type: 'tasks', key: 'tasks', data: tasks },
    { type: 'divider', key: 'divider4' },
    { type: 'pinnedMemories', key: 'pinnedMemories', data: filteredPinnedMemories },
    { type: 'divider', key: 'divider5' },
    { type: 'allMemories', key: 'allMemories', data: filteredMemories },
  ];

  const renderRightActions = (id) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDeleteTask(id)}
      accessible
      accessibilityLabel="Delete task"
    >
      <Icon name="delete" size={24} color="#FFF" />
    </TouchableOpacity>
  );

  const renderRecentMemory = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('MemoryDetail', { memoryId: item.id })}
      style={styles.carouselCard}
      accessible
      accessibilityLabel={`Recent memory: ${item.content.slice(0, 50)}`}
    >
      <Card style={styles.carouselCardInner}>
        <Card.Content>
          <Text style={styles.carouselText} numberOfLines={3}>
            {item.content.slice(0, 80)}...
          </Text>
          <Text style={globalStyles.cardDate}>{item.createdAt}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderTask = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <TouchableOpacity onPress={() => handleToggleTask(item.id)}>
        <Card style={globalStyles.card} accessible accessibilityLabel={`Task: ${item.title}`}>
          <Card.Content style={globalStyles.cardContent}>
              <View style={styles.cardRow}>
                <Icon
                  name={item.completed ? 'check-circle' : 'radio-button-unchecked'}
                  size={20}
                  color={item.completed ? '#22C55E' : '#7C3AED'}
                  style={styles.icon}
                />
                <View style={styles.cardTextContainer}>
                  <Text style={[globalStyles.cardText, item.completed && styles.completedTask]}>
                    {item.title}
                  </Text>
                  <Text style={globalStyles.cardDate}>Due: {item.dueDate}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      </Swipeable>
  );

  const renderMemory = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('MemoryDetail', { memoryId: item.id })}
      onLongPress={() => handlePinMemory(item.id)}
      accessible
      accessibilityLabel={`Memory: ${item.content.slice(0, 50)}`}
    >
      <Card style={globalStyles.card}>
        <Card.Content style={globalStyles.cardContent}>
          <View style={styles.cardRow}>
            <Icon
              name={item.isPinned ? 'push-pin' : 'description'}
              size={20}
              color="#7C3AED"
              style={styles.icon}
            />
            <View style={styles.cardTextContainer}>
              <Text style={globalStyles.cardText} numberOfLines={2}>
                {item.content.slice(0, 100)}...
              </Text>
              <Text style={globalStyles.cardDate}>{item.createdAt}</Text>
            </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
  );

  const renderSection = ({ item }) => {
    switch (item.type) {
      case 'welcome':
        return (
          <Card style={[globalStyles.card, styles.welcomeCard]}>
            <Card.Content>
              <Text style={globalStyles.title}>Hello!</Text>
              <Text style={globalStyles.cardText}>
                "Keep your memories alive with NeuraNote!"
              </Text>
            </Card.Content>
          </Card>
        );
      case 'header':
        return (
          <View style={globalStyles.header}>
            <Text style={globalStyles.subtitle}>Your smart memory assistant</Text>
            <View style={styles.quickActions}>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('NewMemory')}
                style={[globalStyles.quickActionButton, { backgroundColor: '#7C3AED' }]}
                contentStyle={styles.buttonContent}
                labelStyle={globalStyles.buttonText}
                icon="note-add"
                accessibilityLabel="Quick add text note"
              >
                Text Note
              </Button>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('NewMemory')}
                style={[globalStyles.quickActionButton, { backgroundColor: '#3B82F6' }]}
                contentStyle={styles.buttonContent}
                labelStyle={globalStyles.buttonText}
                icon="mic"
                accessibilityLabel="Quick record voice note"
              >
                Voice Note
              </Button>
            </View>
          </View>
        );
      case 'recentMemories':
        return (
          <View>
            <Text style={globalStyles.sectionTitle}>Recent Memories</Text>
            <FlatList
              data={item.data}
              keyExtractor={(item) => `recent-${item.id}`}
              renderItem={renderRecentMemory}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.carousel}
              ListEmptyComponent={<Text style={styles.emptyText}>No recent memories</Text>}
              nestedScrollEnabled
            />
          </View>
        );
      case 'tagFilter':
        return (
          <View>
            <Text style={globalStyles.sectionTitle}>Filter by Tag</Text>
            <FlatList
              data={item.data}
              keyExtractor={(item) => `tag-${item}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item: tag }) => (
                <Chip
                  selected={selectedTag === tag || (tag === 'All' && !selectedTag)}
                  onPress={() => setSelectedTag(tag === 'All' ? null : tag)}
                  style={styles.chip}
                  textStyle={styles.chipText}
                  accessible
                  accessibilityLabel={`Filter by ${tag}`}
                >
                  {tag}
                </Chip>
              )}
              style={styles.chipList}
              nestedScrollEnabled
            />
          </View>
        );
      case 'moodInsights':
        return (
          <View>
            <Text style={globalStyles.sectionTitle}>AI Mood Insights</Text>
            <Card style={globalStyles.card}>
              <Card.Content>
                <Text style={globalStyles.cardText}>
                  Your recent memories show a {memories.length > 0 ? 'Positive' : 'Neutral'} mood.
                </Text>
                <ProgressBar
                  progress={0.7}
                  color="#7C3AED"
                  style={styles.progressBar}
                  accessibilityLabel="Mood sentiment score"
                />
              </Card.Content>
            </Card>
          </View>
        );
      case 'tasksProgress':
        return (
          <View>
            <Text style={globalStyles.sectionTitle}>Tasks</Text>
            <Card style={globalStyles.card}>
              <Card.Content>
                <Text style={globalStyles.cardText}>
                  Task Progress: {Math.round(taskProgress * 100)}%
                </Text>
                <ProgressBar
                  progress={taskProgress}
                  color="#22C55E"
                  style={styles.progressBar}
                  accessibilityLabel="Task completion progress"
                />
              </Card.Content>
            </Card>
          </View>
        );
      case 'tasks':
        return (
          <FlatList
            data={item.data}
            keyExtractor={(item) => `task-${item.id}`}
            renderItem={renderTask}
            ListEmptyComponent={<Text style={styles.emptyText}>No tasks yet</Text>}
            style={styles.list}
            nestedScrollEnabled
          />
        );
      case 'pinnedMemories':
        return (
          <View>
            <Text style={globalStyles.sectionTitle}>Pinned Memories</Text>
            <FlatList
              data={item.data}
              keyExtractor={(item) => `pinned-${item.id}`}
              renderItem={renderMemory}
              ListEmptyComponent={<Text style={styles.emptyText}>No pinned memories</Text>}
              style={styles.list}
              nestedScrollEnabled
            />
          </View>
        );
      case 'allMemories':
        return (
          <View>
            <Text style={globalStyles.sectionTitle}>All Memories</Text>
            <FlatList
              data={item.data}
              keyExtractor={(item) => `memory-${item.id}`}
              renderItem={renderMemory}
              ListEmptyComponent={<Text style={styles.emptyText}>No memories yet</Text>}
              style={styles.list}
              nestedScrollEnabled
            />
          </View>
        );
      case 'divider':
        return <Divider style={globalStyles.divider} />;
      default:
        return null;
    }
  };

  if (error) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Error</Text>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <FlatList
        style={[styles.flatList, { backgroundColor: '#E0F7FA' }]} // Debug color
        contentContainerStyle={styles.flatListContent}
        data={sections}
        keyExtractor={(item) => item.key}
        renderItem={renderSection}
        showsVerticalScrollIndicator={true}
        alwaysBounceVertical={true}
        onContentSizeChange={(w, h) => console.log(`Content height: ${h}px`)}
      />

      <Animated.View style={{ transform: [{ scale: fabScale }], zIndex: 15 }}>
        <FAB
          style={[globalStyles.fab, { bottom: 90 }]}
          icon="plus"
          onPress={() => {
            animateFab();
            navigation.navigate('NewMemory');
          }}
          accessibilityLabel="Add new memory"
        />
      </Animated.View>

      <View style={[styles.bottomNav, { zIndex: 20 }]}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Search')}
          style={[globalStyles.button, styles.bottomButton]}
          contentStyle={styles.buttonContent}
          labelStyle={globalStyles.buttonText}
          icon="magnify"
          accessibilityLabel="Search memories"
        >
          Search
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Settings')}
          style={[globalStyles.button, styles.bottomButton]}
          contentStyle={styles.buttonContent}
          labelStyle={globalStyles.buttonText}
          icon="cog"
          accessibilityLabel="Open settings"
        >
          Settings
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    ...(Platform.OS === 'web' && { overflowY: 'auto', height: '100%' }),
  },
  flatListContent: {
    paddingBottom: 150, // Clear bottomNav and FAB
  },
  welcomeCard: {
    marginBottom: 16,
    backgroundColor: '#EDE9FE',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  carousel: {
    marginBottom: 12,
  },
  carouselCard: {
    width: 200,
    marginRight: 12,
  },
  carouselCardInner: {
    borderRadius: 12,
    elevation: 2,
  },
  carouselText: {
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 20,
  },
  list: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginVertical: 16,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  cardTextContainer: {
    flex: 1,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#64748B',
  },
  progressBar: {
    marginTop: 8,
    height: 8,
    borderRadius: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  buttonContent: {
    height: 48,
    flexDirection: 'row-reverse',
  },
  chipList: {
    marginBottom: 12,
  },
  chip: {
    marginRight: 8,
    backgroundColor: '#EDE9FE',
  },
  chipText: {
    color: '#1E293B',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 12,
  },
});

export default HomeScreen;