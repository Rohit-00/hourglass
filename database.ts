import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('appData.db');
export const createTable = async () => {

    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS work (date TEXT,title TEXT NOT NULL, duration TEXT, percentage INTEGER, tag TEXT);
        `);
    return  db
};

export const addTask = async (date:string,title:string,duration:string,percentage:number,tag:string) => {
    const result = await db.runAsync(
        'INSERT INTO work (date, title, duration, percentage, tag) VALUES (?, ?, ?, ?, ?)'
        , date, title, duration, percentage, tag);
    return result
    
}

export const getTasks = async() => {
    const allRows:Tasks[] = await db.getAllAsync('SELECT * FROM work');
    return allRows
}

