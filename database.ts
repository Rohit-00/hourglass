import * as SQLite from 'expo-sqlite';
import { useTime } from './store/timeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { convertTimeDifferenceToNumber, timeDifference } from './utils/dateHelpers';

const db = SQLite.openDatabaseSync('appData.db');
const date = new Date().toLocaleDateString();
export const createTable = async () => {

    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS task_done (date TEXT,title TEXT NOT NULL, duration INTEGER, percentage INTEGER, tag TEXT, start_time TEXT, end_time TEXT);
        `);
    return  db
};

export const addTask = async (date:string,title:string,duration:string,percentage:number,tag:string) => {
    const result = await db.runAsync(
        'INSERT INTO task_done (date, title, duration, percentage, tag) VALUES (?, ?, ?, ?, ?)'
        , date, title, duration, percentage, tag);
    return result
    
}

export const getTasks = async() => {
    const date = new Date().toLocaleDateString();
    const allRows:Tasks[] = await db.getAllAsync(`SELECT * FROM task_done WHERE date = ?`,date);
    return allRows
}


export const getProductivePercentage = async() => { 


    const result = await db.getAllAsync('SELECT SUM(percentage) as total FROM task_done WHERE tag = "Productive" AND date = ?',date);
    
    return result
}

export const getUnproductivePercentage = async() => {

    const result = await db.getAllAsync('SELECT SUM(percentage) as total FROM task_done WHERE tag = "Anti-Productive" AND date = ?',date);

    return result
}

export const getNeutralPercentage = async() => {
    const result = await db.getAllAsync('SELECT SUM(percentage) as total FROM task_done WHERE tag = "neutral" AND date = ?',date);

    return result
}

export const getMissingPercentage = async() => {
    const result:any = await db.getAllAsync('SELECT SUM(percentage) as total  FROM task_done WHERE date = ?',date);
    const productive:any = await getProductivePercentage();
    const unproductive:any = await getUnproductivePercentage();
    const neutral:any = await getNeutralPercentage();
    const missing = result[0].total - (productive[0].total + unproductive[0].total + neutral[0].total);
    return missing
}

export const getTotalProductiveHours = async() => {
    const result = await db.getAllAsync('SELECT SUM(duration) as total FROM task_done WHERE tag = "Productive" AND date = ?',date);
    
    return result
}

export const getTotalUnproductiveHours = async() => {
    const result = await db.getAllAsync('SELECT SUM(duration) as total FROM task_done WHERE tag = "Anti-Productive" AND date = ?',date);
    return result
}

export const getTotalNeutralHours = async() => {
    const result = await db.getAllAsync('SELECT SUM(duration) as total FROM task_done WHERE tag = "neutral" AND date = ?',date);
    return result
}

export const getTotalMissingHours = async() => {
    const storedBedtime:any = await AsyncStorage.getItem('bedtime');
    const storedWakeupTime:any = await AsyncStorage.getItem('wakeupTime');
    const totalTime = convertTimeDifferenceToNumber(timeDifference(storedWakeupTime,storedBedtime)); 
    const productive:any = await getTotalProductiveHours();
    const unproductive:any = await getTotalUnproductiveHours();
    const neutral:any = await getTotalNeutralHours();
    const missing = totalTime - (productive[0].total + unproductive[0].total + neutral[0].total);
    
    return missing
}