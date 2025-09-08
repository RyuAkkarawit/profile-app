import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Link, router } from 'expo-router';

export default function LoginScreen() {
  const { theme } = useTheme();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated]);

  const onSubmit = async () => {
    if (!email || !password) {
      Alert.alert('กรอกข้อมูลไม่ครบ', 'โปรดระบุอีเมลและรหัสผ่าน');
      return;
    }
    setSubmitting(true);
    try {
      await login({ email, password });
      router.replace('/');
    } catch (e) {
      Alert.alert('เข้าสู่ระบบไม่สำเร็จ', e.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>เข้าสู่ระบบ</Text>
      <TextInput
        style={styles.input}
        placeholder="อีเมล"
        placeholderTextColor={theme.subText}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="รหัสผ่าน"
        placeholderTextColor={theme.subText}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Pressable style={styles.button} onPress={onSubmit} disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
        )}
      </Pressable>
      <Text style={styles.helper}>ยังไม่มีบัญชี?
        {' '}
        <Link href="/auth/register" style={{ color: theme.primary, textDecorationLine: 'underline' }}>สมัครสมาชิก</Link>
      </Text>
    </View>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 16,
    textAlign: 'center'
  },
  input: {
    backgroundColor: theme.card,
    color: theme.text,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.primary,
    marginBottom: 12,
  },
  button: {
    backgroundColor: theme.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  helper: {
    marginTop: 16,
    color: theme.subText,
    textAlign: 'center',
  }
});
