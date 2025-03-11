import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, View, BackHandler } from "react-native";
import { TimeRem } from "../../src/components/timeRem";
import Table from "../../src/components/table";

import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import { ChangeTimeForm } from "../../src/components/changeTimeForm";
import { AddTask } from "../../src/components/addTask";
import BentoGrid from "../components/bentoGrid";
import { useEffect, useRef, useState } from "react";
import { colors } from "../../utils/colors";
import { EditTask } from "../components/editTask";
const Home = () => {

      const bottomSheetModalRef = useRef<BottomSheetModal>(null);
      const taskBottomSheetModalRef = useRef<BottomSheetModal>(null);
      const editTaskSheetModalRef = useRef<BottomSheetModal>(null);

      const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<Boolean>(false);

      //This ugly chunk of code is being used to make the bottom sheet close with back button (most useful feature demanded by my friend)
      useEffect(() => {
        const handleBackButtonPress = () => {
          if (isBottomSheetOpen) {
            bottomSheetModalRef.current?.dismiss(); 
            taskBottomSheetModalRef.current?.dismiss();
            setIsBottomSheetOpen(false)
            return true; 
          }
          return false;
        };
    
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
    
        return () => {
          BackHandler.removeEventListener('hardwareBackPress', handleBackButtonPress);
        };
      }, [isBottomSheetOpen]); 
    
      const [handlePresentModalPress, setHandlePresentModalPress] = useState<(() => void) | null>(null);
    
      const handleReceiveChildFunctions = (callbacks: {
        handlePresentModalPress: () => void;
        handleSheetChanges: (index: number) => void;
      }) => {
        setHandlePresentModalPress(() => callbacks.handlePresentModalPress);
      };
    const setBottomSheetStatus = (isOpen:Boolean) => {
      setIsBottomSheetOpen(isOpen)
    }
  return (
    <View  style={styles.safeArea}>
   
        <ScrollView showsVerticalScrollIndicator={false}>
          <StatusBar style="auto" />
        
            <TimeRem bottomSheetModalRef={bottomSheetModalRef} sendFunctionsToParent={handleReceiveChildFunctions} setBottomSheetStatus={setBottomSheetStatus}/>
            <BentoGrid/>
            <Table heading="What Have I Done Today" 
                bottomSheetModalRef={taskBottomSheetModalRef} 
                sendFunctionsToParent={handleReceiveChildFunctions} 
                setBottomSheetStatus={setBottomSheetStatus}
                editTaskBottomSheetRef={editTaskSheetModalRef}
                />
           
        </ScrollView>
   

      {/* Bottom Sheet for changing bed and wake up time */}
      <BottomSheetModalProvider>
        <BottomSheetModal ref={bottomSheetModalRef} aria-hidden backgroundStyle={{backgroundColor:colors.background}}>
          <BottomSheetView style={styles.contentContainer}>
            <ChangeTimeForm bottomSheetModalRef={bottomSheetModalRef} setBottomSheetOpen={setBottomSheetStatus} />
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>


      {/* Bottom Sheet for adding tasks */}
      <BottomSheetModalProvider>
        <BottomSheetModal ref={taskBottomSheetModalRef} aria-hidden backgroundStyle={{backgroundColor:colors.background}}>
          <BottomSheetView style={styles.contentContainer}>
           <AddTask bottomSheetModalRef={taskBottomSheetModalRef} setBottomSheetStatus={setBottomSheetStatus} />
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>

      {/* Bottom Sheet for editing tasks */}
      <BottomSheetModalProvider>
        <BottomSheetModal ref={editTaskSheetModalRef} aria-hidden backgroundStyle={{backgroundColor:colors.background}}>
          <BottomSheetView style={styles.contentContainer}>
           <EditTask bottomSheetModalRef={editTaskSheetModalRef} setBottomSheetStatus={setBottomSheetStatus} />
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