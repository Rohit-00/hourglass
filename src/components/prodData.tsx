import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '../../utils/colors'
import { useTasks } from '../../store/tasksContext';
import { calcWeek, getFirstThisMonth } from '../../utils/dateHelpers';
import { getLastMonthResultsNumber } from '../../database';

const ProdData = () => {
    const {allResults} = useTasks();

    const [last7days, setLast7days] = useState<number>()
    const [thisMonth, setThisMonth] = useState<number>()
    const [lastMonth, setLastMonth] = useState<number>()

    useEffect(()=>{
        const last7 = allResults.filter((item) => {
            const [month, day, year] = item.date.split('/').map(Number);
            const itemDate = new Date(year, month - 1, day); 
           
            return itemDate >= calcWeek() && itemDate <= new Date() && item.result === "Productive";
        });

        setLast7days(last7.length)

        const ThisMonth = allResults.filter((item) => {
            const [month, day, year] = item.date.split('/').map(Number);
            const itemDate = new Date(year, month - 1, day); 
           
            return itemDate >= getFirstThisMonth() && itemDate <= new Date() && item.result === "Productive";
        });
        setThisMonth(ThisMonth.length)

        const getLastMonth = async() => {
            const data = await getLastMonthResultsNumber()
            setLastMonth(data)
        }
        getLastMonth()
    },[])
  
  return (
    <View>
      <Text style={styles.heading}>Total Productive Days</Text>
      <View style={styles.metricsContainer}>
        <View style={styles.metricData}>
            <Text style={styles.data}>{thisMonth}</Text>
            <Text style={styles.dataInfo}>This Month</Text>
        </View>
        <View style={{height:'70%',width:1,backgroundColor:colors.text}}/>
        <View style={styles.metricData}>
            <Text style={styles.data}>{last7days}</Text>
            <Text style={styles.dataInfo}>Last 7 days</Text>
        </View>
        <View style={{height:'70%',width:1,backgroundColor:colors.text}}/>
        <View style={styles.metricData}>
            <Text style={styles.data}>{lastMonth}</Text>
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