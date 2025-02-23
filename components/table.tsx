import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { colors } from '../utils/colors'
import AntDesign from '@expo/vector-icons/AntDesign';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTasks } from '../store/tasksContext';
import { convertToTimeDuration } from '../utils/dateHelpers';

interface ChildProps {
    bottomSheetModalRef: React.RefObject<BottomSheetModal>;
    sendFunctionsToParent: (callbacks: {
      handlePresentModalPress: () => void;
      handleSheetChanges: (index: number) => void;
    }) => void;
    heading:string;
  }
  
const Table = ({heading,bottomSheetModalRef,sendFunctionsToParent}:ChildProps) => {

  const {tasks} = useTasks()

  // Define functions inside child
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
    bottomSheetModalRef.current?.close();
    
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  // Send functions to parent when the component mounts
  useEffect(() => {
    sendFunctionsToParent({ handlePresentModalPress, handleSheetChanges });
  }, [sendFunctionsToParent, handlePresentModalPress, handleSheetChanges,bottomSheetModalRef.current]);

  return (
    <View style={styles.container}>
        <View style={styles.headingContainer}>
            <Text style={styles.heading}>{heading}</Text>
            <TouchableOpacity onPress={handlePresentModalPress}>
                <AntDesign name="pluscircle" size={24} color={colors.primary} />
            </TouchableOpacity>
        </View>
        <View>
    {tasks && tasks.map((item, index) => (
        <View key={index}>
            <View style={styles.table}>
                <View style={styles.titleColumn}>
                    <View style={[styles.colorDot, {
                        backgroundColor: item.tag === 'Productive' ? '#00C896' 
                            : item.tag === 'neutral' ? 'grey' 
                            : '#E05E5E'
                    }]} />
                    <Text style={styles.titleText}>{item.title}</Text>
                </View>
                <View style={styles.durationColumn}>
                    <Text style={styles.cellText}>{convertToTimeDuration(item.duration)}</Text>
                </View>
                <View style={styles.percentageColumn}>
                    <Text style={styles.cellText}>{item.percentage}%</Text>
                </View>
            </View>
            <View style={styles.divider} />
        </View>
    ))}
</View>

    </View>
  )
}

export default Table

const styles = StyleSheet.create({
     container: {
        padding:20,
        width:'100%',
        marginTop:15,
        backgroundColor:colors.background,
        borderRadius:10,
        borderColor:colors.border,
        borderWidth:0.5,
   
      },
      headingContainer:{
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center'
      },
      heading:{
            fontSize:18,
            color:colors.text,
            marginBottom:10
      },
      table: {
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center',
    },
    titleColumn: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    durationColumn: {
        flex: 1,
        alignItems: 'center',
    },
    percentageColumn: {
        flex: 1,
        alignItems: 'center',
    },
    colorDot: {
        height: 12,
        width: 12,
        borderRadius: 100,
        marginRight: 8,
    },
    titleText: {
        color: colors.text,
    },
    cellText: {
        color: colors.text,
    },
    divider: {
        borderBottomColor: colors.border,
        borderBottomWidth: 0.5,
        marginTop: 5,
    }
})