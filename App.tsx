import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TimeRem } from './components/timeRem';
import Table from './components/table';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useRef } from 'react';

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
    <GestureHandlerRootView style={styles.safeArea}>
    <SafeAreaView> 
    <ScrollView showsVerticalScrollIndicator={false}>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <TimeRem/>
        <Table heading='What Have I Done Today' list={list}/>
        <Table heading='What Have I Done Yesterday' list={list}/>
      </View>
      </ScrollView>
    </SafeAreaView>
    
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea:{
    flex:1,
    paddingHorizontal:15
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },

});
