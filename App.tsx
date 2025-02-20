import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TimeRem } from './components/timeRem';
import Table from './components/table';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useRef } from 'react';
import { ChangeTimeForm } from './components/changeTimeForm';

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
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Function to receive callbacks from child
  const handleReceiveChildFunctions = (callbacks: {
    handlePresentModalPress: () => void;
    handleSheetChanges: (index: number) => void;
  }) => {
    console.log("Received callbacks from child:", callbacks);
    
    // Now you can call these functions in the parent
    callbacks.handlePresentModalPress();
    callbacks.handleSheetChanges(2);
  };
  return (
    <GestureHandlerRootView style={styles.safeArea}>
    <SafeAreaView> 
    <ScrollView showsVerticalScrollIndicator={false}>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <TimeRem bottomSheetModalRef={bottomSheetModalRef}
        sendFunctionsToParent={handleReceiveChildFunctions}/>
        <Table heading='What Have I Done Today' list={list}/>
        <Table heading='What Have I Done Yesterday' list={list}/>
      </View>
      </ScrollView>
    </SafeAreaView>

    {/* Bottom Sheet for changing bed and wake up time */}
    <BottomSheetModalProvider>
        <BottomSheetModal
            ref={bottomSheetModalRef}
          >
          <BottomSheetView style={styles.contentContainer}>
              <ChangeTimeForm/>

            </BottomSheetView>
        </BottomSheetModal>
        </BottomSheetModalProvider>
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
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    width:'100%'
  },
});
