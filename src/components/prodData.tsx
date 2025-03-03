import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../../utils/colors'

const ProdData = () => {
  return (
    <View>
      <Text style={styles.heading}>Total Productive Days</Text>
      <View style={styles.metricsContainer}>
        <View style={styles.metricData}>
            <Text style={styles.data}>12</Text>
            <Text style={styles.dataInfo}>This Month</Text>
        </View>
        <View style={{height:'70%',width:1,backgroundColor:colors.text}}/>
        <View style={styles.metricData}>
            <Text style={styles.data}>12</Text>
            <Text style={styles.dataInfo}>This Week</Text>
        </View>
        <View style={{height:'70%',width:1,backgroundColor:colors.text}}/>
        <View style={styles.metricData}>
            <Text style={styles.data}>12</Text>
            <Text style={styles.dataInfo}>Last Month</Text>
        </View>
      </View>
    </View>
    
  )
}

export default ProdData

const styles = StyleSheet.create({
    metricsContainer:{
        flexDirection:'row',
        justifyContent:'space-evenly',
        alignItems:'center',
        padding:10,
        height:100,
        backgroundColor:"white",
        borderRadius:10,
        borderColor:colors.border,
        borderWidth:0.5,
    },
    heading:{
        fontSize:20,
        fontWeight:'bold',
        marginTop:20,
        marginBottom:5,
        color:colors.text
    },
    metricData:{
        alignItems:'center'
    },
    data:{
        fontSize:32,
        fontWeight:'bold',
        color:colors.text
    },
    dataInfo:{
        color:colors.text
    }
})