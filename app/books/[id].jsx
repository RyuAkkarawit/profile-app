import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Pressable, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useBooksApi } from '../lib/booksClient';
import { useLocalSearchParams, router, Link } from 'expo-router';
import { useBooksEvents } from '../context/BooksContext';

export default function BookDetailScreen() {
  const { theme } = useTheme();
  const { getById, remove } = useBooksApi();
  const { id } = useLocalSearchParams();
  const { revision, notifyChange } = useBooksEvents();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getById(id);
      setBook(res.book);
    } catch (e) {
      Alert.alert('ผิดพลาด', e.message || 'โหลดข้อมูลไม่ได้');
    } finally {
      setLoading(false);
    }
  }, [getById, id]);

  useEffect(() => { load(); }, [load, revision]);

  const onDelete = async () => {
    console.log('Delete button pressed for book:', id);
    const confirmed = confirm('คุณต้องการลบหนังสือเล่มนี้หรือไม่?');
    if (!confirmed) {
      console.log('User cancelled delete');
      return;
    }
    
    console.log('User confirmed delete');
    try {
      await remove(id);
      notifyChange('delete');
      router.replace('/books');
    } catch (e) {
      console.error('Delete error:', e);
      alert('ลบไม่สำเร็จ: ' + (e.message || 'เกิดข้อผิดพลาด'));
    }
  };

  if (loading) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background }}><ActivityIndicator color={theme.primary} /></View>;
  }

  if (!book) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background }}><Text style={{ color: theme.text }}>ไม่พบหนังสือ</Text></View>;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Hero Section */}
      <View style={{
        backgroundColor: theme.primary,
        paddingTop: 40,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
      }}>
        <Text style={{ color: '#fff', fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 8 }}>
          📖 รายละเอียดหนังสือ
        </Text>
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}>
        {/* Main Book Card */}
        <View style={{
          backgroundColor: theme.card,
          borderRadius: 24,
          padding: 24,
          marginBottom: 24,
          borderWidth: 1,
          borderColor: theme.primary + '20',
          shadowColor: theme.primary,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.15,
          shadowRadius: 15,
          elevation: 8
        }}>
          {/* Title and Status */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <View style={{ flex: 1, marginRight: 16 }}>
              <Text style={{ color: theme.text, fontSize: 24, fontWeight: '900', lineHeight: 32, marginBottom: 8 }}>
                {book.title}
              </Text>
              <Text style={{ color: theme.subText, fontSize: 18, fontWeight: '600' }}>
                โดย {book.author}
              </Text>
            </View>
            {typeof book.available === 'boolean' && (
              <View style={{
                backgroundColor: book.available ? '#4CAF50' : '#F44336',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                shadowColor: book.available ? '#4CAF50' : '#F44336',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 3
              }}>
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>
                  {book.available ? '✅ พร้อม' : '❌ ไม่พร้อม'}
                </Text>
              </View>
            )}
          </View>

          {/* Tags Row */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
            {book.genre && (
              <View style={{
                backgroundColor: theme.primary + '15',
                borderColor: theme.primary,
                borderWidth: 1.5,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20
              }}>
                <Text style={{ color: theme.primary, fontSize: 14, fontWeight: '700' }}>🏷️ {book.genre}</Text>
              </View>
            )}
            {book.year && (
              <View style={{
                backgroundColor: theme.skillTagBackground,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20
              }}>
                <Text style={{ color: theme.skillTextColor, fontSize: 14, fontWeight: '700' }}>📅 ปี {book.year}</Text>
              </View>
            )}
            {book.price !== undefined && (
              <View style={{
                backgroundColor: '#FFE0B2',
                borderColor: '#FF9800',
                borderWidth: 1.5,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20
              }}>
                <Text style={{ color: '#E65100', fontSize: 14, fontWeight: '700' }}>💰 {book.price} บาท</Text>
              </View>
            )}
          </View>

          {/* Description */}
          {book.description && (
            <View style={{
              backgroundColor: theme.background,
              borderRadius: 16,
              padding: 16,
              marginBottom: 16
            }}>
              <Text style={{ color: theme.subText, fontSize: 14, fontWeight: '600', marginBottom: 8 }}>📝 คำอธิบาย</Text>
              <Text style={{ color: theme.text, fontSize: 16, lineHeight: 24 }}>{book.description}</Text>
            </View>
          )}

          {/* Author Info */}
          {book.addedBy && (
            <View style={{
              backgroundColor: theme.primary + '08',
              borderRadius: 16,
              padding: 16,
              borderLeftWidth: 4,
              borderLeftColor: theme.primary
            }}>
              <Text style={{ color: theme.subText, fontSize: 14, fontWeight: '600', marginBottom: 4 }}>👤 เพิ่มโดย</Text>
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: '600' }}>
                {book.addedBy.username}
              </Text>
              <Text style={{ color: theme.subText, fontSize: 14 }}>
                {book.addedBy.email}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Link href={{ pathname: '/books/edit/[id]', params: { id } }} asChild style={{ flex: 1 }}>
            <Pressable 
              style={({ pressed }) => [
                {
                  flex: 1,
                  backgroundColor: pressed ? theme.primary + 'DD' : theme.primary,
                  paddingVertical: 18,
                  borderRadius: 20,
                  shadowColor: theme.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                  transform: [{ scale: pressed ? 0.98 : 1 }]
                }
              ]}
            >
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16, textAlign: 'center' }}>
                ✏️ แก้ไข
              </Text>
            </Pressable>
          </Link>
          
          <Pressable 
            onPress={onDelete}
            style={({ pressed }) => [
              {
                flex: 1,
                backgroundColor: pressed ? '#D32F2F' : '#F44336',
                paddingVertical: 18,
                borderRadius: 20,
                shadowColor: '#F44336',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
                transform: [{ scale: pressed ? 0.98 : 1 }]
              }
            ]}
          >
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16, textAlign: 'center' }}>
              🗑️ ลบ
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
