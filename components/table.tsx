import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { colors } from '../utils/colors'
import AntDesign from '@expo/vector-icons/AntDesign';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { getTasks } from '../database';
import { useTasks } from '../store/tasksContext';

interface ChildProps {
    bottomSheetModalRef: React.RefObject<BottomSheetModal>;
    sendFunctionsToParent: (callbacks: {
      handlePresentModalPress: () => void;
      handleSheetChanges: (index: number) => void;
    }) => void;
    heading:string;
    list: Tasks[]
  }
  
const Table = ({heading,list,bottomSheetModalRef,sendFunctionsToParent}:ChildProps) => {

  // const [tasks , setTasks] = useState<Tasks[]>()
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

  console.log(tasks)
  return (
    <View style={styles.container}>
        <View style={styles.headingContainer}>
            <Text style={styles.heading}>{heading}</Text>
            <TouchableOpacity onPress={handlePresentModalPress}>
                <AntDesign name="pluscircle" size={24} color={colors.primary} />
            </TouchableOpacity>
        </View>
        <View>
            {
                tasks&&tasks.map((item,index)=>(
                    <View key={index}>
                    <View key={index} style={styles.table}>
                        <Text style={{color:colors.text}}>{item.title}</Text>
                        <Text style={{color:colors.text}}>{item.time}</Text>
                   
                    </View>
                    <View style={{borderBottomColor:colors.border,borderBottomWidth:0.5,marginTop:5}}/>
                     </View>
                ))
            }
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
      table:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:10
    }
})