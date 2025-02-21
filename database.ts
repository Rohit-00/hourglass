import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('appData.db');
export const createTable = async () => {

    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS tasks (title TEXT NOT NULL, time TEXT, percentage TEXT);
        `);
    return  db
};

export const addTask = async (title:string,time:string) => {
    const result = await db.runAsync('INSERT INTO tasks (title, time) VALUES (?, ?)', title, time);
    console.log(result.lastInsertRowId, result.changes);
}

export const getTasks = async() => {
    const allRows:tasks[] = await db.getAllAsync('SELECT * FROM tasks');
    return allRows
}

