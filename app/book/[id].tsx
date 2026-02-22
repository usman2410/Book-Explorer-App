// app/book/[id].tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { googleBooksApi } from '../services/api/googleBooks'
import { Book } from '../services/api/types';
import Colors from '../../constants/Colors';

const { width } = Dimensions.get('window');

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBookDetails();
  }, [id]);

  const loadBookDetails = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const bookData = await googleBooksApi.getBookById(id);
      setBook(bookData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons key={i} name="star" size={18} color={Colors.rating.star} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons key={i} name="star-half" size={18} color={Colors.rating.star} />
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={18} color={Colors.rating.star} />
        );
      }
    }
    
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading book details...</Text>
      </View>
    );
  }

  if (error || !book) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar style="dark" />
        <Text style={styles.errorText}>{error || 'Book not found'}</Text>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backIconButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Book Cover */}
        <View style={styles.coverSection}>
          {book.coverImage || book.thumbnail ? (
            <Image
              source={{ uri: book.coverImage || book.thumbnail }}
              style={styles.coverImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderCover}>
              <Ionicons name="book" size={80} color={Colors.text.light} />
            </View>
          )}
        </View>

        {/* Book Info */}
        <View style={styles.infoSection}>
          <Text style={styles.title}>{book.title}</Text>
          
          <Text style={styles.author}>{book.authors.join(', ')}</Text>

          {/* Rating */}
          {book.averageRating && (
            <View style={styles.ratingSection}>
              {renderStars(book.averageRating)}
              <Text style={styles.ratingText}>
                {book.averageRating.toFixed(1)}
              </Text>
              {book.ratingsCount && (
                <Text style={styles.ratingsCount}>
                  ({book.ratingsCount} reviews)
                </Text>
              )}
            </View>
          )}

          {/* Meta Information */}
          <View style={styles.metaContainer}>
            {book.publishedDate && (
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={16} color={Colors.text.secondary} />
                <Text style={styles.metaText}>
                  {new Date(book.publishedDate).getFullYear()}
                </Text>
              </View>
            )}
            
            {book.pageCount && (
              <View style={styles.metaItem}>
                <Ionicons name="document-text-outline" size={16} color={Colors.text.secondary} />
                <Text style={styles.metaText}>{book.pageCount} pages</Text>
              </View>
            )}
            
            {book.publisher && (
              <View style={styles.metaItem}>
                <Ionicons name="business-outline" size={16} color={Colors.text.secondary} />
                <Text style={styles.metaText}>{book.publisher}</Text>
              </View>
            )}
          </View>

          {/* Categories */}
          {book.categories && book.categories.length > 0 && (
            <View style={styles.categoriesContainer}>
              {book.categories.slice(0, 3).map((category, index) => (
                <View key={index} style={styles.categoryTag}>
                  <Text style={styles.categoryText}>{category}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Description */}
          {book.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Overview</Text>
              <Text style={styles.description}>{book.description}</Text>
            </View>
          )}

          {/* Read Button */}
          <TouchableOpacity style={styles.readButton}>
            <Text style={styles.readButtonText}>Read Book</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  backIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  coverSection: {
    width: '100%',
    height: 400,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImage: {
    width: 200,
    height: 300,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  placeholderCover: {
    width: 200,
    height: 300,
    borderRadius: 12,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginRight: 4,
  },
  ratingsCount: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryTag: {
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.text.secondary,
  },
  readButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  readButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});