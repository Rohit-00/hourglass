import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'
import FlippingCard from './flippingCard'

const BentoGrid = () => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <FlippingCard/>
      </View>
      <View style={styles.row}>
        <FlippingCard/>
      </View>
    </View> 
  )
}

export default BentoGrid

const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        width:'100%',
        justifyContent:'space-between'
     
    },
    row:{
        flexDirection:'column',
        width:'48%',
        
    },
    gridItem:{
                padding:20,
                width:'100%',
                marginTop:15,
                backgroundColor:colors.background,
                borderRadius:10,
                borderColor:colors.border,
                borderWidth:0.5,
    }
})