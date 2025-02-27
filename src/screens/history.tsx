import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Calendar } from 'react-native-calendars';
import { colors } from '../../utils/colors';
import ProdData from '../components/prodData';
import YesterdayTable from '../components/yesterdayTable';
import { addResult } from '../../database';
import { useTasks } from '../../store/tasksContext';

function formatDate(inputDate:string) {
    const [month, day, year] = inputDate.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}
const History = () => {
const {allResults} = useTasks();


//creating an object for marking the dates on calendar

  const obj: any = {};
  allResults.map((item) => {
  
      obj[formatDate(item.date)] = {selected:true,marked:true,selectedColor:item.result==="Productive"?colors.positive:colors.negative}
      
  });




  return (
    <View style={styles.container}>

      <Calendar
      enableSwipeMonths={true}
      onMonthChange={(months:any)=>{console.log(months)}}
      markedDates={obj}
      style={styles.calendarContainer}
  onDayPress={(day:any) => {
    console.log('selected day', day);
  }}
        />
    <ProdData/>
    <YesterdayTable/>
    </View>
  )
}

export default History

const styles = StyleSheet.create({
    container:{
        flex : 1,
        backgroundColor: "#F8FAFB",
        paddingHorizontal:15
    },
     calendarContainer: {
        padding:10,
        marginTop:50,
        backgroundColor:colors.background,
        borderRadius:10,
        borderColor:colors.border,
        borderWidth:0.5,
        
      },
})