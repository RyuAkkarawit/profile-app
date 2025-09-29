import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalAuth } from '../context/LocalAuthContext';
import { useTheme } from '../context/ThemeContext';

export default function LockedScreen() {
  const { authenticate } = useLocalAuth();
  const { theme } = useTheme();

  const onUnlock = async () => {
    await authenticate({ promptMessage: 'ยืนยันตัวตนเพื่อปลดล็อก' });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <Text style={[styles.title, { color: theme.text }]}>แอปถูกล็อก</Text>
      <Text style={[styles.subtitle, { color: theme.subText }]}>ยืนยันตัวตนเพื่อใช้งานต่อ</Text>
      <Pressable style={[styles.btn, { backgroundColor: theme.primary }]} onPress={onUnlock}>
        <Text style={styles.btnText}>ปลดล็อก</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 16 },
  btn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  btnText: { color: '#fff', fontWeight: 'bold' }
});
