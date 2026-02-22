
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Book } from '../app/services/api/types';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

interface BookCardProps {
  book: Book;
  onPress: () => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onPress }) => {
  const renderStars = (rating?: number) => {
    if (!rating) return null;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons key={i} name="star" size={14} color={Colors.rating.star} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons key={i} name="star-half" size={14} color={Colors.rating.star} />
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={14} color={Colors.rating.star} />
        );
      }
    }
    
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {book.coverImage || book.thumbnail ? (
          <Image
            source={{ uri: book.coverImage || book.thumbnail }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="book" size={40} color={Colors.text.light} />
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        
        <Text style={styles.author} numberOfLines={1}>
          {book.authors.join(', ')}
        </Text>
        
        {book.averageRating && (
          <View style={styles.ratingContainer}>
            {renderStars(book.averageRating)}
            <Text style={styles.ratingText}>
              {book.averageRating.toFixed(1)}
            </Text>
            {book.ratingsCount && (
              <Text style={styles.ratingsCount}>
                ({book.ratingsCount})
              </Text>
            )}
          </View>
        )}
        
        {book.publishedDate && (
          <Text style={styles.publishedDate}>
            {new Date(book.publishedDate).getFullYear()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: 80,
    height: 120,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginRight: 4,
  },
  ratingsCount: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  publishedDate: {
    fontSize: 12,
    color: Colors.text.light,
  },
});

export default BookCard;