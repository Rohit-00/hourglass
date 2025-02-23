import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors } from '../utils/colors';
import { convertToTimeDuration } from '../utils/dateHelpers';
import { useTasks } from '../store/tasksContext';


const MetricsCard = () => {
  const {productive, unproductive, neutral, missing} = useTasks()


  return (
      <View style={styles.container}>
        <View style={styles.statsCard}> 
          <Text style={styles.headerText}>Time Spent</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <Text style={styles.label}>Productive</Text>
              <Text style={[styles.value, { color: '#00C896' }]}>{convertToTimeDuration(productive)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.label}>Unproductive</Text>
              <Text style={[styles.value, { color: '#E05E5E' }]}>{convertToTimeDuration(unproductive)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.label}>Neutral</Text>
              <Text style={[styles.value, { color: '#808080' }]}>{convertToTimeDuration(neutral)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.label}>Missing</Text>
              <Text style={[styles.value, { color: '#FFB800' }]}>{convertToTimeDuration(missing)}</Text>
            </View>
          </View>
          </View>
      </View>

  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    marginBottom: 15,
    width: '100%',
  },
  statsCard: {
    padding: 20,
    width: '100%',
    marginTop: 15,
    backgroundColor: colors.background,
    borderRadius: 10,
    borderColor: colors.border,
    borderWidth: 0.5,
    position: 'absolute',
    backfaceVisibility: 'hidden',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  tableContainer: {
    flex: 1,
    justifyContent: 'space-around',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MetricsCard;
