import { Appearance } from "react-native";

const theme = {
    dark: {
        text: 'white',
        background: '#23252D',
        primary: '#1EB3F3',
        border: '#D3D3D3'
    },
    light: {
        text: '#454545',
        background: 'white',
        primary: '#1EB3F3',
        border: '#D3D3D3'    

    }
  };

const isDarkMode = Appearance.getColorScheme() === 'dark';
export const colors = theme[isDarkMode ? 'dark' : 'light'];