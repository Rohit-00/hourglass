// Made this cuz was unable to find a way to pass data from table component to editable

import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TimeContextType {
    task : Tasks;
    addTask:(
        id: number,
        date: string,
        percentage: number,
        title: string,
        duration: number,
        tag: string,
        start_time: string,
        end_time: string,) => void;
}

const EditTaskContext = createContext<TimeContextType | undefined>(undefined);

export const EditTaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [task,setTask] = useState<Tasks>({
        id: 0,
        date: '',
        percentage: 0,
        title: '',
        duration: 0,
        tag: '',
        start_time: '',
        end_time: ''
    })
    const addTask = (
        id: number,
        date: string,
        percentage: number,
        title: string,
        duration: number,
        tag: string,
        start_time: string,
        end_time: string,
    ) => {
        setTask({
            id: id,
            date: date,
            percentage: percentage,
            title: title,
            duration: duration,
            tag: tag,
            start_time: start_time,
            end_time: end_time
        })
    }

    return (
        <EditTaskContext.Provider value={{task,addTask}}>
            {children}
        </EditTaskContext.Provider>
    );
};

export const useEditTask = () => {
    const context = useContext(EditTaskContext);
    if (!context) {
        throw new Error('useTime must be used within a TimeProvider');
    }
    return context;
};