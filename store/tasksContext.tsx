// context/TasksContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import {addResult, getTasks, addTask, getTotalProductiveHours, getTotalUnproductiveHours, getTotalMissingHours, getTotalNeutralHours, getYesterdayResult, deleteTask, getResults, addMonthResults, editTask } from '../database';
import { formattedToday } from '../utils/dateHelpers';


interface TasksContextType {
    tasks: Tasks[];
    fetchTasks: () => Promise<void>;
    createTask: (date:string,title: string, duration: string, percentage:number,tag:string,startTime:string,endTime:string) => Promise<void>;
    productive:number;
    unproductive:number;
    neutral:number;
    missing:number;
    fetchResult:()=>Promise<void>;
    result:string;
    fetchYesterdayResult:()=>Promise<void>;
    yesterdayResult:string;
    deleteSingleTask:(id:number)=>Promise<void>;
    allResults:Result[];
    updateTask:(id:number,date:string,title:string,duration:string,percentage:number,tag:string,start_time:string,end_time:string)=>Promise<void>;
    // setResults:()=>Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Tasks[]>([]);
    const [productive, setProductive] = useState<number>(0);
    const [unproductive, setUnproductive] = useState<number>(0);
    const [neutral, setNeutral] = useState<number>(0);
    const [missing, setMissing] = useState<number>(0);
    const [result, setResult] = useState<string>('');
    const [yesterdayResult, setYesterdayResult] = useState<string>('');
    const [allResults, setAllResults] = useState<Result[]>([])


    const fetchTasks = async () => {
        const allTasks = await getTasks();
        setResults();
        setTasks(allTasks);
        fetchProductive();
    };

    const createTask = async (date:string,title: string, duration: string, percentage:number,tag:string, startTime:string, endTime:string) => {
        await addTask(date,title, duration, percentage, tag, startTime, endTime);
        await fetchProductive();
        await fetchTasks();
        await fetchProductive();
        await fetchResult();
    };

    const fetchProductive = async () => {
        const productive : any = await getTotalProductiveHours(formattedToday);
        const Unproductive : any = await getTotalUnproductiveHours(formattedToday);
        const neutral : any = await getTotalNeutralHours(formattedToday);
        const missing : any = await getTotalMissingHours();
        setProductive(productive[0].total);
        setUnproductive(Unproductive[0].total);
        setNeutral(neutral[0].total);
        setMissing(missing);
    }

    const fetchResult = async () => {
        const productive : any = await getTotalProductiveHours(formattedToday);
        const Unproductive : any = await getTotalUnproductiveHours(formattedToday);
        const missing : any = await getTotalMissingHours();
        const result = productive[0].total > Unproductive[0].total ? 'Productive'  : 'Unproductive';
        setResult(result);
    }

    const fetchYesterdayResult = async () => {
        const result = await getYesterdayResult();
        setYesterdayResult(result);
    }

    const deleteSingleTask = async (id: number) => {
        await deleteTask(id);
        await fetchTasks();
        await fetchProductive();
        await fetchResult();
    }

    const getAllResults = async() => {
        const data :Result[]|any = await getResults();

        setAllResults(data)
        
    }

    const setResults = async() => {
        const CURRENT_MONTH = new Date().getMonth() + 1
        const CURRENT_YEAR = new Date().getFullYear()
        await addMonthResults(CURRENT_MONTH,CURRENT_YEAR)
        getAllResults();
    }

    const updateTask = async(id:number,date:string,title:string,duration:string,percentage:number,tag:string,start_time:string,end_time:string) => {
        await editTask(id,date,title,duration,percentage,tag,start_time,end_time)
        fetchTasks(); 
    }
    
    useEffect(() => {
        fetchTasks(); 
        fetchProductive();
        fetchResult();
        fetchYesterdayResult();
        getAllResults();
        setResults();
    }, []);


    return (
        <TasksContext.Provider value={{ tasks, fetchTasks, createTask,productive,unproductive,neutral,missing,fetchResult,result,fetchYesterdayResult,yesterdayResult,deleteSingleTask,allResults,updateTask }}>
            {children}
        </TasksContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TasksContext);
    if (!context) {
        throw new Error('useTasks must be used within a TasksProvider');
    }
    return context;
};