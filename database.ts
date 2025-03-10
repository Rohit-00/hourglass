import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { convertTimeDifferenceToNumber, timeDifference } from './utils/dateHelpers';
import { formattedToday, formattedYesterday } from './utils/dateHelpers';
const db = SQLite.openDatabaseSync('appData.db');

export const createTable = async () => {
    try{

    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS results (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT UNIQUE, result TEXT);
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
    const allRows:Tasks[] = await db.getAllAsync(`SELECT * FROM all_tasks WHERE date = ?`,formattedToday);
    return allRows
}


export const getProductivePercentage = async() => { 
    const result = await db.getAllAsync('SELECT SUM(percentage) as total FROM all_tasks WHERE tag = "Productive" AND date = ?',formattedToday); 
    return result
}

export const getUnproductivePercentage = async() => {

    const result = await db.getAllAsync('SELECT SUM(percentage) as total FROM all_tasks WHERE tag = "Unproductive" AND date = ?',formattedToday);

    return result
}

export const getNeutralPercentage = async() => {
    const result = await db.getAllAsync('SELECT SUM(percentage) as total FROM all_tasks WHERE tag = "neutral" AND date = ?',formattedToday);

    return result
}

export const getMissingPercentage = async() => {
    const result:any = await db.getAllAsync('SELECT SUM(percentage) as total  FROM all_tasks WHERE date = ?',formattedToday);
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
    const result = await db.getAllAsync('SELECT SUM(duration) as total FROM all_tasks WHERE tag = "Unproductive" AND date = ?',date);
    return result
}

export const getTotalNeutralHours = async(date:string) => {
    const result = await db.getAllAsync('SELECT SUM(duration) as total FROM all_tasks WHERE tag = "neutral" AND date = ?',date);
    return result
}

export const getTotalMissingHours = async() => {
    const storedBedtime:any = await AsyncStorage.getItem('bedtime');
    const storedWakeupTime:any = await AsyncStorage.getItem('wakeupTime');
    const totalTime = convertTimeDifferenceToNumber(timeDifference(storedWakeupTime,storedBedtime)); 
    const productive:any = await getTotalProductiveHours(formattedToday);
    const unproductive:any = await getTotalUnproductiveHours(formattedToday);
    const neutral:any = await getTotalNeutralHours(formattedToday);
    const missing = totalTime - (productive[0].total + unproductive[0].total + neutral[0].total);
    return missing
}


export const getYesterdayMissingHours = async() => {
    const storedBedtime:any = await AsyncStorage.getItem('bedtime');
    const storedWakeupTime:any = await AsyncStorage.getItem('wakeupTime');
    const totalTime = convertTimeDifferenceToNumber(timeDifference(storedWakeupTime,storedBedtime)); 
    const productive:any = await db.getAllAsync('SELECT SUM(duration) as total FROM all_tasks WHERE tag = "Productive" AND date = ?',formattedYesterday);
    const unproductive:any = await db.getAllAsync('SELECT SUM(duration) as total FROM all_tasks WHERE tag = "Unproductive" AND date = ?',formattedYesterday);
    const neutral:any = await db.getAllAsync('SELECT SUM(duration) as total FROM all_tasks WHERE tag = "neutral" AND date = ?',formattedYesterday);
    const missing = totalTime - (productive[0].total + unproductive[0].total + neutral[0].total);
    return missing
}
export const getYesterdayResult = async() => {
    const productive:any = await db.getAllAsync('SELECT SUM(duration) as total FROM all_tasks WHERE tag = "Productive" AND date = ?',formattedYesterday);
    const unproductive:any = await db.getAllAsync('SELECT SUM(duration) as total FROM all_tasks WHERE tag = "Unproductive" AND date = ?',formattedYesterday);
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
    const allRows:Tasks[] = await db.getAllAsync(`SELECT * FROM all_tasks WHERE date = ?`,formattedYesterday);
    return allRows
}

export const addResult = async(date:string,result:string) => {
  
        const res = await db.runAsync(
            'INSERT INTO results (date, result) VALUES (?, ?)'
            , date,result);
    
        return res
  

}

export const getResults = async() => {
    const CURRENT_MONTH = new Date().getMonth() + 1
    const allRows:Result[] = await db.getAllAsync(`SELECT * FROM results WHERE date LIKE ?`,[`${CURRENT_MONTH}%`]);
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
    const result = await db.getFirstAsync(`SELECT * FROM results WHERE date = ?`,date)
    return result
}
const resultCache = new Map<string, any>();

export const addMonthResults = async (currentMonth: number, currentYear: number) => {
    const date = new Date().getDate();
    const data = [];

    for (let i = 1; i <= date-1; i++) {
        const key = `${currentMonth}/${i}/${currentYear}`;

        if (resultCache.has(key)) {
         
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

export const getThisMonthProductiveDays = async() => {
    const CURRENT_MONTH = new Date().getMonth() + 1
    const CURRENT_YEAR = new Date().getFullYear()
    try{
        const productiveCount: any = await db.getAllAsync(
            "SELECT COUNT(*) as total FROM results WHERE result = ? AND date LIKE ? AND date LIKE ?",
            ["Productive", `${CURRENT_MONTH}%`,`%${CURRENT_YEAR}`]
          );
          
        return productiveCount[0].total - 1

              }catch(e){
    console.log(e)
    }

}
export const getLastMonthProductiveDays = async() => {
    const LAST_MONTH = new Date().getMonth() 
    const CURRENT_YEAR = new Date().getFullYear()
    try{
        const productiveCount: any = await db.getAllAsync(
            "SELECT COUNT(*) as total FROM results WHERE result = ? AND date LIKE ? AND date LIKE ?",
            ["Productive", `${LAST_MONTH}%`,`%${CURRENT_YEAR}`]
          );
        return productiveCount

              }catch(e){
    console.log(e)
    }

}

export const getLastMonthResultsNumber = async() => {
    const LAST_MONTH = new Date().getMonth() 
    try{

    
    const allRows:Result[] = await db.getAllAsync(`SELECT * FROM results WHERE result = ? AND DATE LIKE ?`,
        ["Productive",`${LAST_MONTH}%`]
    );
    return allRows.length
}catch(e){
    console.log(e)
}
}
export const updateTask = async (id:number,date:string,title:string,duration:string,percentage:number,tag:string,start_time:string,end_time:string) => {
    const result = await db.runAsync(
        'UPDATE all_tasks SET date = ?, title = ?, duration = ?, percentage = ?, tag = ?, start_time = ?, end_time = ? where id = ?'
        , date, title, duration, percentage, tag, start_time, end_time,id);
    return result
    
}
