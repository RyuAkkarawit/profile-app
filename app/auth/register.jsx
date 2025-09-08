import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Link, router } from 'expo-router';

export default function RegisterScreen() {
  const { theme } = useTheme();
  const { register, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated]);

  const onSubmit = async () => {
    if (!username || !email || !password) {
      Alert.alert('กรอกข้อมูลไม่ครบ', 'โปรดระบุชื่อผู้ใช้ อีเมล และรหัสผ่าน');
      return;
    }
    setSubmitting(true);
    try {
      await register({ username, email, password });
      router.replace('/');
    } catch (e) {
      Alert.alert('สมัครสมาชิกไม่สำเร็จ', e.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>สมัครสมาชิก</Text>
      <TextInput
        style={styles.input}
        placeholder="ชื่อผู้ใช้ (a-z0-9_)"
        placeholderTextColor={theme.subText}
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />
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
        placeholder="รหัสผ่าน (อย่างน้อย 6 ตัว)"
        placeholderTextColor={theme.subText}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Pressable style={styles.button} onPress={onSubmit} disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>สมัครสมาชิก</Text>
        )}
      </Pressable>
      <Text style={styles.helper}>มีบัญชีอยู่แล้ว?
        {' '}
        <Link href="/auth/login" style={{ color: theme.primary, textDecorationLine: 'underline' }}>เข้าสู่ระบบ</Link>
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
