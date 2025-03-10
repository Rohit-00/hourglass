import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../utils/colors";
import { useCallback, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { convertTimeDifferenceToNumber, formattedToday, timeDifference } from "../../utils/dateHelpers";
import { useTasks } from "../../store/tasksContext";
import { useTime } from "../../store/timeContext";
import { useToast } from "./toast";

interface ChildProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  setBottomSheetStatus:(isOpen:Boolean)=>void;
}

const TaskValidationSchema = Yup.object().shape({
  task: Yup.string()
    .required('Task name is required')
    .min(2, 'Task name must be at least 2 characters'),
  startTime: Yup.string()
    .required('Start time is required'),
  endTime: Yup.string()
    .required('End time is required')
    .test(
      'is-greater',
      'End time must be after start time',
      function(endTime) {
        const { startTime } = this.parent;
        if (!startTime || !endTime) return true;
        
        try {
          const difference = convertTimeDifferenceToNumber(timeDifference(startTime, endTime));
          return difference > 0;
        } catch (e) {
          return false;
        }
      }
    ),
  // moodValue was removed from validation
});

interface FormValues {
  task: string;
  startTime: string;
  endTime: string;
  moodValue: string;
  percentage: number;
}

export const AddTask: React.FC<ChildProps> = ({ bottomSheetModalRef, setBottomSheetStatus }) => {
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const {showToast} = useToast();
  const { createTask } = useTasks();
  const { fetchTimes, bedtime, wakeupTime } = useTime();

  const handleClose = useCallback(async () => {
    bottomSheetModalRef.current?.close();
    setBottomSheetStatus(false);
  }, []);

  const calculatePercentage = (startTime: string, endTime: string): number => {
    try {
      if (!startTime || !endTime || !wakeupTime || !bedtime) return 0;
      
      const difference = convertTimeDifferenceToNumber(timeDifference(startTime, endTime));
      const totalWorkingHours = convertTimeDifferenceToNumber(timeDifference(wakeupTime, bedtime));
      
      return parseFloat(((difference / totalWorkingHours) * 100).toFixed(2));
    } catch (e) {
      return 0;
    }
  };

  const handleSubmit = async (values: FormValues) => {
    const difference = convertTimeDifferenceToNumber(timeDifference(values.startTime, values.endTime));
    try{
    await createTask(
      formattedToday,
      values.task,
      difference.toString(),
      values.percentage,
      values.moodValue,
      values.startTime,
      values.endTime
    );
    showToast('success','Successfully Added Task')
  
    }catch(error){
    showToast('error','Some Error Occured')
    }


    handleClose();
  };

  const initialValues: FormValues = {
    task: '',
    startTime: '',
    endTime: '',
    moodValue: 'neutral',
    percentage: 0
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={TaskValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange, handleSubmit, setFieldValue, values, errors, touched, isValid }) => (
        <View style={styles.container}>
          <Text style={styles.heading}>Add Task</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Task"
              value={values.task}
              placeholderTextColor={colors.text}
              onChangeText={handleChange('task')}
            />
          </View>
          {touched.task && errors.task && (
            <Text style={styles.errorText}>{errors.task}</Text>
          )}

          <View style={styles.dateContainer}>
            <TouchableOpacity 
              style={[
                styles.date, 
                touched.startTime && errors.startTime ? styles.inputError : null
              ]} 
              onPress={() => setShowStartTimePicker(true)}
            >
              <Text style={styles.placeholder}>
                {values.startTime ? values.startTime : 'Start Time'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.date, 
                touched.endTime && errors.endTime ? styles.inputError : null
              ]} 
              onPress={() => setShowEndTimePicker(true)}
            >
              <Text style={styles.placeholder}>
                {values.endTime ? values.endTime : 'End Time'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.errorContainer}>
            <View style={{ width: '46%' }}>
              {touched.startTime && errors.startTime && (
                <Text style={styles.errorText}>{errors.startTime}</Text>
              )}
            </View>
            <View style={{ width: '46%' }}>
              {touched.endTime && errors.endTime && (
                <Text style={styles.errorText}>{errors.endTime}</Text>
              )}
            </View>
          </View>

          {showStartTimePicker && (
            <DateTimePicker
              value={values.startTime ? new Date(values.startTime) : new Date()}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartTimePicker(false);
                if (selectedDate) {
                  const formattedTime = new Date(selectedDate.toString().replace(/^"+|"+$/g, ''))
                    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                  
                  setFieldValue('startTime', formattedTime);
                  
                  // Update percentage if both times are set
                  if (values.endTime) {
                    const newPercentage = calculatePercentage(formattedTime, values.endTime);
                    setFieldValue('percentage', newPercentage);
                  }
                }
              }}
            />
          )}

          {showEndTimePicker && (
            <DateTimePicker
              value={values.endTime ? new Date(values.endTime) : new Date()}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndTimePicker(false);
                if (selectedDate) {
                  const formattedTime = new Date(selectedDate.toString().replace(/^"+|"+$/g, ''))
                    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                  
                  setFieldValue('endTime', formattedTime);
                  fetchTimes();

                  const newPercentage = calculatePercentage(values.startTime, formattedTime);
                  setFieldValue('percentage', newPercentage);
                }
              }}
            />
          )}

          <View style={styles.pickerWrapper}>
            <Text style={styles.label}>Work Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                mode="dropdown"
                selectedValue={values.moodValue}
                onValueChange={(itemValue) => setFieldValue('moodValue', itemValue)}
                style={styles.picker}
                numberOfLines={1}
                dropdownIconColor={colors.text}
              >
                <Picker.Item label="Productive" value="Productive" style={{ color: colors.text,backgroundColor:colors.background }} />
                <Picker.Item label="Neutral" value="neutral" style={{ color: colors.text ,backgroundColor:colors.background }} />
                <Picker.Item label="Unproductive" value="Unproductive" style={{ color: colors.text ,backgroundColor:colors.background}} />
              </Picker>
            </View>
          </View>

          <View style={styles.percentageContainer}>
            <Text  style={{color:colors.text}}>{values.percentage}% </Text>
            <Text style={{color:colors.text}}>of your working hours</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text  style={{color:colors.text}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.updateButton]} 
              onPress={() => handleSubmit()}

            >
              <Text style={{ color: 'white' }}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
    paddingHorizontal: 30,
    paddingBottom:90
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text
  },
  input: {
    width: '90%',
    height: '100%',
    color:colors.text
  },
  placeholder: {
    color: colors.text
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    width: '48%',
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  updateButton: {
    width: '48%',
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  disabledButton: {
    backgroundColor: colors.primary + '80', 
  },
  inputContainer: {
    width: '100%',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    paddingHorizontal: 5,
    marginBottom: 5,
  },
  date: {
    width: '46%',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    paddingHorizontal: 5,
    marginBottom: 5,
  },
  dateContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  pickerWrapper: {
    marginBottom: 15,
    width: '100%',
    marginTop: 10,
  },
  pickerContainer: {
    borderBottomWidth: 1,
    borderColor: colors.border,
    width: '100%',
  },
  picker: {
    height: 50,
    width: '100%',

  },
  label: {
    marginLeft: 5,
    marginBottom: 5,
    color: colors.text
  },
  percentageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    marginBottom: 20
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 5,
    marginBottom: 5,
    alignSelf: 'flex-start'
  },
  inputError: {
    borderBottomColor: 'red',
  },
  errorContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});