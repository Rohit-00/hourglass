import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { TimeRem } from "./src/components/timeRem";
import Table from "./src/components/table";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Entypo from '@expo/vector-icons/Entypo';
import { addTask, createTable, getTasks } from "./database";
import { TasksProvider } from "./store/tasksContext";
import { TimeProvider } from "./store/timeContext";
import BentoGrid from "./src/components/bentoGrid";
import AntDesign from '@expo/vector-icons/AntDesign';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./src/screens/home";
import { NavigationContainer } from "@react-navigation/native";
import History from "./src/screens/history";
import { colors } from "./utils/colors";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const Tab = createBottomTabNavigator();

export default function App() {

  //initialize the databse
  useEffect(()=>{
    const initDB = async() => {
    await createTable()

    }
    initDB()
  })



  return (
    <TimeProvider> 
    <TasksProvider>
    <GestureHandlerRootView>
    <NavigationContainer>
    <Tab.Navigator screenOptions={({route})=>({
      tabBarStyle:{
        height:60, 
        paddingTop:5,
        borderWidth:0.5,
        borderColor:colors.border
      },
  
      tabBarActiveTintColor:colors.primary,
      headerShown:false,
      tabBarIcon:({color, size}) => {
        if(route.name==="Home") 
        return <FontAwesome5 name={"home"} size={size} color={color} />
        else
        return <AntDesign name="clockcircle" size={size} color={color} />
      }
    })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="History" component={History}/>
    </Tab.Navigator>
    {/* <Home/> */}
    </NavigationContainer>
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
