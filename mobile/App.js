// React Native WebView 하이브리드 셸
// 로컬 개발 시 ../web 의 Vite dev 서버를 WebView 로 띄움
// 배포 시에는 WEB_URL 을 정적 호스팅 주소로 교체
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

// 개발 PC IP 로 바꿔주세요. (시뮬레이터는 localhost, 실기기는 같은 Wi-Fi 의 LAN IP)
const WEB_URL = Platform.select({
  ios: 'http://localhost:5173',
  android: 'http://10.0.2.2:5173',
  default: 'http://localhost:5173',
});

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <WebView
        source={{ uri: WEB_URL }}
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        allowsBackForwardNavigationGestures
        startInLoadingState
        bounces={false}
        scalesPageToFit={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0eee9' },
  webview: { flex: 1, backgroundColor: 'transparent' },
});
