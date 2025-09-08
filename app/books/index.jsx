import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Pressable, TextInput } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useBooksApi } from '../lib/booksClient';
import { Link, router } from 'expo-router';
import { useBooksEvents } from '../context/BooksContext';

function BookItem({ item, theme }) {
  return (
    <Pressable
      onPress={() => router.push(`/books/${item._id}`)}
      style={({ pressed }) => [
        {
          backgroundColor: theme.card,
          borderRadius: 20,
          padding: 20,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: theme.primary + '20',
          shadowColor: theme.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 6,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        pressed && { opacity: 0.9 }
      ]}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: theme.text, marginBottom: 4 }} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={{ fontSize: 15, color: theme.subText, fontWeight: '500' }} numberOfLines={1}>
            โดย {item.author}
          </Text>
        </View>
        {typeof item.available === 'boolean' && (
          <View style={{
            backgroundColor: item.available ? '#4CAF50' : '#F44336',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
            minWidth: 60,
            alignItems: 'center'
          }}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>
              {item.available ? 'พร้อม' : 'ไม่พร้อม'}
            </Text>
          </View>
        )}
      </View>
      
      {item.description && (
        <Text style={{ fontSize: 14, color: theme.subText, lineHeight: 20, marginBottom: 12 }} numberOfLines={2}>
          {item.description}
        </Text>
      )}
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {item.genre && (
          <View style={{
            backgroundColor: theme.primary + '15',
            borderColor: theme.primary,
            borderWidth: 1,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16
          }}>
            <Text style={{ color: theme.primary, fontSize: 13, fontWeight: '600' }}>{item.genre}</Text>
          </View>
        )}
        {item.year && (
          <View style={{
            backgroundColor: theme.skillTagBackground,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16
          }}>
            <Text style={{ color: theme.skillTextColor, fontSize: 13, fontWeight: '600' }}>ปี {item.year}</Text>
          </View>
        )}
        {item.price !== undefined && (
          <View style={{
            backgroundColor: '#FFE0B2',
            borderColor: '#FF9800',
            borderWidth: 1,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16
          }}>
            <Text style={{ color: '#E65100', fontSize: 13, fontWeight: '600' }}>{item.price} บาท</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export default function BooksListScreen() {
  const { theme } = useTheme();
  const { list } = useBooksApi();
  const { revision } = useBooksEvents();
  const [data, setData] = useState({ books: [], pagination: { page: 1, pages: 1 } });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch all pages to show everything
      const limit = 50;
      let page = 1;
      let all = [];
      let pages = 1;
      do {
        const res = await list({ page, limit, search: search || undefined });
        all = all.concat(res.books || []);
        pages = res?.pagination?.pages || 1;
        page += 1;
        // Safety break for extremely large datasets
        if (page > 200) break;
      } while (page <= pages);
      setData({ books: all, pagination: { page: 1, pages, total: all.length } });
    } catch (e) {
      setError(e.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
      setData({ books: [], pagination: { page: 1, pages: 1 } });
    } finally {
      setLoading(false);
    }
  }, [list, search]);

  useEffect(() => {
    load();
  }, [load, revision]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header with gradient */}
      <View style={{
        backgroundColor: theme.primary,
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: theme.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8
      }}>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 16, textAlign: 'center' }}>
          📚 ห้องสมุดหนังสือ
        </Text>
        
        {/* Search and Add Button */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1, position: 'relative' }}>
            <TextInput
              placeholder="🔍 ค้นหาชื่อ ผู้แต่ง หรือคำอธิบาย..."
              placeholderTextColor="rgba(255,255,255,0.7)"
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: '#fff',
                borderRadius: 16,
                paddingHorizontal: 20,
                paddingVertical: 14,
                fontSize: 16,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.3)'
              }}
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={load}
            />
          </View>
          <Link href="/books/new" asChild>
            <Pressable style={({ pressed }) => [
              {
                backgroundColor: pressed ? 'rgba(255,255,255,0.9)' : '#fff',
                paddingHorizontal: 20,
                paddingVertical: 14,
                borderRadius: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
                transform: [{ scale: pressed ? 0.95 : 1 }]
              }
            ]}>
              <Text style={{ color: theme.primary, fontWeight: '800', fontSize: 16 }}>+ เพิ่ม</Text>
            </Pressable>
          </Link>
        </View>
        
        {/* Stats */}
        {!loading && data.books.length > 0 && (
          <Text style={{ color: 'rgba(255,255,255,0.9)', marginTop: 12, textAlign: 'center', fontSize: 14 }}>
            📖 ทั้งหมด {data.books.length} เล่ม
          </Text>
        )}
      </View>

      {/* Content */}
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        {error ? (
          <View style={{ 
            backgroundColor: theme.card, 
            borderRadius: 16, 
            padding: 24, 
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#F44336'
          }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>⚠️</Text>
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: '600', marginBottom: 8, textAlign: 'center' }}>
              เกิดข้อผิดพลาด
            </Text>
            <Text style={{ color: theme.subText, textAlign: 'center', marginBottom: 8 }}>{error}</Text>
            <Text style={{ color: theme.subText, textAlign: 'center', fontSize: 12 }}>
              API: {process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={data.books}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <BookItem item={item} theme={theme} />}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={!loading ? (
              <View style={{ 
                backgroundColor: theme.card, 
                borderRadius: 16, 
                padding: 40, 
                alignItems: 'center',
                marginTop: 40
              }}>
                <Text style={{ fontSize: 64, marginBottom: 16 }}>📚</Text>
                <Text style={{ color: theme.text, fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
                  ยังไม่มีหนังสือ
                </Text>
                <Text style={{ color: theme.subText, textAlign: 'center' }}>
                  เริ่มต้นสร้างห้องสมุดของคุณกันเถอะ!
                </Text>
              </View>
            ) : null}
          />
        )}
      </View>
    </View>
  );
}

const styles = {
  // Removed old styles as they're now inline
};
