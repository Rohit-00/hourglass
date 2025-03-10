//This component is made using claude 3.7 Sonnet

import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';   
import { 
  GestureHandlerRootView, 
  PanGestureHandler, 
  PanGestureHandlerGestureEvent,
  State 
} from 'react-native-gesture-handler';
import { colors } from '../../utils/colors';

// Toast types
type ToastType = 'success' | 'error' | 'info' | 'warning';

// Toast message interface
interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// Toast context interface
interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  hideToast: (id: string) => void;
}

// Toast component props
interface ToastProps {
  message: ToastMessage;
  onHide: (id: string) => void;
  position?: 'top' | 'bottom';
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  offsetTop?: number;
  offsetBottom?: number;
}

// Toast provider props
interface ToastProviderProps {
  children: React.ReactNode;
  position?: 'top' | 'bottom';
  offsetTop?: number;
  offsetBottom?: number;
}

// Create context
const ToastContext = createContext<ToastContextType | null>(null);

// Toast component
const Toast: React.FC<ToastProps> = ({
  message,
  onHide,
  position = 'top',
  containerStyle,
  textStyle,
  offsetTop = 50,
  offsetBottom = 50,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(position === 'top' ? -20 : 20)).current;
  const translateXAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto hide after duration
    const timer = setTimeout(() => {
      hideToast();
    }, message.duration || 3000);

    return () => clearTimeout(timer);
  }, [message.id]);

  const hideToast = () => {
    // Fade out
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: position === 'top' ? -20 : 20,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide(message.id);
    });
  };

  // Get background color based on toast type
  const getBackgroundColor = () => {
    switch (message.type) {
      case 'success':
        return colors.positive; // Green
      case 'error':
        return colors.negative; // Red
      case 'warning':
        return '#FF9800'; // Orange
      case 'info':
        return '#2196F3'; // Blue
      default:
        return '#333333'; // Dark gray
    }
  };

  // Handle pan gesture
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateXAnim } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX, translationY } = event.nativeEvent;
      
      // Check if user swiped far enough to dismiss
      const dismissThreshold = 100;
      
      if (Math.abs(translationX) > dismissThreshold) {
        // Animate off screen in the direction of the swipe
        Animated.timing(translateXAnim, {
          toValue: translationX > 0 ? 500 : -500,
          duration: 200,
          useNativeDriver: true,
        }).start(() => hideToast());
      } else if (
        (position === 'top' && translationY > dismissThreshold) ||
        (position === 'bottom' && translationY < -dismissThreshold)
      ) {
        // Swipe down from top or up from bottom
        Animated.timing(translateYAnim, {
          toValue: position === 'top' ? 100 : -100,
          duration: 200,
          useNativeDriver: true,
        }).start(() => hideToast());
      } else {
        // Reset position if not dismissed
        Animated.spring(translateXAnim, {
          toValue: 0,
          useNativeDriver: true,
          friction: 5,
        }).start();
        
        Animated.spring(translateYAnim, {
          toValue: 0,
          useNativeDriver: true,
          friction: 5,
        }).start();
      }
    }
  };

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: getBackgroundColor(),
              [position]: position === 'top' ? offsetTop : offsetBottom,
            },
            containerStyle,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: translateYAnim },
                { translateX: translateXAnim }
              ],
            },
          ]}
        >
          <Text style={[styles.text, textStyle]}>{message.message}</Text>
          <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
            <Text style={styles.closeButtonText}><AntDesign name="close" size={24} /></Text>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

// Toast container component
const ToastContainer: React.FC<{
  messages: ToastMessage[];
  hideToast: (id: string) => void;
  position?: 'top' | 'bottom';
  offsetTop?: number;
  offsetBottom?: number;
}> = ({ messages, hideToast, position = 'top', offsetTop = 50, offsetBottom = 50 }) => {
  return (
    <View style={styles.toastContainer} pointerEvents="box-none">
      {messages.map((message) => (
        <Toast
          key={message.id}
          message={message}
          onHide={hideToast}
          position={position}
          offsetTop={offsetTop}
          offsetBottom={offsetBottom}
        />
      ))}
    </View>
  );
};

// Toast provider component
export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'top',
  offsetTop = 50,
  offsetBottom = 50,
}) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const showToast = (type: ToastType, message: string, duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newMessage: ToastMessage = {
      id,
      type,
      message,
      duration,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const hideToast = (id: string) => {
    setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      <View style={styles.providerContainer}>
        {children}
        <ToastContainer 
          messages={messages} 
          hideToast={hideToast} 
          position={position} 
          offsetTop={offsetTop} 
          offsetBottom={offsetBottom} 
        />
      </View>
    </ToastContext.Provider>
  );
};

// Custom hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Styles
const styles = StyleSheet.create({
  providerContainer: {
    flex: 1,
    position: 'relative',
  },
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 10,
    pointerEvents: 'box-none',
  },
  gestureRoot: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  container: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    marginLeft: 8,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
