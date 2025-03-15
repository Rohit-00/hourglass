import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Appearance } from 'react-native';
import { colors } from '../../utils/colors';
import { convertToTimeDuration, formattedYesterday } from '../../utils/dateHelpers';
import { useTasks } from '../../store/tasksContext';
import { getTotalNeutralHours, getTotalProductiveHours, getTotalUnproductiveHours, getYesterdayMissingHours } from '../../database';
import { normalizeFontSize } from '../../utils/helpers';

const theme = Appearance.getColorScheme()

interface MetricCardProps {
  title:string;
  day:string;
}
const MetricsCard:React.FC<MetricCardProps> = ({title,day}) => {
  const {productive, unproductive, neutral, missing} = useTasks()
  const [yesterdayProd,setYesterdayProd] = useState<number>(0);
  const [yesterdayUnprod, setYesterdayUnprod] = useState<number>(0);
  const [yesterdayNeutral, setYesterdayNeutral] = useState<number>(0);
  const [yesterdayMissing,setYesterdayMissing] = useState<number>(0);

  title!=="today"&&useEffect(()=>{
    const fetchYesterday = async() => {
      const yesterdayHours : any = await getTotalProductiveHours(formattedYesterday)
      const yesterdayUnprodHours : any = await getTotalUnproductiveHours(formattedYesterday)
      const yesterdayNeutral : any = await getTotalNeutralHours(formattedYesterday)
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
        <View style={styles.divider} />
            <View style={styles.tableRow}>
              <Text style={styles.label}>Unproductive</Text>
              <Text style={[styles.value, { color: '#E05E5E' }]}>{convertToTimeDuration(day==="today"?unproductive:yesterdayUnprod!)}</Text>
            </View>
        <View style={styles.divider} />
            <View style={styles.tableRow}>
              <Text style={styles.label}>Neutral</Text>
              <Text style={[styles.value, { color: '#808080' }]}>{convertToTimeDuration(day==="today"?neutral:yesterdayNeutral!)}</Text>
            </View>
        <View style={styles.divider} />
            <View style={styles.tableRow}>
              <Text style={styles.label}>Missing</Text>
              <Text style={[styles.value, { color: '#FFB800' }]}>{convertToTimeDuration(day==="today"?missing:yesterdayMissing!)}</Text>
            </View>
        <View style={styles.divider} />
          </View>

          </View>
          
      </View>

  );
};

const styles = StyleSheet.create({
  container: {

    width: '100%',
  },
  statsCard: {
    padding: 15,

    marginTop: 15,
    backgroundColor: colors.background,
    borderRadius: 10,

    backfaceVisibility: 'hidden',
    elevation:theme==="dark"?0:5,
    shadowOffset:{height:5,width:5},
    shadowColor:'#D4D4D4'
    
  },
  headerText: {
    fontSize: normalizeFontSize(26),
    fontWeight: 'bold',
    marginBottom: 5,
    color:colors.text

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
    fontSize: normalizeFontSize(18),
    color:colors.text
  },
  value: {
    fontSize: normalizeFontSize(28),
    fontWeight: 'bold',
  },
  divider: {
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5,
    marginTop: 5,
},
});

export default MetricsCard;
