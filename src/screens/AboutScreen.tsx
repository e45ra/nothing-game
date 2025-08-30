import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Linking, 
  ScrollView,
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DEVELOPER_IMAGE = 'https://avatars.githubusercontent.com/u/74983295?v=4';

const AboutScreen = ({ onClose }: { onClose: () => void }) => {
  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={28} color="#fff" />
      </TouchableOpacity>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>About e45ra</Text>
          
          <View style={styles.developerSection}>
            <Image 
              source={{ uri: DEVELOPER_IMAGE }} 
              style={styles.developerImage}
            />
            <Text style={styles.developerName}>Erfan (e45ra)</Text>
            <Text style={styles.developerTitle}>just a Developer</Text>
          </View>
          
          <View style={styles.gameInfo}>
            <Text style={styles.sectionTitle}>About Me</Text>
            <Text style={styles.description}>
              I’m an solo developer passionate about building modern apps with 
              clean design and strong real-time features. 
            </Text>
            <Text style={styles.description}>
              I’ve worked on projects like:
              {"\n"}• Plaify – a music streaming app with chat & social features
              {"\n"}• Taxi Pay – a taxi hailing & payment system
              {"\n"}• Real-time messaging apps powered by Supabase
            </Text>
          </View>
          
          <View style={styles.socialSection}>
            <Text style={styles.sectionTitle}>Connect With Me</Text>
            <View style={styles.socialLinks}>
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => openLink('https://t.me/e45ra')}
              >
                <Ionicons name="paper-plane" size={24} color="#fff" />
                <Text style={styles.socialText}>Telegram</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => openLink('https://github.com/e45ra')}
              >
                <Ionicons name="logo-github" size={24} color="#fff" />
                <Text style={styles.socialText}>GitHub</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => openLink('https://instagram.com/e45ra')}
              >
                <Ionicons name="logo-instagram" size={24} color="#fff" />
                <Text style={styles.socialText}>Instagram</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.techSection}>
            <Text style={styles.sectionTitle}>Tech Stack</Text>
            <View style={styles.techList}>
              <View style={styles.techItem}>
                <Text style={styles.techText}>React Native</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={styles.techText}>Expo</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={styles.techText}>Supabase</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={styles.techText}>TypeScript</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={styles.techText}>Node.js</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={styles.techText}>Rust (backend)</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={styles.techText}>Tailwind</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={styles.techText}>Next.js</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={styles.techText}>react.js</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={styles.techText}>svelte.js</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={styles.techText}>nuxt.js</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={styles.techText}>and more...</Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.footer}>© 2025 e45ra. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  content: { padding: 20, alignItems: 'center' },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: '#222',
    borderRadius: 20,
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginTop: 60,
    marginBottom: 30,
    textAlign: 'center',
    letterSpacing: 1,
  },
  developerSection: { alignItems: 'center', marginBottom: 40 },
  developerImage: {
    width: 150, height: 150, borderRadius: 75,
    marginBottom: 16, borderWidth: 3, borderColor: '#4ecdc4',
  },
  developerName: { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 4 },
  developerTitle: { fontSize: 16, color: '#4ecdc4', fontWeight: '500' },
  gameInfo: { marginBottom: 40, width: '100%' },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 16, textAlign: 'center' },
  description: { fontSize: 16, color: '#ccc', textAlign: 'center', lineHeight: 24, marginBottom: 16 },
  socialSection: { marginBottom: 40, width: '100%' },
  socialLinks: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  socialButton: { alignItems: 'center', backgroundColor: '#222', padding: 16, borderRadius: 12, minWidth: 100 },
  socialText: { color: '#fff', marginTop: 8, fontWeight: '600' },
  techSection: { marginBottom: 30, width: '100%' },
  techList: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  techItem: { backgroundColor: '#222', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, margin: 4 },
  techText: { color: '#4ecdc4', fontWeight: '600' },
  footer: { color: '#666', fontSize: 12, marginTop: 20 },
});

export default AboutScreen;
