import { View , Text, StyleSheet} from "react-native"
import CircularProgress from "./circle"
import { colors } from "../utils/colors";
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
export const TimeRem = () => { 

    return(
        <View style={styles.container}>
        <CircularProgress size={220} progress={50} progressColor={colors.primary} backgroundColor={colors.border}/>
        
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
        <Text style={styles.text}>Bedtime</Text>
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
    fontSize:16,
    color:colors.text
  },
  time:{
    fontSize:20,
    fontWeight:'bold',
    color:colors.text
  }
});
