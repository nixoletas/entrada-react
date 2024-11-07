import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

export default function TabTwoScreen() {
  return (
    <WebView
      style={styles.container}
      source={{ uri: 'http://sistemas.9bcomge.eb.mil.br:3000/public/dashboard/2a608c92-c7c2-40a8-a070-9d1ed1e6ce6a?data_do_registro=thisweek' }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});