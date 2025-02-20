import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { TimeRem } from './components/timeRem';
import Table from './components/table';

const list : tasks[] = [
  {
      title:"Read a book",
      time:"30 mins"
  },
  {
      title:"Worked on some stuff",
      time:"50 mins"
  },
  {
      title:"did some DSA",
      time:"30 mins"
  },
  {
      title:"Annoyed Anurag",
      time:"60 mins"
  },
]

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}> 
      <StatusBar style="auto" />
      <View style={styles.container}>
        <TimeRem/>
        <Table heading='What Have I Done Today' list={list}/>
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
