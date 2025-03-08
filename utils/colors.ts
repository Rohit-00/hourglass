import { Appearance } from "react-native";

const theme = {
    dark: {
        text: '#EFEFEF',
        background: '#252525',
        primary: '#526BBB',
        border: '#D3D3D3',
        solid:'white',
        positive:'#00C896',
        negative:'#E05E5E',
        neutral:'#808080',
        appBackground:'#1A1A1A'

    },
    light: {
        text: '#272727',
        background: 'white',
        primary: '#526BBB',
        border: '#D3D3D3',
        solid:'black',
        positive:'#00C896',
        negative:'#E05E5E',
        neutral:'#808080',
        appBackground:'#F8FAFB'

    }
  };

const isDarkMode = Appearance.getColorScheme() === 'dark';
export const colors = theme[isDarkMode ? 'dark' : 'light'];