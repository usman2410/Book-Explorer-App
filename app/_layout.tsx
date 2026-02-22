
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="book/[id]" 
          options={{ 
            headerShown: false,
            presentation: 'card',
            animation: 'slide_from_right'
          }} 
        />
      </Stack>
    </SafeAreaProvider>
  );
}