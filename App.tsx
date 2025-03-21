import {Appearance, StyleSheet} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {useEffect} from "react";
import {createTable} from "./database";
import { TasksProvider } from "./store/tasksContext";
import { TimeProvider } from "./store/timeContext";
import AntDesign from '@expo/vector-icons/AntDesign';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./src/screens/home";
import { NavigationContainer } from "@react-navigation/native";
import History from "./src/screens/history";
import { colors } from "./utils/colors";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { ToastProvider } from "./src/components/toast";
import { EditTaskProvider } from "./store/editTaskContext";
const Tab = createBottomTabNavigator();
const theme = Appearance.getColorScheme()
export default function App() {

  //initialize the databse
  useEffect(()=>{
    const initDB = async() => {
    await createTable()

    }
    initDB()
  })

  return (
    <EditTaskProvider>
    <TimeProvider> 
      <ToastProvider>
    <TasksProvider>
    <GestureHandlerRootView>
    <NavigationContainer>
    <Tab.Navigator screenOptions={({route})=>({
tabBarStyle: {
  position: 'absolute',
  bottom: 20, 
  left: 20,
  right: 20,
  height: 60,
  paddingTop: 5,
  borderTopWidth: 0,
  backgroundColor: colors.background,
  borderRadius: 20,
  shadowColor: "#000", 
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.1,
  shadowRadius: 10,
  elevation: 5, 
  marginHorizontal:80,
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
    </ToastProvider>
    </TimeProvider>
    </EditTaskProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 15,
  },
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
});
