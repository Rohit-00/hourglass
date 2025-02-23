import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { colors } from '../utils/colors';

const FlippingCard = () => {

    const rotateY = useSharedValue(0);

    const animatedFrontStyle = useAnimatedStyle(() => {
        return {
        transform: [
            { perspective: 1000 },
            {
            rotateY: `${interpolate(
                rotateY.value,
                [0, 180],
                [0, 180]
            )}deg`,
            },
        ],
        backfaceVisibility: 'hidden',
        shadowOpacity: interpolate(rotateY.value, [0, 90, 180], [0.3, 0, 0.3]),
        };
    });
 
    const animatedBackStyle = useAnimatedStyle(() => {
        return {
        transform: [
            { perspective: 1000 },
            {
            rotateY: `${interpolate(
                rotateY.value,
                [0, 180],
                [180, 360]
            )}deg`,
            },
        ],
        backfaceVisibility: 'hidden',
        shadowOpacity: interpolate(rotateY.value, [0, 90, 180], [0.3, 0, 0.3]),
        position: 'absolute',
        top: 0,
        left: 0,
        };
    });
 
    const flipGesture = Gesture.Tap().onEnd(() => {
        rotateY.value = withTiming(rotateY.value === 0 ? 180 : 0, { duration: 800 });
    });
  return (
    <View style={styles.container}>
    <GestureDetector gesture={flipGesture}>
        <View>
        <Animated.View style={[styles.statsCard, animatedFrontStyle]}>
        <Text style={styles.headerText}>Day so far:</Text>
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
        <Animated.View style={[styles.statsCard, animatedBackStyle]}>
        <Text style={styles.headerText}>Day so far:</Text>
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
        </View>
    </GestureDetector>
</View>
  )
}

export default FlippingCard

const styles = StyleSheet.create({
    container: {
        width:'100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsCard: {
   
        padding:20,
        width:'100%',
        marginTop:15,
        backgroundColor:colors.background,
        borderRadius:10,
        borderColor:colors.border,
        borderWidth:0.5,
      
        backfaceVisibility: 'hidden',
       
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
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
        fontSize: 18,
        fontWeight: 'bold',
    }
})