
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '../../components/SearchBar';
import { BookCard } from '../../components/BookCard';
import { googleBooksApi } from '../services/api/googleBooks'
import { Book } from '../services/api/types';
import Colors from '../../constants/Colors';

const CATEGORIES = [
  { id: 'fiction', label: 'Fiction', icon: 'book' },
  { id: 'science', label: 'Science', icon: 'flask' },
  { id: 'history', label: 'History', icon: 'time' },
  { id: 'biography', label: 'Biography', icon: 'person' },
  { id: 'self-help', label: 'Self Help', icon: 'heart' },
  { id: 'technology', label: 'Technology', icon: 'laptop' },
];

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCategoryPress = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    setLoading(true);
    setError(null);

    try {
      const result = await googleBooksApi.searchBooks({
        query: `subject:${categoryId}`,
        maxResults: 20,
      });
      setBooks(result.books);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load books');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim().length === 0) return;

    setLoading(true);
    setError(null);
    setSelectedCategory(null);

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

  const handleClearSearch = () => {
    setSearchQuery('');
    setBooks([]);
    setSelectedCategory(null);
  };

  const handleBookPress = (book: Book) => {
    router.push(`/book/${book.id}`);
  };

  const renderCategoryItem = ({ item }: { item: typeof CATEGORIES[0] }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.categoryItemActive,
      ]}
      onPress={() => handleCategoryPress(item.id)}
    >
      <Ionicons
        name={item.icon as any}
        size={24}
        color={selectedCategory === item.id ? Colors.white : Colors.primary}
      />
      <Text
        style={[
          styles.categoryLabel,
          selectedCategory === item.id && styles.categoryLabelActive,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
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
        </View>
      );
    }

    if (books.length === 0 && (selectedCategory || searchQuery.trim().length > 0)) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No books found</Text>
        </View>
      );
    }

    if (books.length > 0) {
      return (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BookCard book={item} onPress={() => handleBookPress(item)} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    return (
      <View style={styles.centerContainer}>
        <Ionicons name="compass-outline" size={64} color={Colors.text.light} />
        <Text style={styles.placeholderText}>
          Select a category or search for books
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={handleClearSearch}
        placeholder="Search by title or author..."
      />

      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Browse by Category</Text>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.categoriesContent}
        />
      </View>

      {renderContent()}
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
  categoriesSection: {
    backgroundColor: Colors.white,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  categoryItemActive: {
    backgroundColor: Colors.primary,
  },
  categoryLabel: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  categoryLabelActive: {
    color: Colors.white,
  },
  listContent: {
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.text.secondary,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  placeholderText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});