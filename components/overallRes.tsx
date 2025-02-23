import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'
import { useTasks } from '../store/tasksContext'

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
        borderColor:colors.border,
        borderWidth:0.5,
        backfaceVisibility: 'hidden',
        alignItems:'center',
        justifyContent:'center'
               
    },
    text:{
        fontSize:14,
        color:colors.text
    },
    result:{
        fontSize:22,
        fontWeight:'bold',
        color:colors.positive
    }
})