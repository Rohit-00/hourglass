import { View, Text, TextInput , StyleSheet, TouchableOpacity} from "react-native"
import { colors } from "../utils/colors"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import { useCallback, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { addTask, getMissingPercentage, getNeutralPercentage, getProductivePercentage, getUnproductivePercentage } from "../database";
import { useTasks } from "../store/tasksContext";
import DateTimePicker from '@react-native-community/datetimepicker';
import { convertTimeDifferenceToNumber, timeDifference } from "../utils/dateHelpers";
import { Picker } from '@react-native-picker/picker';
import { useTime } from "../store/timeContext";

interface ChildProps {
    bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  }

export const AddTask:React.FC<ChildProps> = ({bottomSheetModalRef}) => {
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [task, setTask] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [moodValue, setMoodValue] = useState('neutral');
    const [percentage, setPercentage] = useState(0);

    const { createTask } = useTasks();
    const {fetchTimes,bedtime,wakeupTime} = useTime()

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.close();
      }, []);
    
    const handleSubmit = async() => {

        const currentDate = new Date().toLocaleDateString();
        const difference = timeDifference(startTime,endTime);
        const data = await getMissingPercentage()
        console.log(data);
        // await createTask(currentDate,task,difference.toString(),percentage,moodValue);
        bottomSheetModalRef.current?.close();
    }
    return(
        <View style={styles.container}>
        <Text style={styles.heading}>What have you done?</Text>
        <View style={styles.inputContainer}>
        <TextInput 
            style={styles.input} 
            placeholder="Task" 
            value={task} 
            onChangeText={setTask} 
        />
        </View>

        <View style={styles.dateContainer}>
        <TouchableOpacity style={styles.date} onPress={()=>setShowStartTimePicker(true)} >
        <Text style={styles.placeholder}>{startTime?startTime:'Start Time'}</Text>
        </TouchableOpacity>

        {showStartTimePicker && (
                <DateTimePicker
                    value={new Date(startTime)}
                    mode="time"
                    is24Hour={false}
                    display="default"
                    onChange={(event, selectedDate) => {
                        const currentDate = selectedDate || startTime;
                        setShowStartTimePicker(false);
                        setStartTime(new Date(currentDate.toString().replace(/^"+|"+$/g, '')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
                    }}
                />
            )}

        <TouchableOpacity style={styles.date} onPress={()=>setShowEndTimePicker(true)} >
        <Text style={styles.placeholder}>{endTime?endTime:'End Time'}</Text>
        </TouchableOpacity>
        
        {showEndTimePicker && (
                <DateTimePicker
                    value={new Date(endTime)}
                    mode="time"
                    is24Hour={false}
                    display="default"
                    onChange={(event, selectedDate) => {
                        const currentDate = selectedDate || endTime;
                        setShowEndTimePicker(false);
                        setEndTime(new Date(currentDate.toString().replace(/^"+|"+$/g, '')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
                        const difference = convertTimeDifferenceToNumber(timeDifference(startTime,new Date(currentDate.toString().replace(/^"+|"+$/g, '')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })));
                        fetchTimes();
                        setPercentage(parseFloat((difference/convertTimeDifferenceToNumber(timeDifference(wakeupTime!,bedtime!))*100).toFixed(2)));
                    }}
                />
            )}
        </View>
            
        <View style={styles.pickerWrapper}>
    <Text style={styles.label}>Work Type</Text>
    <View style={styles.pickerContainer}>
        <Picker
            selectedValue={moodValue}
            onValueChange={(itemValue) => setMoodValue(itemValue)}
            style={styles.picker}
        >
            <Picker.Item label="Productive" value="Productive" style={{color:colors.text}}/>
            <Picker.Item label="Neutral" value="neutral" style={{color:colors.text}}/>
            <Picker.Item label="Anti-Productive" value="Anti-Productive" style={{color:colors.text}}/>
        </Picker>
    </View>
</View>

<View style={styles.percentageContainer}>
    <Text>{percentage}% </Text>
    <Text>of your working hours</Text>

</View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handlePresentModalPress}>    
                    <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.updateButton} onPress={handleSubmit}>
                <Text>Add</Text>
            </TouchableOpacity>
        </View>
        
        </View>
    )

}

const styles = StyleSheet.create({
    container:{
        width:'100%',
        alignItems:'center',
        padding:20,
        paddingHorizontal:30
    },
    heading: {
        fontSize:16,
        fontWeight:'bold',
        marginBottom:10,
        color:colors.text
    },
    input:{
        width:'90%',
        height:'100%',
    },
    placeholder:{
        color:colors.text
    },
    buttonContainer:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-evenly',

    },
    cancelButton:{
        width:'48%',
        height:40,
        borderWidth:1,
        borderColor:colors.border,
        borderRadius:10,
        backgroundColor:colors.background,
        alignItems:'center',
        justifyContent:'center'
    },
    updateButton:{
        width:'48%',
        height:40,
        borderRadius:10,
        backgroundColor:colors.primary,
        alignItems:'center',
        justifyContent:'center'
    },
    inputContainer:{
        width:'100%',
        borderBottomColor:colors.border,
        borderBottomWidth:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingBottom:10,
        paddingHorizontal:5,
        marginBottom:20,
      
    },
    date:{
        width:'46%',
        borderBottomColor:colors.border,
        borderBottomWidth:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingBottom:10,
        paddingHorizontal:5,
        marginBottom:20,

        
    },
    dateContainer:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between'
    },
    pickerWrapper: {
        marginBottom: 15,
        width: '100%',
    },
    pickerContainer: {
        borderBottomWidth: 1,
        borderColor:colors.border,
        width: '100%',


    },
    picker: {
        height: 50,
        width: '100%',
    },
    label: {
        marginLeft: 5,
        marginBottom: 5,
        color: '#333',
    },
    percentageContainer:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        marginTop:10,
        marginBottom:20
    }
    
})