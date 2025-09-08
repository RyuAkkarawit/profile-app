import { Stack, router } from 'expo-router';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BooksProvider } from './context/BooksContext';
import React, { useEffect } from 'react';
import { Pressable, Text } from 'react-native';

export default function Layout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BooksProvider>
          <RootNavigator />
        </BooksProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { isAuthenticated, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Redirect unauthenticated users to login
        router.replace('/auth/login');
      }
    }
  }, [loading, isAuthenticated]);

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
    />
  );
}
