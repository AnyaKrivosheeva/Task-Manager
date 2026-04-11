import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Task } from "../types/task";
import type { TaskStatus } from "../types/task";

interface TasksState {
    items: Task[];
}

const initialState: TasksState = {
    items: [],
};

const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<Task>) => {
            state.items.push(action.payload);
        },

        deleteTask: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(task => task.id !== action.payload);
        },

        updateTask: (state, action: PayloadAction<Task>) => {
            const index = state.items.findIndex(t => t.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        setTaskStatus: (
            state,
            action: PayloadAction<{ id: string; status: TaskStatus }>
        ) => {
            const task = state.items.find((t) => t.id === action.payload.id);

            if (task) {
                task.status = action.payload.status;
            }
        },
    },
});

export const { addTask, deleteTask, updateTask, setTaskStatus } = tasksSlice.actions;
export default tasksSlice.reducer;