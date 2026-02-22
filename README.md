
### Core Functionality
- **Search Books** - Search by title, author, or keywords with real-time results
- **Book Details** - View comprehensive information about each book including:
  - Cover image
  - Title and authors
  - Ratings and reviews count
  - Publication year
  - Page count
  - Publisher information
  - Categories/genres
  - Full description

###  Technical Features

- **Expo Router** - File-based navigation
- **Google Books API** - Primary data source
- **Responsive Design** - Works on all screen sizes

### Installation

1. **Create a new Expo project:**
```bash
npx create-expo-app book-explorer --template tabs
cd book-explorer
```

2. **Install dependencies:**
```bash
npm install axios @expo/vector-icons expo-linear-gradient
```

3. **Copy the project files:**
- Copy all provided files to their respective locations
- Follow the project structure above

4. **Start the development server:**
```bash
npx expo start
```

5. **Run on device:**
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on your phone

## Screens

### 1. Search Screen (Home)
- Search bar with real-time search
- Displays trending books by default
- Dynamic search results
- Pull to refresh

### 2. Discover Screen
- Category browsing
- Quick category selection
- Filtered book lists

### 3. Book Detail Screen
- Full book information
- Beautiful cover display
- Star ratings
- Meta information
- Categories
- Full description
- "Read Book" action button

## 🔌 API Integration

### Google Books API
- **Base URL:** `https://www.googleapis.com/books/v1`
- **No API Key Required** for basic usage
- **Endpoints Used:**
  - `/volumes` - Search books
  - `/volumes/{id}` - Get book details

### Error Handling
- Network errors
- API errors
- 404 Not Found
- Timeout handling
- User-friendly error messages

## Design System

### Colors
```typescript
Primary: #4ECDC4      // Turquoise/Teal
Background: #F8F9FA   // Light Gray
Text Primary: #1A1A1A // Dark Gray
Text Secondary: #6C757D
Rating Star: #FFB800   // Gold
```

### Typography
- **Headings:** 24-28px, Bold
- **Body:** 14-16px, Regular
- **Small Text:** 12-14px

### Components
- **BookCard** - Reusable book list item
- **SearchBar** - Custom search input
- **LoadingSpinner** - Loading states
- **Error Messages** - User-friendly errors

##  Testing

### Manual Testing Checklist
- [ ] Search functionality
- [ ] Book detail navigation
- [ ] Category browsing
- [ ] Pull to refresh
- [ ] Error states
- [ ] Loading states
- [ ] Empty states
- [ ] Back navigation

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

### EAS Build (Recommended)
```bash
eas build --platform ios
eas build --platform android
```

## 🔧 Customization

### Change Colors
Edit `constants/Colors.ts`:
```typescript
export const Colors = {
  primary: '#YOUR_COLOR',
  // ...
};
```

### Add More API Sources
Create new files in `services/api/`:
```typescript
// services/api/openLibrary.ts
export const openLibraryApi = {
  searchBooks: async (query: string) => {
    // Implementation
  }
};
```

### Add Features
- Favorites/Bookmarks
- Reading lists
- Book reviews
- Share functionality
- Dark mode
- Offline support

## Common Issues

### Issue: Module not found
**Solution:** Run `npm install` or `npx expo install`

### Issue: Images not loading
**Solution:** Check internet connection and API response

### Issue: TypeScript errors
**Solution:** Run `npx tsc` to check types

## License

MIT License - feel free to use for personal or commercial projects



**Built with ❤️ using React Native + Expo**
