import { Appearance, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../../utils/colors'
import { useTasks } from '../../store/tasksContext'
import { normalizeFontSize } from '../../utils/helpers'

const theme = Appearance.getColorScheme()

interface ResultProps {
    heading : string;
    day : string;
}
const OverallRes:React.FC<ResultProps> = ({day,heading}) => {

  const {result,yesterdayResult} = useTasks()
  const res = day === 'today' ? result : yesterdayResult
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{heading}</Text>
      <Text style={[styles.result,{color:res==='Productive'?colors.positive:res==='Unproductive'?colors.negative:res==='Missing'?'#FFB800':'grey'}]}>{res?res:'Neutral'}</Text>
    </View>
  )
}

export default OverallRes

const styles = StyleSheet.create({
    container:{
        padding:10,
        width:'100%',
        marginTop:15,
        backgroundColor:colors.background,
        borderRadius:10,
        elevation:theme==="dark"?0:5,
        shadowOffset:{height:5,width:5},
        shadowColor:'#D4D4D4',
        backfaceVisibility: 'hidden',
        alignItems:'center',
        justifyContent:'center'
               
    },
    text:{
        fontSize:normalizeFontSize(14),
        color:colors.text
    },
    result:{
        fontSize:normalizeFontSize(24),
        fontWeight:'bold',
        color:colors.positive
    }
})