import { StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { colors } from '../../utils/colors'
import AntDesign from '@expo/vector-icons/AntDesign';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTasks } from '../../store/tasksContext';
import { convertToTimeDuration } from '../../utils/dateHelpers';

interface ChildProps {
    bottomSheetModalRef: React.RefObject<BottomSheetModal>;
    sendFunctionsToParent: (callbacks: {
      handlePresentModalPress: () => void;
      handleSheetChanges: (index: number) => void;
    }) => void;
    heading:string;
  }
  
const Table = ({heading,bottomSheetModalRef,sendFunctionsToParent}:ChildProps) => {
    
const [modalVisible, setModalVisible] = useState(false);
const [selectedItem, setSelectedItem] = useState<Tasks>();
const {tasks, deleteSingleTask} = useTasks()

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
    <TouchableOpacity 
        key={index} 
        onPress={() => {
            setSelectedItem(item);
            setModalVisible(true);
        }}
    >
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
    </TouchableOpacity>
    ))}
</View>
<Modal
    animationType="fade"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}
>
    <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1} 
        onPress={() => setModalVisible(false)}
    >
        <View style={styles.modalContent}>
            <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
            >
                <AntDesign name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            {selectedItem && (
                <View>
                    <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                    <View style={styles.modalRow}>
                        <View>
                            <Text style={styles.label}>From</Text>
                            <Text style={styles.data}>{selectedItem.start_time}</Text>
                        </View>

                        <View>
                            <Text style={styles.label}>To</Text>
                            <Text style={styles.data}>{selectedItem.end_time}</Text>
                        </View>
                    </View>

                    <View style={styles.modalRow}>
                        <View>
                            <Text style={styles.label}>Duration</Text>
                            <Text style={styles.data}>{convertToTimeDuration(selectedItem.duration)}</Text>
                        </View>

                        <View>
                            <Text style={styles.label}>% of total working hour</Text>
                            <Text style={styles.data}>{selectedItem.percentage}</Text>
                        </View>
                    </View>
                    <View style={styles.modalRow}>
                        <View>
                    <Text style={styles.label}>Work Type</Text>
                    <Text style={{fontSize:24,fontWeight:'bold',color:selectedItem.tag==='Productive'?colors.positive:selectedItem.tag==='Unproductive'?colors.negative:selectedItem.tag==='Missing'?'#FFB800':'grey'}}>{selectedItem.tag}</Text>
                    </View>
                    </View>
                    <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.deleteButton} onPress={() => {deleteSingleTask(selectedItem.id); setModalVisible(false)}}>    
                        <Text style={{color:'white'}}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeModal}>
                    <Text>Close</Text>
                </TouchableOpacity>
            </View>
                </View>
            )}
        </View>
    </TouchableOpacity>
 
</Modal>
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
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: colors.background,
        padding: 20,
        borderRadius: 10,
        width: '80%',
        position: 'relative',
        borderColor:colors.border,
        borderWidth:0.5,
    },
    closeButton: {
        position: 'absolute',
        right: 10,
        top: 10
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: colors.text
    },
    modalRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap:40,
        paddingVertical: 5,
    },
    label: {
        fontSize: 14,
        color: colors.text
    },
    data :{
        fontSize: 20,
        fontWeight:'bold',
        color:colors.text
    },
    buttonContainer:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',

    },
    deleteButton:{
        width:'48%',
        height:40,

        borderRadius:10,
        backgroundColor:colors.negative,
        alignItems:'center',
        justifyContent:'center'
    },
    closeModal:{
        width:'48%',
        height:40,
        borderRadius:10,
        backgroundColor:colors.background,
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderColor:colors.border,
    },
})