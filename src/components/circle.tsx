import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import Svg, { Circle, G, Text } from 'react-native-svg';
import { useTime } from '../../store/timeContext';
import { getPercentage, timeDifference } from '../../utils/dateHelpers';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress = ({
size = 100,
strokeWidth = 15,
progress = 0,
progressColor = '#2196F3',
backgroundColor = '#E0E0E0',
duration = 1000, // Animation duration in ms
}) => {
// Calculate dimensions
const center = size / 2;
const radius = (size - strokeWidth) / 2;
const circumference = 2 * Math.PI * radius;

const [percentage,setPercentage] = useState<number>()
const {bedtime,fetchTimes,wakeupTime} = useTime()

useEffect(()=>{
   fetchTimes()
   bedtime&&wakeupTime&& setPercentage(getPercentage(wakeupTime,bedtime))
},[bedtime,wakeupTime])

// Animation value
const progressAnimation = useRef(new Animated.Value(0)).current;

const now: string = new Date().toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
}).replace(/^0/, '');

const diff = bedtime && timeDifference(now,bedtime)


// Animate when progress changes
useEffect(() => {
    Animated.timing(progressAnimation, {
    toValue: percentage!,
    duration: duration,
    easing: Easing.out(Easing.ease),
    useNativeDriver: true,
    }).start();
}, [percentage, duration]);

// Calculate the animated stroke dash offset
const strokeDashoffset = progressAnimation.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
});

return (
    <View style={[styles.container, { width: size, height: size }]}>
    <Svg width={size} height={size}>
        <G rotation="-90" origin={`${center}, ${center}`}>
        {/* Background Circle */}
        <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="none"
        />
        {/* Animated Progress Circle */}
        <AnimatedCircle
            cx={center}
            cy={center}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
        />
        </G>
        <Text
            x={center}
            y={center - 35}
            textAnchor="middle"
            fill="#666"
            fontSize="16"
        >
            Remaining
        </Text>
        <Text
            x={center}
            y={center + 10}
            textAnchor="middle"
            fill="#333"
            fontSize="42"
            fontWeight="bold"
        >
            {diff}
        </Text>
        <Text
            x={center}
            y={center + 35}
            textAnchor="middle"
            fill="#666"
            fontSize="16"
        >
            today
        </Text>
    </Svg>
    </View>
);
};

const styles = StyleSheet.create({
container: {
    alignItems: 'center',
    justifyContent: 'center',
},
});

export default CircularProgress;