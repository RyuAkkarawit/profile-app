import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { AppState, Platform } from 'react-native';

const ENABLED_KEY = 'local_auth_enabled';
const LAST_UNLOCK_TS_KEY = 'local_auth_last_unlock_ts';

const LocalAuthContext = createContext(null);

// Small helper to persist boolean flags
async function persistBool(key, value) {
  if (value === null || value === undefined) {
    await SecureStore.deleteItemAsync(key);
  } else {
    await SecureStore.setItemAsync(key, value ? '1' : '0');
  }
}

async function readBool(key, fallback = false) {
  try {
    const raw = await SecureStore.getItemAsync(key);
    if (raw === null || raw === undefined) return fallback;
    return raw === '1';
  } catch {
    return fallback;
  }
}

export function LocalAuthProvider({ children }) {
  const [enabled, setEnabled] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(true); // start unlocked until hydration complete
  const [isSupported, setIsSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [checking, setChecking] = useState(true);
  const appState = useRef(AppState.currentState);

  // Hydrate settings and capability on mount
  useEffect(() => {
    (async () => {
      try {
        const [supported, enrolled, types, storedEnabled] = await Promise.all([
          LocalAuthentication.hasHardwareAsync(),
          LocalAuthentication.isEnrolledAsync(),
          LocalAuthentication.supportedAuthenticationTypesAsync(),
          readBool(ENABLED_KEY, false),
        ]);
        setIsSupported(!!supported);
        setIsEnrolled(!!enrolled);
        setAvailableTypes(types || []);
        setEnabled(storedEnabled && supported && enrolled);
        // If enabled, require unlock
        setIsUnlocked(!(storedEnabled && supported && enrolled));
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  // Lock when app goes background and local auth is enabled
  useEffect(() => {
    const sub = AppState.addEventListener('change', async (nextState) => {
      const prev = appState.current;
      appState.current = nextState;
      if (enabled) {
        if (prev === 'active' && (nextState === 'inactive' || nextState === 'background')) {
          setIsUnlocked(false);
        }
      }
    });
    return () => sub.remove();
  }, [enabled]);

  const authenticate = async (options = {}) => {
    if (!enabled) {
      setIsUnlocked(true);
      return { success: true, warning: 'Local auth disabled' };
    }
    if (!isSupported || !isEnrolled) {
      setIsUnlocked(true);
      return { success: true, warning: 'Device not enrolled; bypassing' };
    }

    const defaultReason = Platform.select({
      ios: 'Authenticate to continue',
      android: 'ยืนยันตัวตนเพื่อใช้งานต่อ',
      default: 'Authenticate',
    });

    const res = await LocalAuthentication.authenticateAsync({
      promptMessage: options.promptMessage || defaultReason,
      cancelLabel: options.cancelLabel || 'Cancel',
      disableDeviceFallback: false,
      requireConfirmation: false,
    });

    if (res.success) {
      setIsUnlocked(true);
      await SecureStore.setItemAsync(LAST_UNLOCK_TS_KEY, String(Date.now()));
    }
    return res;
  };

  const enableLocalAuth = async (value) => {
    setEnabled(value);
    await persistBool(ENABLED_KEY, !!value);
    if (value) {
      setIsUnlocked(false);
      // optionally prompt immediately
      try { await authenticate({ promptMessage: 'ยืนยันตัวตน (เปิดใช้งาน)' }); } catch {}
    } else {
      setIsUnlocked(true);
    }
  };

  const value = useMemo(() => ({
    // state
    enabled,
    isUnlocked,
    checking,
    // capabilities
    isSupported,
    isEnrolled,
    availableTypes,
    // actions
    authenticate,
    setEnabled: enableLocalAuth,
  }), [enabled, isUnlocked, checking, isSupported, isEnrolled, availableTypes]);

  return (
    <LocalAuthContext.Provider value={value}>
      {children}
    </LocalAuthContext.Provider>
  );
}

export function useLocalAuth() {
  return useContext(LocalAuthContext);
}
