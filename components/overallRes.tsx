import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'

const OverallRes = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Today is mostly</Text>
      <Text style={styles.result}>Productive</Text>
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