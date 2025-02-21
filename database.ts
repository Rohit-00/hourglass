import * as SQLite from 'expo-sqlite';

export const createTable = async () => {
    const db = await SQLite.openDatabaseAsync('myDatabase.db');
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, time TEXT, percentage TEXT);
        `);
};
