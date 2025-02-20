import { View, Text, TextInput , StyleSheet} from "react-native"
import { colors } from "../utils/colors"

export const ChangeTimeForm = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Change Time Form</Text>
            
            <View style={styles.input}>
                <Text  style={styles.placeholder}>Bedtime</Text>
            </View>
            
            
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width:'100%',
        alignItems:'center',
        padding:20
    },
    heading: {
        fontSize:16,
        fontWeight:'bold',
        marginBottom:10
    },
    input:{
        width:'100%',
        borderBottomColor:colors.border,
        borderBottomWidth:0.5

    },
    placeholder:{
        marginBottom:10
    }
})

