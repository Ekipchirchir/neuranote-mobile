
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { globalStyles } from '../styles/global';
import { getMemories } from '../services/db';

function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    getMemories((memories) => {
      // Mock Pinecone: Prioritize exact matches, then tags, then content
      const filtered = memories
        .filter((memory) =>
          memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          memory.tags.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
          const aMatch = a.content.toLowerCase().indexOf(searchQuery.toLowerCase());
          const bMatch = b.content.toLowerCase().indexOf(searchQuery.toLowerCase());
          return aMatch - bMatch;
        });
      setResults(filtered);
    });
  };

  const renderResult = ({ item }) => (
    <Card style={globalStyles.memoryItem}>
      <Card.Content>
        <Text style={globalStyles.memoryText}>{item.content.slice(0, 50)}...</Text>
        <Text style={globalStyles.memoryDate}>{item.createdAt}</Text>
        <Text style={globalStyles.memoryText}>Tags: {item.tags || 'None'}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Search Memories</Text>
      <TextInput
        label="Search your memories..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={globalStyles.input}
        mode="outlined"
      />
      <Button
        mode="contained"
        onPress={handleSearch}
        style={globalStyles.button}
      >
        Search
      </Button>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderResult}
      />
    </View>
  );
}

export default SearchScreen;
