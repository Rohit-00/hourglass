import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Calendar } from 'react-native-calendars';
import { colors } from '../../utils/colors';
import ProdData from '../components/prodData';
import YesterdayTable from '../components/yesterdayTable';
import { addResult, getLastMonthProductiveDays, getThisMonthProductiveDays } from '../../database';
import { useTasks } from '../../store/tasksContext';

function formatDate(inputDate:string) {
    const [month, day, year] = inputDate.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}
const History = () => {
const {allResults} = useTasks();

const [results , setResults] = useState<Result[]>()

const obj: any = {};

useEffect(()=>{
  setResults(allResults)
},[allResults])

results&&results.map((item) => {
  if(item.result!=="Missing"){
    obj[formatDate(item.date)] = {selected:true,selectedColor:item.result==="Productive"?colors.positive:colors.negative}
  }
});

  return (
    <View style={styles.container}>

      <Calendar
      hideExtraDays={true}
      hideArrows={true}
      markedDates={obj}
      style={styles.calendarContainer}
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