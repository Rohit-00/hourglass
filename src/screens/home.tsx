import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, View } from "react-native";
import { TimeRem } from "../../src/components/timeRem";
import Table from "../../src/components/table";

import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import { ChangeTimeForm } from "../../src/components/changeTimeForm";
import { AddTask } from "../../src/components/addTask";
import BentoGrid from "../components/bentoGrid";
import { useRef, useState } from "react";
import { colors } from "../../utils/colors";
const Home = () => {

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
    <View  style={styles.safeArea}>
   
        <ScrollView showsVerticalScrollIndicator={false}>
          <StatusBar style="auto" />
        
            <TimeRem bottomSheetModalRef={bottomSheetModalRef} sendFunctionsToParent={handleReceiveChildFunctions} />
            <BentoGrid/>
            <Table heading="What Have I Done Today" bottomSheetModalRef={taskBottomSheetModalRef} sendFunctionsToParent={handleReceiveChildFunctions}/>
           
        </ScrollView>
   

      {/* Bottom Sheet for changing bed and wake up time */}
      <BottomSheetModalProvider>
        <BottomSheetModal ref={bottomSheetModalRef} aria-hidden backgroundStyle={{backgroundColor:colors.background}}>
          <BottomSheetView style={styles.contentContainer}>
            <ChangeTimeForm bottomSheetModalRef={bottomSheetModalRef} />
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>


      {/* Bottom Sheet for adding tasks */}
      <BottomSheetModalProvider>
        <BottomSheetModal ref={taskBottomSheetModalRef} aria-hidden backgroundStyle={{backgroundColor:colors.background}}>
          <BottomSheetView style={styles.contentContainer}>
           <AddTask bottomSheetModalRef={taskBottomSheetModalRef}/>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
    safeArea: {
        
        backgroundColor: colors.appBackground,
        paddingHorizontal:15,
      },

      contentContainer: {
        alignItems: "center",
        width: "100%",
      },
})