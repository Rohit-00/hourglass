import { Appearance, ScrollView, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Calendar } from 'react-native-calendars';
import { colors } from '../../utils/colors';
import ProdData from '../components/prodData';
import YesterdayTable from '../components/yesterdayTable';
import { useTasks } from '../../store/tasksContext';

const theme = Appearance.getColorScheme()
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
    <ScrollView style={styles.container}>

      <Calendar
      hideExtraDays={true}
      hideArrows={true}
      markedDates={obj}
      style={styles.calendarContainer}
      theme={{
        backgroundColor: colors.background,
        calendarBackground: colors.background,
        textSectionTitleColor: '#b6c1cd',
        monthTextColor:colors.text,
        selectedDayTextColor:colors.background,
        todayTextColor: colors.primary,
        dayTextColor: colors.text,
        selectedDotColor:colors.background,
        textDayFontWeight: '300',
        textMonthFontWeight: 'bold',
        textDayHeaderFontWeight: '300',
        textDayFontSize: 16,
        textMonthFontSize: 16,
        textDayHeaderFontSize: 16,
      }}
      
        />
    <ProdData/>
    <YesterdayTable/>
    </ScrollView>
  )
}

export default History

const styles = StyleSheet.create({
    container:{
        flex : 1,
        backgroundColor: colors.appBackground,
        paddingHorizontal:15
    },
     calendarContainer: {
        padding:10,
        marginTop:50,
        backgroundColor:colors.background,
        
        borderRadius:10,
        elevation:theme==='dark'?0:5,
        shadowOffset:{height:5,width:5},
        shadowColor:'#D4D4D4'
        
      },
})