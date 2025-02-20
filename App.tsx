import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { TimeRem } from './components/timeRem';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}> 
      <StatusBar style="auto" />
      <View style={styles.container}>
        <TimeRem/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:{
    flex:1,
    paddingHorizontal:20
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
});
