import { View, Text, TextInput , StyleSheet, TouchableOpacity} from "react-native"
import { colors } from "../utils/colors"
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCallback } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

interface ChildProps {
    bottomSheetModalRef: React.RefObject<BottomSheetModal>;

  }
export const ChangeTimeForm:React.FC<ChildProps> = ({bottomSheetModalRef}) => {
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.close();
      }, []);
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Change Time Form</Text>
            
            <View style={styles.input}>
                <Text  style={styles.placeholder}>Bedtime</Text>
                <Fontisto name="night-clear" size={20} color={colors.text} style={{opacity:0.7}}/>
            </View>
            <View style={styles.input}>
                <Text  style={styles.placeholder}>Wake Up Time</Text>
                <MaterialIcons name="access-alarm" size={26} color={colors.text} style={{opacity:0.7}}/>
            </View>
        
        <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handlePresentModalPress}>
            <View style={styles.cancelButton}>
                <Text>Cancel</Text>
            </View>
        </TouchableOpacity>
            <View style={styles.updateButton}>
                <Text>Update</Text>
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
        width:'100%',
        borderBottomColor:colors.border,
        borderBottomWidth:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingBottom:10,
        paddingHorizontal:5,
        marginBottom:20

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
    }
})

