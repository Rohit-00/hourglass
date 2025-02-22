// context/TasksContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getTasks, addTask } from '../database';


interface TasksContextType {
    tasks: Tasks[];
    fetchTasks: () => Promise<void>;
    createTask: (date:string,title: string, duration: string, percentage:number,tag:string) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Tasks[]>([]);

    const fetchTasks = async () => {
        const allTasks = await getTasks();
        setTasks(allTasks);
    };

    const createTask = async (date:string,title: string, duration: string, percentage:number,tag:string) => {
        await addTask(date,title, duration, percentage, tag);
        await fetchTasks(); // Refresh the task list after adding a new task
    };

    useEffect(() => {
        fetchTasks(); // Fetch tasks when the provider mounts
    }, []);

    return (
        <TasksContext.Provider value={{ tasks, fetchTasks, createTask }}>
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