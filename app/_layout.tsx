// app/(tabs)/index.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SearchBar } from '../components/SearchBar';
import { BookCard } from '../components/BookCard';
import { googleBooksApi } from '../app/services/api/googleBooks';
import { Book } from '../app/services/api/types';
import Colors from '../constants/Colors';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load trending books on mount
  useEffect(() => {
    loadTrendingBooks();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        handleSearch();
      } else if (searchQuery.trim().length === 0) {
        loadTrendingBooks();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadTrendingBooks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await googleBooksApi.getTrendingBooks();
      setBooks(result.books);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim().length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await googleBooksApi.searchBooks({
        query: searchQuery,
        maxResults: 20,
      });
      setBooks(result.books);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    
    if (searchQuery.trim().length > 0) {
      await handleSearch();
    } else {
      await loadTrendingBooks();
    }
    
    setRefreshing(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    loadTrendingBooks();
  };

  const handleBookPress = (book: Book) => {
    router.push(`/book/${book.id}`);
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading books...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorSubtext}>Pull down to retry</Text>
        </View>
      );
    }

    if (searchQuery.trim().length > 0 && books.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No books found</Text>
          <Text style={styles.emptySubtext}>
            Try a different search term
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Book</Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={handleClearSearch}
        placeholder="Search for a title..."
      />

      {books.length > 0 && (
        <Text style={styles.resultsCount}>
          {books.length} {books.length === 1 ? 'book' : 'books'} found
        </Text>
      )}

      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookCard book={item} onPress={() => handleBookPress(item)} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  resultsCount: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.text.secondary,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});