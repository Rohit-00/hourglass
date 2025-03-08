import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors } from '../../utils/colors';
import { convertToTimeDuration } from '../../utils/dateHelpers';
import { useTasks } from '../../store/tasksContext';
import { getTotalNeutralHours, getTotalProductiveHours, getTotalUnproductiveHours, getYesterdayMissingHours, yesterdayDate } from '../../database';

interface MetricCardProps {
  title:string;
  day:string;
}
const MetricsCard:React.FC<MetricCardProps> = ({title,day}) => {
  const {productive, unproductive, neutral, missing} = useTasks()
  const [yesterdayProd,setYesterdayProd] = useState();
  const [yesterdayUnprod, setYesterdayUnprod] = useState<number>();
  const [yesterdayNeutral, setYesterdayNeutral] = useState();
  const [yesterdayMissing,setYesterdayMissing] = useState();

  title!=="today"&&useEffect(()=>{
    const fetchYesterday = async() => {
      const yesterdayHours : any = await getTotalProductiveHours(yesterdayDate)
      const yesterdayUnprodHours : any = await getTotalUnproductiveHours(yesterdayDate)
      const yesterdayNeutral : any = await getTotalNeutralHours(yesterdayDate)
      const yesterdayMissingHours : any = await getYesterdayMissingHours()
      setYesterdayProd(yesterdayHours[0].total)
      setYesterdayUnprod(yesterdayUnprodHours[0].total)
      setYesterdayMissing(yesterdayMissingHours)
      setYesterdayNeutral(yesterdayNeutral[0].total)
    }
    fetchYesterday()
  })


  return (
      <View style={styles.container}>
        <View style={styles.statsCard}> 
          <Text style={styles.headerText}>{title} :</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <Text style={styles.label}>Productive</Text>
              <Text style={[styles.value, { color: '#00C896' }]}>{convertToTimeDuration(day==="today"?productive:yesterdayProd!)}</Text>
            </View>
            <View style={{height:1,width:'80%',backgroundColor:colors.border}}/>
            <View style={styles.tableRow}>
              <Text style={styles.label}>Unproductive</Text>
              <Text style={[styles.value, { color: '#E05E5E' }]}>{convertToTimeDuration(day==="today"?unproductive:yesterdayUnprod!)}</Text>
            </View>
            <View style={{height:1,width:'80%',backgroundColor:colors.border}}/>
            <View style={styles.tableRow}>
              <Text style={styles.label}>Neutral</Text>
              <Text style={[styles.value, { color: '#808080' }]}>{convertToTimeDuration(day==="today"?neutral:yesterdayNeutral!)}</Text>
            </View>
            <View style={{height:1,width:'80%',backgroundColor:colors.border}}/>
            <View style={styles.tableRow}>
              <Text style={styles.label}>Missing</Text>
              <Text style={[styles.value, { color: '#FFB800' }]}>{convertToTimeDuration(day==="today"?missing:yesterdayMissing!)}</Text>
            </View>
            <View style={{height:1,width:'80%',backgroundColor:colors.border}}/>
          </View>

          </View>
          
      </View>

  );
};

const styles = StyleSheet.create({
  container: {
    height: 340,
    marginBottom: 15,
    width: '100%',
  },
  statsCard: {
    padding: 15,
    height:'100%',
    width: '100%',
    marginTop: 15,
    backgroundColor: colors.background,
    borderRadius: 10,
    position: 'absolute',
    backfaceVisibility: 'hidden',
    elevation:5,
    shadowOffset:{height:5,width:5},
    shadowColor:'#D4D4D4'
    
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  tableContainer: {
    flex: 1,
    justifyContent: 'space-around',
  },
  tableRow: {

    alignItems: 'flex-start',
    paddingVertical: 5,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  value: {
    fontSize: 26,
    fontWeight: 'bold',
  },
});

export default MetricsCard;
