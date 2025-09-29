import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalAuth } from './context/LocalAuthContext';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import { router } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';

export default function LockedScreen() {
  const { authenticate, availableTypes, isSupported, isEnrolled } = useLocalAuth();
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();

  const handleResult = (res) => {
    if (res?.success) {
      if (!isAuthenticated) {
        router.replace('/auth/login');
      } else {
        router.replace('/');
      }
    }
  };

  const onFingerprint = async () => {
    if (!availableTypes?.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) return;
    const res = await authenticate({
      promptMessage: 'สแกนลายนิ้วมือเพื่อปลดล็อก',
      // หลีกเลี่ยง fallback เป็นรหัสอุปกรณ์ เมื่อผู้ใช้เลือกวิธีชีวมิติ
      disableDeviceFallback: true,
      requireConfirmation: false,
    });
    handleResult(res);
  };

  const onFace = async () => {
    if (!availableTypes?.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) return;
    const res = await authenticate({
      promptMessage: 'สแกนใบหน้าเพื่อปลดล็อก',
      disableDeviceFallback: true,
      requireConfirmation: false,
    });
    handleResult(res);
  };

  const onDeviceCredential = async () => {
    const res = await authenticate({
      promptMessage: 'ยืนยันตัวตนด้วยรหัสอุปกรณ์',
      // อนุญาต fallback เป็นรหัส/แพทเทิร์นของอุปกรณ์
      disableDeviceFallback: false,
      requireConfirmation: false,
    });
    if (res?.success) {
      handleResult(res);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <Text style={[styles.title, { color: theme.text }]}>แอปถูกล็อก</Text>
      <Text style={[styles.subtitle, { color: theme.subText, textAlign: 'center' }]}>เลือกวิธีการยืนยันตัวตน</Text>

      {!isSupported && (
        <Text style={[styles.note, { color: theme.subText }]}>อุปกรณ์นี้ไม่รองรับการยืนยันตัวตนแบบชีวมิติ</Text>
      )}
      {isSupported && !isEnrolled && (
        <Text style={[styles.note, { color: theme.subText }]}>ยังไม่พบการลงทะเบียนชีวมิติในอุปกรณ์</Text>
      )}

      <View style={styles.buttons}>
        <Pressable
          onPress={onFingerprint}
          disabled={!availableTypes?.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)}
          style={[styles.choiceBtn, { backgroundColor: availableTypes?.includes(LocalAuthentication.AuthenticationType.FINGERPRINT) ? theme.primary : theme.switchTrack }]}
        >
          <Text style={styles.btnText}>สแกนลายนิ้วมือ</Text>
        </Pressable>

        <Pressable
          onPress={onFace}
          disabled={!availableTypes?.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)}
          style={[styles.choiceBtn, { backgroundColor: availableTypes?.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION) ? theme.primary : theme.switchTrack }]}
        >
          <Text style={styles.btnText}>สแกนใบหน้า</Text>
        </Pressable>
      </View>

      <Pressable style={[styles.btnAlt, { borderColor: theme.primary }]} onPress={onDeviceCredential}>
        <Text style={[styles.btnAltText, { color: theme.primary }]}>ใช้รหัสอุปกรณ์แทน</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 16 },
  note: { fontSize: 14, marginBottom: 12, textAlign: 'center' },
  buttons: { width: '100%', gap: 12, marginTop: 8 },
  choiceBtn: { paddingHorizontal: 20, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  btnAlt: { marginTop: 16, paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10, borderWidth: 1 },
  btnAltText: { fontWeight: '600' },
});
