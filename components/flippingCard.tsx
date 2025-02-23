import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { colors } from '../utils/colors';

const FlipCard = ({ duration = 500, flipThreshold = 100 }) => {
  // For right-to-left swipe, flipProgress goes from 0 (front) to -1 (back)
  const flipProgress = useSharedValue(0);
  const initialFlip = useSharedValue(0);

  // Front side rotates from 0° to -180° as flipProgress goes from 0 to -1
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const spin = interpolate(flipProgress.value, [0, -1], [0, -180]);
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${spin}deg` },
      ],
    };
  });

  // Back side rotates from 180° to 0° (correcting the perspective)
  const backAnimatedStyle = useAnimatedStyle(() => {
    // Change interpolation range: at flipProgress=0, we want 180°; at -1, 0°.
    const spin = interpolate(flipProgress.value, [0, -1], [180, 0]);
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${spin}deg` },
      ],
    };
  });

  // Pan gesture: update flipProgress based on horizontal drag.
  // A right-to-left swipe gives negative translationX.
  const panGesture = Gesture.Pan()
    .onStart(() => {
      initialFlip.value = flipProgress.value;
    })
    .onUpdate((event) => {
      let newProgress = initialFlip.value + event.translationX / flipThreshold;
      // Clamp between 0 (front) and -1 (back)
      newProgress = Math.min(Math.max(newProgress, -1), 0);
      flipProgress.value = newProgress;
    })
    .onEnd(() => {
      if (flipProgress.value < -0.5) {
        flipProgress.value = withTiming(-1, { duration });
      } else {
        flipProgress.value = withTiming(0, { duration });
      }
    });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={styles.container}>
        <Animated.View style={[styles.statsCard, frontAnimatedStyle]}>
        <Text style={styles.headerText}>Time Spent</Text>
        <View style={styles.tableContainer}>
                    <View style={styles.tableRow}>
                        <Text style={styles.label}>Productive</Text>
                        <Text style={[styles.value, { color: '#00C896' }]}>4h 2m</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.label}>Unproductive</Text>
                        <Text style={[styles.value, { color: '#E05E5E' }]}>1h 5m</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.label}>Neutral</Text>
                        <Text style={[styles.value, { color: '#808080' }]}>3h 5m</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.label}>Missing</Text>
                        <Text style={[styles.value, { color: '#FFB800' }]}>2h 30m</Text>
                    </View>
                </View>
        </Animated.View>
        <Animated.View style={[styles.statsCard, backAnimatedStyle]}>
        <Text style={styles.headerText}>Time Spent (%)</Text>
        <View style={styles.tableContainer}>
                    <View style={styles.tableRow}>
                        <Text style={styles.label}>Productive</Text>
                        <Text style={[styles.value, { color: '#00C896' }]}>45%</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.label}>Unproductive</Text>
                        <Text style={[styles.value, { color: '#E05E5E' }]}>25%</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.label}>Neutral</Text>
                        <Text style={[styles.value, { color: '#808080' }]}>15%</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.label}>Missing</Text>
                        <Text style={[styles.value, { color: '#FFB800' }]}>15%</Text>
                    </View>
                </View>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
    container: {
        height:200,
        marginBottom:15,
        width:'100%',

    },
    statsCard: {
   
        padding:20,
        width:'100%',
        marginTop:15,
        backgroundColor:colors.background,
        borderRadius:10,
        borderColor:colors.border,
        borderWidth:0.5,
        position:'absolute',
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
    }
});

export default FlipCard;
