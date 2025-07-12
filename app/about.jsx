import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from './context/ThemeContext';
import { useNavigation } from 'expo-router';

export default function AboutScreen() {
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const nav = useNavigation();

  useLayoutEffect(() => {
    nav.setOptions({
      headerTitle: "About",
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
          <Feather name={isDarkMode ? 'moon' : 'sun'} size={20} color={theme.text} style={{ marginRight: 6 }} />
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.switchTrack, true: theme.primary }}
            thumbColor="#fff"
          />
        </View>
      )
    });
  }, [isDarkMode]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        {/* แก้ให้เป็น 2 บรรทัดและจัดกึ่งกลาง */}
        <Text style={[styles.title, { color: theme.text, textAlign: 'center' }]}>
          Hybrid Mobile Application Programming
        </Text>
        <Text style={[styles.subtitle, { color: theme.text, textAlign: 'center', marginBottom: 12 }]}>
          with React Native
        </Text>

        <Text style={[styles.section, { color: theme.subText }]}>
          คำอธิบายรายวิชา (ไทย):
        </Text>
        <Text style={[styles.content, { color: theme.subText }]}>
          สถาปัตยกรรมฮาร์ดแวร์ คุณลักษณะและข้อจำกัดของอุปกรณ์เคลื่อนที่ เครื่องมือและภาษาที่ใช้สำหรับพัฒนาโปรแกรมประยุกต์บนอุปกรณ์เคลื่อนที่หลากหลายแพลตฟอร์ม การพัฒนาโปรแกรมประยุกต์บนอุปกรณ์เคลื่อนที่โดยใช้ภาษาหลากหลายแพลตฟอร์ม กระบวนการพัฒนาโปรแกรมประยุกต์บนอุปกรณ์เคลื่อนที่หลากหลายแพลตฟอร์ม การใช้หน่วยความจำและส่วนเก็บบันทึกข้อมูล การขออนุญาตและการเข้าถึงส่วนฮาร์ดแวร์ ส่วนติดต่อกับผู้ใช้ การสื่อสารเครือข่ายกับภายนอก การเชื่อมโยงกับระบบเครื่องแม่ข่าย การทดสอบโปรแกรมประยุกต์บนอุปกรณ์เคลื่อนที่โดยใช้ระบบคอมพิวเตอร์ ประเด็นด้านความมั่นคง การฝึกปฏิบัติ
        </Text>

        <Text style={[styles.section, { color: theme.subText }]}>
          คำอธิบายรายวิชา (อังกฤษ):
        </Text>
        <Text style={[styles.content, { color: theme.subText }]}>
          Hardware architecture, characteristics and limitations of mobile devices, tools and languages for cross-platform mobile application development, cross-platform language programming, cross-platform application development process for mobile devices, how to use memory and data store, user permission and hardware access permission, user interface, communication with external systems, interfacing with servers, mobile application testing using computer system simulation, security issues, hands-on practice.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  section: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 6,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});
