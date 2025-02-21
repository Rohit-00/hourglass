import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('appData.db');
export const createTable = async () => {

    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS tasks (title TEXT NOT NULL, time TEXT, percentage TEXT);
        `);
    return  db
};

export const addTask = async () => {
    const result = await db.runAsync('INSERT INTO tasks (title, time) VALUES (?, ?)', 'aaa', '10');
    console.log(result.lastInsertRowId, result.changes);
}

export const getTasks = async() => {
    const allRows:tasks[] = await db.getAllAsync('SELECT * FROM tasks');
    return allRows
}

