import { View , Text, StyleSheet, TouchableOpacity} from "react-native"
import CircularProgress from "./circle"
import { colors } from "../utils/colors";
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useEffect } from "react";
import { useCallback } from "react";

interface ChildProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  sendFunctionsToParent: (callbacks: {
    handlePresentModalPress: () => void;
    handleSheetChanges: (index: number) => void;
  }) => void;
}

export const TimeRem: React.FC<ChildProps> = ({bottomSheetModalRef, sendFunctionsToParent}) => { 


  // Define functions inside child
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
    bottomSheetModalRef.current?.close();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  // Send functions to parent when the component mounts
  useEffect(() => {
    sendFunctionsToParent({ handlePresentModalPress, handleSheetChanges });
  }, [sendFunctionsToParent, handlePresentModalPress, handleSheetChanges]);

    return(
        <View style={styles.container}>
        <View style={styles.edit}>
        <TouchableOpacity  onPress={handlePresentModalPress}>

        <Entypo name="dots-three-horizontal" size={24} color="black"/>
 
        </TouchableOpacity>
        </View>
        <CircularProgress size={240} progress={60} progressColor={colors.primary} backgroundColor={colors.border}/>
        
        <View style={styles.iconContainer}>
        <View style={styles.icon}>
        <Fontisto name="night-clear" size={34} color={colors.text} />
        <View style={{flexDirection:'column'}}>
        <Text style={styles.text}>Bedtime</Text>
        <Text style={styles.time}>8:00PM</Text>
        </View>
        </View>

        <View style={styles.icon}>
        <MaterialIcons name="access-alarm" size={40} color={colors.text} />
        <View style={{flexDirection:'column'}}>
        <Text style={styles.text}>Wake Up</Text>
        <Text style={styles.time}>8:00PM</Text>
        </View>
        </View>
        </View>

        </View>
      
      
    )

}
const styles = StyleSheet.create({
  container: {
    padding:20,
    width:'100%',
    marginTop:50,
    backgroundColor:colors.background,
    borderRadius:10,
    borderColor:colors.border,
    borderWidth:0.5,
    alignItems:'center'
  },
  iconContainer:{
    marginTop:30,
    flexDirection:'row',
    justifyContent:'space-between',
    width:'100%'
  },
  icon:{
    flexDirection:'row',
    alignItems:'center',
    gap:8
  },
  text:{
    fontSize:14,
    color:colors.text
  },
  time:{
    fontSize:16,
    fontWeight:'bold',
    color:colors.text
  },
  edit:{
    width:'100%',
    alignItems:'flex-end'
  }
});
