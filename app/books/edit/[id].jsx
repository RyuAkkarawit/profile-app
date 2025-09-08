import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useBooksApi } from '../../lib/booksClient';
import { useLocalSearchParams, router } from 'expo-router';
import { useBooksEvents } from '../../context/BooksContext';

export default function EditBookScreen() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams();
  const { getById, update } = useBooksApi();
  const { notifyChange } = useBooksEvents();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await getById(id);
        const b = res.book;
        setTitle(b.title || '');
        setAuthor(b.author || '');
        setDescription(b.description || '');
        setGenre(b.genre || '');
        setYear(b.year ? String(b.year) : '');
        setPrice(b.price !== undefined ? String(b.price) : '');
      } catch (e) {
        Alert.alert('โหลดข้อมูลไม่สำเร็จ', e.message || 'เกิดข้อผิดพลาด');
      }
    })();
  }, [getById, id]);

  const onSubmit = async () => {
    try {
      const payload = {
        title: title || undefined,
        author: author || undefined,
        description: description || undefined,
        genre: genre || undefined,
        year: year ? Number(year) : undefined,
        price: price ? Number(price) : undefined,
      };
      const res = await update(id, payload);
      notifyChange('update');
      router.replace(`/books/${id}`);
    } catch (e) {
      Alert.alert('บันทึกไม่สำเร็จ', e.message || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <View style={{
        backgroundColor: theme.primary,
        paddingTop: 40,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
      }}>
        <Text style={{ color: '#fff', fontSize: 26, fontWeight: '800', textAlign: 'center' }}>
          ✏️ แก้ไขหนังสือ
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, textAlign: 'center', marginTop: 8 }}>
          อัปเดตข้อมูลหนังสือ
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <View style={{
          backgroundColor: theme.card,
          borderRadius: 24,
          padding: 24,
          shadowColor: theme.primary,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.15,
          shadowRadius: 15,
          elevation: 8,
          borderWidth: 1,
          borderColor: theme.primary + '20'
        }}>
          <View style={{ gap: 20 }}>
            <FormInput label="📚 ชื่อหนังสือ" value={title} onChangeText={setTitle} theme={theme} />
            <FormInput label="✍️ ผู้แต่ง" value={author} onChangeText={setAuthor} theme={theme} />
            <FormInput label="📝 คำอธิบาย" value={description} onChangeText={setDescription} theme={theme} multiline />
            <FormInput label="🏷️ หมวด/แนว" value={genre} onChangeText={setGenre} theme={theme} />
            <FormInput label="📅 ปีที่พิมพ์" value={year} onChangeText={setYear} theme={theme} keyboardType="number-pad" />
            <FormInput label="💰 ราคา (บาท)" value={price} onChangeText={setPrice} theme={theme} keyboardType="decimal-pad" />
            
            <Pressable 
              onPress={onSubmit} 
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? theme.primary + 'DD' : theme.primary,
                  paddingVertical: 18,
                  borderRadius: 20,
                  alignItems: 'center',
                  marginTop: 8,
                  shadowColor: theme.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                  transform: [{ scale: pressed ? 0.98 : 1 }]
                }
              ]}
            >
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 18 }}>💾 บันทึกการแก้ไข</Text>
            </Pressable>
          </View>
        </View>

        {/* Helper Text */}
        <View style={{
          backgroundColor: theme.primary + '08',
          borderRadius: 16,
          padding: 16,
          marginTop: 20,
          borderLeftWidth: 4,
          borderLeftColor: theme.primary
        }}>
          <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600', marginBottom: 4 }}>💡 เคล็ดลับ</Text>
          <Text style={{ color: theme.subText, fontSize: 14, lineHeight: 20 }}>
            แก้ไขเฉพาะฟิลด์ที่ต้องการเปลี่ยน หรือปล่อยว่างเพื่อลบข้อมูลนั้นออก
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function FormInput({ label, theme, style, multiline, ...rest }) {
  return (
    <View>
      <Text style={{ 
        color: theme.text, 
        marginBottom: 8, 
        fontWeight: '700', 
        fontSize: 16
      }}>
        {label}
      </Text>
      <View style={{
        backgroundColor: theme.card,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: theme.primary + '30',
        shadowColor: theme.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
      }}>
        <TextInput
          style={[
            {
              color: theme.text,
              paddingHorizontal: 16,
              paddingVertical: multiline ? 16 : 14,
              fontSize: 16,
              minHeight: multiline ? 100 : undefined,
              textAlignVertical: multiline ? 'top' : 'center'
            }, 
            style
          ]}
          placeholderTextColor={theme.subText + '80'}
          multiline={multiline}
          {...rest}
        />
      </View>
    </View>
  );
}
