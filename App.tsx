import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { TimeRem } from "./components/timeRem";
import Table from "./components/table";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChangeTimeForm } from "./components/changeTimeForm";
import { AddTask } from "./components/addTask";
import { addTask, createTable, getTasks } from "./database";
import { TasksProvider } from "./store/tasksContext";
import { TimeProvider } from "./store/timeContext";
import BentoGrid from "./components/bentoGrid";

export default function App() {

  //initialize the databse
  useEffect(()=>{
    const initDB = async() => {
    await createTable()

    }
    initDB()
  })

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
    <TimeProvider> 
    <TasksProvider>
    <GestureHandlerRootView style={styles.safeArea}>
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <StatusBar style="auto" />
          <View style={styles.container}>
            <TimeRem bottomSheetModalRef={bottomSheetModalRef} sendFunctionsToParent={handleReceiveChildFunctions} />
            <BentoGrid/>
            <Table heading="What Have I Done Today" bottomSheetModalRef={taskBottomSheetModalRef} sendFunctionsToParent={handleReceiveChildFunctions}/>
            
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
    </TasksProvider>
    </TimeProvider>
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
