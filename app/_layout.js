import { Stack, router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BooksProvider } from './context/BooksContext';
import { LocalAuthProvider, useLocalAuth } from './context/LocalAuthContext';
import React, { useCallback, useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';

export default function Layout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LocalAuthProvider>
          <BooksProvider>
            <RootNavigator />
          </BooksProvider>
        </LocalAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { isAuthenticated, loading, logout } = useAuth();
  const { enabled, isUnlocked, checking, authenticate } = useLocalAuth();

  // Centralized navigation guard: decide between Locked, Login, or App
  useEffect(() => {
    if (loading || checking) return;
    // If local auth is enabled and locked, go to locked screen first
    if (enabled && !isUnlocked) {
      router.replace('/locked');
      return;
    }
    // Otherwise, if not authenticated, go to login
    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }
    // If authenticated and unlocked, stay wherever the user is (home/books/etc.)
  }, [loading, checking, enabled, isUnlocked, isAuthenticated]);

  // Prompt biometric when screen focused and locked
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        if (enabled && !isUnlocked) {
          const res = await authenticate({ promptMessage: 'ยืนยันตัวตนเพื่อใช้งานต่อ' });
          if (!cancelled && !res.success) {
            // stay on lock view
          }
        }
      })();
      return () => { cancelled = true; };
    }, [enabled, isUnlocked])
  );

  // No extra navigation effect needed; the guard above handles transitions

  return (
    <Stack
      screenOptions={{
        headerRight: () => (
          isAuthenticated ? (
            <Pressable onPress={logout} style={{ paddingHorizontal: 12 }}>
              <Text>ออกจากระบบ</Text>
            </Pressable>
          ) : null
        )
      }}
    >
      <Stack.Screen name="locked" options={{ headerShown: false }} />
    </Stack>
  );
}
