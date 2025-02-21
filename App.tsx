import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { TimeRem } from "./components/timeRem";
import Table from "./components/table";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef, useState } from "react";
import { ChangeTimeForm } from "./components/changeTimeForm";
import { AddTask } from "./components/addTask";

const list: tasks[] = [
  {
    title: "Read a book",
    time: "30 mins",
  },
  {
    title: "Worked on some stuff",
    time: "50 mins",
  },
  {
    title: "Did some DSA",
    time: "30 mins",
  },
  {
    title: "Annoyed Anurag",
    time: "60 mins",
  },
];

export default function App() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const taskBottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Store the modal open function instead of calling it directly
  const [handlePresentModalPress, setHandlePresentModalPress] = useState<(() => void) | null>(null);

  // Function to receive callbacks from child
  const handleReceiveChildFunctions = (callbacks: {
    handlePresentModalPress: () => void;
    handleSheetChanges: (index: number) => void;
  }) => {
    setHandlePresentModalPress(() => callbacks.handlePresentModalPress);
  };


  return (
    <GestureHandlerRootView style={styles.safeArea}>
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <StatusBar style="auto" />
          <View style={styles.container}>
            <TimeRem bottomSheetModalRef={bottomSheetModalRef} sendFunctionsToParent={handleReceiveChildFunctions} />
            <Table heading="What Have I Done Today" list={list} bottomSheetModalRef={taskBottomSheetModalRef} sendFunctionsToParent={handleReceiveChildFunctions}/>
            
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Bottom Sheet for changing bed and wake up time */}
      <BottomSheetModalProvider>
        <BottomSheetModal ref={bottomSheetModalRef} aria-hidden>
          <BottomSheetView style={styles.contentContainer}>
            <ChangeTimeForm bottomSheetModalRef={bottomSheetModalRef} />
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>


      {/* Bottom Sheet for adding tasks */}
      <BottomSheetModalProvider>
        <BottomSheetModal ref={taskBottomSheetModalRef} aria-hidden>
          <BottomSheetView style={styles.contentContainer}>
           <AddTask bottomSheetModalRef={taskBottomSheetModalRef}/>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>

    </GestureHandlerRootView>

    
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 15,
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FAFB",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
});
