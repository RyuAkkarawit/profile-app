import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { router } from 'expo-router';

// Determine API base URL
// Prefer EXPO_PUBLIC_API_URL; otherwise attempt to infer LAN IP from dev server for physical devices
function computeDefaultApiBase() {
  try {
    const hostUri = Constants?.expoConfig?.hostUri || Constants?.manifest2?.extra?.expoGo?.developer?.host;
    if (hostUri) {
      // Examples: '192.168.1.10:19000', 'localhost:19000', 'exp.host/...' (ignore)
      const hostMatch = String(hostUri).match(/^([\w.-]+)(?::\d+)?/);
      const host = hostMatch?.[1];
      if (host && host !== 'localhost') {
        return `http://${host}:3000`;
      }
      if (host === 'localhost' && Platform.OS === 'android') {
        // Android emulator cannot reach host's localhost directly
        return 'http://10.10.24.12:3000';
      }
    }
  } catch {}
  return 'http://localhost:3000';
}

// Public env for Expo: set EXPO_PUBLIC_API_URL to override base URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || computeDefaultApiBase();

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hydrate auth state from storage
    (async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          SecureStore.getItemAsync(TOKEN_KEY),
          SecureStore.getItemAsync(USER_KEY),
        ]);
        if (storedToken) setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (e) {
        // no-op; keep unauthenticated state
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveSession = async (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    await Promise.all([
      SecureStore.setItemAsync(TOKEN_KEY, nextToken ?? ''),
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(nextUser ?? {})),
    ]);
  };

  const clearSession = async () => {
    setToken(null);
    setUser(null);
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_KEY),
    ]);
  };

  const handleUnauthorized = async (reason) => {
    await clearSession();
    Alert.alert('เซสชันหมดอายุ', 'โปรดเข้าสู่ระบบใหม่', [
      { text: 'ตกลง', onPress: () => router.replace('/auth/login') },
    ]);
  };

  const fetchWithAuth = async (path, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      // Treat as expired/invalid token
      try { await res.json(); } catch {}
      await handleUnauthorized('unauthorized');
      throw new Error('Unauthorized');
    }
    return res;
  };

  const login = async ({ email, password }) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      const message = data?.errors?.[0]?.msg || data?.error || 'Login failed';
      throw new Error(message);
    }
    await saveSession(data.token, data.user);
    return data;
  };

  const register = async ({ username, email, password }) => {
    // Send only fields that API requires
    const payload = { username, email, password };
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      const message = data?.errors?.[0]?.msg || data?.error || 'Registration failed';
      throw new Error(message);
    }
    await saveSession(data.token, data.user);
    return data;
  };

  const logout = async () => {
    await clearSession();
    router.replace('/auth/login');
  };

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout,
    fetchWithAuth,
    API_BASE_URL,
  }), [token, user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
