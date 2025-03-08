import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TimeContextType {
    bedtime: string | null;
    wakeupTime: string | null;
    setBedtime: (time: string) => Promise<void>;
    setWakeupTime: (time: string) => Promise<void>;
    fetchTimes: () => Promise<void>;
}

const TimeContext = createContext<TimeContextType | undefined>(undefined);

export const TimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [bedtime, setBedtimeState] = useState<string | null>('');
    const [wakeupTime, setWakeupTimeState] = useState<string | null>('');

    const fetchTimes = async () => {
        const storedBedtime = await AsyncStorage.getItem('bedtime');
        const storedWakeupTime = await AsyncStorage.getItem('wakeupTime');
        setBedtimeState(storedBedtime);
        setWakeupTimeState(storedWakeupTime);
    };

    const setBedtime = async (time: string) => {
        await AsyncStorage.setItem('bedtime', time);
        setBedtimeState(time);
    };

    const setWakeupTime = async (time: string) => {
        await AsyncStorage.setItem('wakeupTime', time);
        setWakeupTimeState(time);
    };

    useEffect(() => {
        fetchTimes(); 
    }, []);

    return (
        <TimeContext.Provider value={{ bedtime, wakeupTime, setBedtime, setWakeupTime, fetchTimes }}>
            {children}
        </TimeContext.Provider>
    );
};

export const useTime = () => {
    const context = useContext(TimeContext);
    if (!context) {
        throw new Error('useTime must be used within a TimeProvider');
    }
    return context;
};