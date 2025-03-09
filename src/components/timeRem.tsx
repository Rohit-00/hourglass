import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Appearance } from "react-native"
import CircularProgress from "./circle"
import { colors } from "../../utils/colors";
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useEffect, useRef, useState } from "react";
import { useCallback } from "react";
import { useTime } from "../../store/timeContext";

const theme = Appearance.getColorScheme()

interface ChildProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  sendFunctionsToParent: (callbacks: {
    handlePresentModalPress: () => void;
    handleSheetChanges: (index: number) => void;
  }) => void;
}

export const TimeRem: React.FC<ChildProps> = ({bottomSheetModalRef, sendFunctionsToParent}) => { 
  const {fetchTimes, bedtime, wakeupTime} = useTime();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [tutorialDismissed, setTutorialDismissed] = useState(false);

  // Define functions inside child
  const handlePresentModalPress = useCallback(() => {
    setTutorialDismissed(true);
    bottomSheetModalRef.current?.present();
    bottomSheetModalRef.current?.close();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  // Animation for the tutorial pointer
  useEffect(() => {
    if (bedtime === null && !tutorialDismissed) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          })
        ])
      ).start();
    }
  }, [bedtime, tutorialDismissed]);

  // Transform for the pointer animation
  const pointerTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 10]
  });

  // Send functions to parent when the component mounts
  useEffect(() => {
    sendFunctionsToParent({ handlePresentModalPress, handleSheetChanges });
    fetchTimes();
  }, [sendFunctionsToParent, handlePresentModalPress, handleSheetChanges]);

  return(
    <View style={styles.container}>
      <View style={styles.edit}>
        {bedtime === null && (
          <View style={styles.tutorialContainer}>
            <Animated.View 
              style={[
                styles.tutorialPointer,
                { transform: [{ translateX: pointerTranslateX }] }
              ]}
            >
              <MaterialIcons name="arrow-forward" size={24} color="white" />
            </Animated.View>
            <View style={styles.tutorialBubble}>
              <Text style={styles.tutorialText}>Tap here to set your bed and wake time</Text>
            </View>
          </View>
        )}
        <TouchableOpacity onPress={handlePresentModalPress} style={styles.dotsButton}>
          <Entypo name="dots-three-horizontal" size={24} color="white"/>
        </TouchableOpacity>
      </View>

      <CircularProgress 
        outerStrokeWidth={20} 
        size={240} 
        strokeWidth={20} 
        backgroundColor={'#C7D1E8'} 
        progressColor={'#28B6F4'} 
      />
  
      <View style={styles.iconContainer}>
        <View style={styles.icon}>
          <MaterialIcons name="access-alarm" size={40} color={"white"} />
          <View style={{flexDirection:'column', alignItems:'flex-start'}}>
            <Text style={styles.text}>Wake Up</Text>
            <Text style={styles.time}>
              {wakeupTime ? 
                wakeupTime : 
                <Text style={styles.instruction}>Set Time<View style={styles.underline}/></Text>
              }
            </Text>
          </View>
        </View>

        <View style={styles.icon}>
          <Fontisto name="night-clear" size={34} color={"white"} />
          <View style={{flexDirection:'column', alignItems:'flex-start'}}>
            <Text style={styles.text}>Bedtime</Text>
            <Text style={styles.time}>
              {bedtime ? 
                bedtime : 
                <Text style={styles.instruction}>Set Time</Text>
              }
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
    marginTop: 50,
    backgroundColor: colors.primary,
    borderRadius: 10,
    elevation: theme==="dark"?0:5,
    shadowOffset: {height: 5, width: 5},
    shadowColor: '#D4D4D4',
    alignItems: 'center'
  },
  iconContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  icon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  text: {
    fontSize: 14,
    color: "white"
  },
  time: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "white"
  },
  edit: {
    width: '100%',
    alignItems: 'flex-end',
    position: 'relative',
    marginBottom: 10
  },
  instruction: {
    fontSize: 20,
  },
  underline: {
    height: 1,
  },
  dotsButton: {
    padding: 8,
    zIndex: 10
  },
  tutorialContainer: {
    position: 'absolute',
    right: 70,
    top: 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 5
  },
  tutorialBubble: {
    backgroundColor: 'black',
    opacity:0.6,
    borderRadius: 10,
    padding: 10,
    marginRight: 10
  },
  tutorialText: {
    color: 'white',
    fontSize: 14,
    maxWidth: 180
  },
  tutorialPointer: {
    position: 'absolute',
    right: -30,
    top: 0
  }
});