import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { convertTimeDifferenceToNumber, timeDifference } from './utils/dateHelpers';

const db = SQLite.openDatabaseSync('appData.db');
const TODAY = new Date().toLocaleDateString();
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
export const yesterdayDate = yesterday.toLocaleDateString();
export const createTable = async () => {
    try{

    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS daily_result (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, result TEXT);
        CREATE TABLE IF NOT EXISTS all_tasks (id INTEGER PRIMARY KEY AUTOINCREMENT ,date TEXT,title TEXT NOT NULL, duration INTEGER, percentage INTEGER, tag TEXT, start_time TEXT, end_time TEXT);
        `);}catch(e){
            console.log(e)
        }
            
    return  db
};

export const addTask = async (date:string,title:string,duration:string,percentage:number,tag:string,start_time:string,end_time:string) => {
    const result = await db.runAsync(
        'INSERT INTO all_tasks (date, title, duration, percentage, tag, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?, ?)'
        , date, title, duration, percentage, tag, start_time, end_time);
    return result
    
}

export const getTasks = async() => {
    const date = new Date().toLocaleDateString();
    const allRows:Tasks[] = await db.getAllAsync(`SELECT * FROM all_tasks WHERE date = ?`,date);
    return allRows
}


export const getProductivePercentage = async() => { 
    const result = await db.getAllAsync('SELECT SUM(percentage) as total FROM all_tasks WHERE tag = "Productive" AND date = ?',TODAY); 
    return result
}

export const getUnproductivePercentage = async() => {

    const result = await db.getAllAsync('SELECT SUM(percentage) as total FROM all_tasks WHERE tag = "Anti-Productive" AND date = ?',TODAY);

    return result
}

export const getNeutralPercentage = async() => {
    const result = await db.getAllAsync('SELECT SUM(percentage) as total FROM all_tasks WHERE tag = "neutral" AND date = ?',TODAY);

    return result
}

export const getMissingPercentage = async() => {
    const result:any = await db.getAllAsync('SELECT SUM(percentage) as total  FROM all_tasks WHERE date = ?',TODAY);
    const productive:any = await getProductivePercentage();
    const unproductive:any = await getUnproductivePercentage();
    const neutral:any = await getNeutralPercentage();
    const missing = result[0].total - (productive[0].total + unproductive[0].total + neutral[0].total);
    return missing
}

export const getTotalProductiveHours = async(date:string) => {
    const result = await db.getAllAsync('SELECT SUM(duration) as total FROM all_tasks WHERE tag = "Productive" AND date = ?',date);
    
    return result
}

export const getTotalUnproductiveHours = async(date:string) => {
    const result = await db.getAllAsync('SELECT SUM(duration) as total FROM all_tasks WHERE tag = "Anti-Productive" AND date = ?',date);
    return result
}

export const getTotalNeutralHours = async() => {
    const result = await db.getAllAsync('SELECT SUM(duration) as total FROM all_tasks WHERE tag = "neutral" AND date = ?',TODAY);
    return result
}

export const getTotalMissingHours = async() => {
    const storedBedtime:any = await AsyncStorage.getItem('bedtime');
    const storedWakeupTime:any = await AsyncStorage.getItem('wakeupTime');
    const totalTime = convertTimeDifferenceToNumber(timeDifference(storedWakeupTime,storedBedtime)); 
    const productive:any = await getTotalProductiveHours(TODAY);
    const unproductive:any = await getTotalUnproductiveHours(TODAY);
    const neutral:any = await getTotalNeutralHours();
    const missing = totalTime - (productive[0].total + unproductive[0].total + neutral[0].total);
    return missing
}


const getYesterdayMissingHours = async() => {
    const storedBedtime:any = await AsyncStorage.getItem('bedtime');
    const storedWakeupTime:any = await AsyncStorage.getItem('wakeupTime');
    const totalTime = convertTimeDifferenceToNumber(timeDifference(storedWakeupTime,storedBedtime)); 
    const productive:any = await db.getAllAsync('SELECT SUM(duration) as total FROM all_tasks WHERE tag = "Productive" AND date = ?',yesterdayDate);
    const unproductive:any = await db.getAllAsync('SELECT SUM(duration) as total FROM all_tasks WHERE tag = "Anti-Productive" AND date = ?',yesterdayDate);
    const neutral:any = await db.getAllAsync('SELECT SUM(duration) as total FROM all_tasks WHERE tag = "neutral" AND date = ?',yesterdayDate);
    const missing = totalTime - (productive[0].total + unproductive[0].total + neutral[0].total);
    return missing
}
export const getYesterdayResult = async() => {
    const productive:any = await db.getAllAsync('SELECT SUM(duration) as total FROM all_tasks WHERE tag = "Productive" AND date = ?',yesterdayDate);
    const unproductive:any = await db.getAllAsync('SELECT SUM(duration) as total FROM all_tasks WHERE tag = "Anti-Productive" AND date = ?',yesterdayDate);
    const missing:any = getYesterdayMissingHours();
    if (productive[0].total > unproductive[0].total){
        return "Productive"
    } if(productive[0].total === unproductive[0].total){
        return "Neutral"
    }
    if(missing>productive[0].total){
        return "Missing"
    }
    else{
        return "Unproductive"
    }
    
}

export const deleteTask = async (id:number) => {
    const result = await db.runAsync('DELETE FROM all_tasks WHERE id = ?',id);
    return result
}

export const getOneTask = async(id:number) => {
    const task = await db.getFirstAsync('SELECT * FROM all_tasks WHERE id = ?',id);
    return task
}

export const getYesterdayTasks = async() => {
    const allRows:Tasks[] = await db.getAllAsync(`SELECT * FROM all_tasks WHERE date = ?`,yesterdayDate);
    return allRows
}

export const addResult = async(date:string,result:string) => {
    try{
    const data = await db.getFirstAsync('SELECT * FROM daily_result WHERE date = ?',date)
    if(data === null){
        const res = await db.runAsync(
            'INSERT INTO daily_result (date, result) VALUES (?, ?)'
            , date,result);
    
        return res
    }}catch(e){
        console.log(e)
    }
    return null

}

export const getResults = async() => {
    const allRows:Result[] = await db.getAllAsync(`SELECT * FROM daily_result`);
    return allRows
}

    const fetchResult = async (date:string) => {
        const productive : any = await getTotalProductiveHours(date);
        const Unproductive : any = await getTotalUnproductiveHours(date);
        const missing : any = await getTotalMissingHours();
        const result = productive[0].total > Unproductive[0].total ? 'Productive'  :
        productive[0].total === null && Unproductive[0].total === null ? 'Missing' : 'Unproductive'
        return result
    }

export const getResult = async(date:string) => {
    const result = await db.getFirstAsync(`SELECT * FROM daily_result WHERE date = ?`,date)
    return result
}

// Cache to store fetched results
const resultCache = new Map<string, any>();

export const addMonthResults = async (currentMonth: number, currentYear: number) => {
    const date = new Date().getDate();
    const data = [];

    for (let i = 1; i <= date-1; i++) {
        const key = `${currentMonth}/${i}/${currentYear}`;

        if (resultCache.has(key)) {
            data.push(resultCache.get(key));
            continue;
        }

        let currentResult: Result | any = await getResult(key);

        if (currentResult === null) {
            currentResult = await fetchResult(key);
            await addResult(key,currentResult)
            data.push(currentResult)
        } 

        resultCache.set(key, currentResult);
      
    }

    return data;
};

