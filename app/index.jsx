import React, { useLayoutEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Link, useNavigation } from 'expo-router';
import { useTheme } from './context/ThemeContext';
import { Switch } from 'react-native';

const profileData = {
  name: "อัครวิชญ์ พบวงษา",
  studentId: "653450108-3",
  program: "วิทยาการคอมพิวเตอร์และสารสนเทศ",
  university: "มหาวิทยาลัยขอนแก่น หนองคาย",
  profileImage: require('../assets//profile.jpg'),
  skills: ["React", "JavaScript", "HTML", "TypeScript"],
  workExperience: {
    project: "",
    role: "Frontend Developer Intern - BotNoi Group",
    tasks: [
      "พัฒนา Frontend สำหรับ AI Friend's Hub ",
      "ออกแบบ Frontend สำหรับ Docsearch B2C",
    ]
  }
};

export default function ProfilePage() {
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const nav = useNavigation();

  useLayoutEffect(() => {
    nav.setOptions({
      headerTitle: 'โปรไฟล์',
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

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileCard}>
          <Image source={profileData.profileImage} style={styles.profileImage} />
          <Text style={styles.name}>{profileData.name}</Text>
          <View style={styles.infoRow}>
            <Feather name="hash" size={16} color={theme.subText} />
            <Text style={styles.infoText}>{profileData.studentId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Feather name="book-open" size={16} color={theme.subText} />
            <Text style={styles.infoText}>{profileData.program}</Text>
          </View>
          <View style={styles.infoRow}>
            <Feather name="award" size={16} color={theme.subText} />
            <Text style={styles.infoText}>{profileData.university}</Text>
          </View>
        </View>

        <View style={styles.skillsCard}>
          <Text style={styles.cardTitle}>ความสามารถ (Skills)</Text>
          <View style={styles.skillsContainer}>
            {profileData.skills.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.workCard}>
          <Text style={styles.cardTitle}>ประสบการณ์การทำงาน</Text>
          <Text style={styles.workTitle}>{profileData.workExperience.role}</Text>
          <Text style={styles.workDesc}>{profileData.workExperience.project}</Text>
          <View style={styles.taskList}>
            {profileData.workExperience.tasks.map((task, index) => (
              <View key={index} style={styles.taskItem}>
                <Feather name="check-circle" size={16} color={theme.primary} />
                <Text style={styles.taskText}>{task}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Link href="/about">
            <Text style={{
              color: theme.primary,
              fontSize: 16,
              fontWeight: 'bold',
              textDecorationLine: 'underline',
              textAlign: 'center'
            }}>
              ไปยังหน้า About
            </Text>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 👇 ไม่เปลี่ยนส่วน getStyles


const getStyles = (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  themeToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  profileCard: {
    width: '100%',
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: theme.primary,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: theme.primary,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: theme.subText,
    marginLeft: 8,
  },
  skillsCard: {
    width: '100%',
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: theme.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 15,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillTag: {
    backgroundColor: theme.skillTagBackground,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.primary,
  },
  skillText: {
    color: theme.skillTextColor,
    fontSize: 14,
    fontWeight: '600',
  },
  workCard: {
    width: '100%',
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    marginBottom: 30,
    ...Platform.select({
      ios: {
        shadowColor: theme.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  workTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
  },
  workDesc: {
    fontSize: 14,
    color: theme.subText,
    marginBottom: 12,
  },
  taskList: {
    paddingLeft: 4,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskText: {
    fontSize: 14,
    color: theme.subText,
    marginLeft: 8,
  },
});
