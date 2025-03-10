import { Dimensions, PixelRatio, Platform } from 'react-native';

export const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };


const { width: SCREEN_WIDTH } = Dimensions.get('window');
  
const BASE_WIDTH = 390;
  
const scale = SCREEN_WIDTH / BASE_WIDTH;
  
export function normalizeFontSize(size: number) {
    const newSize = size * scale;
  
    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(newSize));
    } else {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
    }
  }