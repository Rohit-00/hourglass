import { View, Text, TextInput , StyleSheet, TouchableOpacity} from "react-native"
import { colors } from "../utils/colors"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import { useCallback, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

interface ChildProps {
    bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  }

export const AddTask:React.FC<ChildProps> = ({bottomSheetModalRef}) => {
    const [task, setTask] = useState('');
    const [time, setTime] = useState('');
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.close();
      }, []);

    return(
        <View style={styles.container}>
        <Text style={styles.heading}>What have you done?</Text>
        <View style={styles.inputContainer}>
        <TextInput 
            style={styles.input} 
            placeholder="Task" 
            value={task} 
            onChangeText={setTask} 
        />
        <FontAwesome5 style={{opacity:0.7}} name="tasks" size={24} color={colors.text} />
        </View>

        <View style={styles.inputContainer}>
        <TextInput 
            style={styles.input} 
            placeholder="Time" 
            value={time} 
            onChangeText={setTime} 
        />
        <Entypo style={{opacity:0.7}} name="time-slot" size={24} color={colors.text}/>
        </View>
    
        <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handlePresentModalPress}>
                <View style={styles.cancelButton}>
                    <Text>Cancel</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.updateButton}>
                <Text>Add</Text>
            </View>
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
        width:'90%',
        height:'100%',


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