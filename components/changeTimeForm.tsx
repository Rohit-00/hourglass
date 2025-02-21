import { View, Text, TextInput , StyleSheet, TouchableOpacity} from "react-native"
import { colors } from "../utils/colors"
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCallback, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTime } from "../store/timeContext";

interface ChildProps {
    bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  }
export const ChangeTimeForm:React.FC<ChildProps> = ({bottomSheetModalRef}) => {

    const { setBedtime, setWakeupTime } = useTime();
    const [bedtimeInput, setBedtimeInput] = useState('');
    const [wakeupTimeInput, setWakeupTimeInput] = useState('');

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.close();
      }, []);

    const handleSaveTimes = async () => {
        await setBedtime(bedtimeInput);
        await setWakeupTime(wakeupTimeInput);
        bottomSheetModalRef.current?.close();
    };
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Change Time Form</Text>
            
            <View style={styles.inputContainer}>
            <TextInput 
            style={styles.input} 
            placeholder="Time" 
            value={bedtimeInput} 
            onChangeText={setBedtimeInput} 
            />
            <Fontisto name="night-clear" size={20} color={colors.text} style={{opacity:0.7}}/>
            </View>

            <View style={styles.inputContainer}>
            <TextInput 
            style={styles.input} 
            placeholder="Time" 
            value={wakeupTimeInput} 
            onChangeText={setWakeupTimeInput} 
            />
                <MaterialIcons name="access-alarm" size={26} color={colors.text} style={{opacity:0.7}}/>
            </View>
            
        
        <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handlePresentModalPress}>
            <View style={styles.cancelButton}>
                <Text>Cancel</Text>
            </View>
        </TouchableOpacity>
            <TouchableOpacity style={styles.updateButton} onPress={handleSaveTimes}>
                <Text>Update</Text>
            </TouchableOpacity>

        </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width:'100%',
        alignItems:'center',
        padding:20,
        paddingHorizontal:30
    },
    heading: {
        fontSize:16,
        fontWeight:'bold',
        marginBottom:10,
        color:colors.text
    },
    input:{
        width:'100%',
 

    },
    placeholder:{
        color:colors.text
    },
    buttonContainer:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-evenly',

    },
    cancelButton:{
        width:100,
        height:40,
        borderWidth:1,
        borderColor:colors.border,
        borderRadius:10,
        backgroundColor:colors.background,
        alignItems:'center',
        justifyContent:'center'
    },
    updateButton:{
        width:100,
        height:40,
        borderRadius:10,
        backgroundColor:colors.primary,
        alignItems:'center',
        justifyContent:'center'
    },
    inputContainer:{
        width:'100%',
        borderBottomColor:colors.border,
        borderBottomWidth:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingBottom:10,
        paddingHorizontal:5,
        marginBottom:20,
  
    }
})

