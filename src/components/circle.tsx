import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet, Easing} from 'react-native';
import Svg, { Circle, G, Text } from 'react-native-svg';
import { useTime } from '../../store/timeContext';
import { getPercentage, timeDifference } from '../../utils/dateHelpers';
import { colors } from '../../utils/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress = ({
  // The diameter for the *main* progress circle
  size = 100,
  // Thickness of the main progress circle
  strokeWidth = 15,
  // Thickness of the outer "halo" circle
  outerStrokeWidth = 20,
  progressColor = '#2196F3',
  backgroundColor = '#E0E0E0',
  duration = 1000, // Animation duration in ms
}) => {
  /**
   * 1) Main circle radius & circumference
   *    - mainRadius is based on `size - strokeWidth`.
   */
  const mainRadius = (size - strokeWidth) / 2;
  const mainCircumference = 2 * Math.PI * mainRadius;

  /**
   * 2) Outer circle radius
   *    - It's basically the mainRadius plus half of both stroke widths.
   */
  const outerRadius = mainRadius + (strokeWidth / 2) + (outerStrokeWidth / 2);

  /**
   * 3) Container must accommodate the outer circle's full diameter plus padding.
   *    - If it's still chipping, increase `padding`.
   */
  const padding = 10;
  const containerSize = (outerRadius * 2) + (padding * 2);
  const center = containerSize / 2;

  // State & context
  const { bedtime, fetchTimes, wakeupTime } = useTime();
  const [percentage, setPercentage] = useState<number>();

  useEffect(() => {
    fetchTimes();
    if (bedtime && wakeupTime) {
      setPercentage(getPercentage(wakeupTime, bedtime));
    }
  }, [bedtime, wakeupTime]);

  // Animation
  const progressAnimation = useRef(new Animated.Value(0)).current;

  // Example time diff
  const now: string = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).replace(/^0/, '');
  const diff = bedtime && timeDifference(now, bedtime);

  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: percentage || 0,
      duration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [percentage, duration]);

  // Progress interpolation
  const strokeDashoffset = progressAnimation.interpolate({
    inputRange: [0, 100],
    outputRange: [mainCircumference, 0],
  });

  return (
    <View style={[styles.container, { width: containerSize, height: containerSize }]}>
      <Svg width={containerSize} height={containerSize}>
        {/*
          4) Outer semi-transparent "halo" circle
             Use outerRadius + outerStrokeWidth
        */}
        <Circle
          cx={center}
          cy={center}
          r={outerRadius}
          stroke="rgba(255, 255, 255, 0.2)" // semi-transparent
          strokeWidth={outerStrokeWidth}
          fill="none"
        />

        {/* Rotate the main circle so it starts from the top */}
        <G rotation="-90" origin={`${center}, ${center}`}>
          {/* Background Circle (main) */}
          <Circle
            cx={center}
            cy={center}
            r={mainRadius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill={"white"}
          />

          {/* Animated Progress Circle (main) */}
          <AnimatedCircle
            cx={center}
            cy={center}
            r={mainRadius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={mainCircumference}
            strokeDashoffset={strokeDashoffset}
          />
        </G>

        {/* Center text */}
        <Text
          x={center}
          y={center - 35}
          textAnchor="middle"
          fill={"black"}
          fontSize="16"
        >
          Remaining
        </Text>
        <Text
          x={center}
          y={center + 10}
          textAnchor="middle"
          fill={colors.primary}
          fontSize="38"
          fontWeight="bold"
        >
          {diff?diff:'-'}
        </Text>
        <Text
          x={center}
          y={center + 35}
          textAnchor="middle"
          fill="black"
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
    // overflow: 'hidden' is default in iOS, so container must be large enough
  },
});

export default CircularProgress;
