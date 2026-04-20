import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./tasksSlice";
import { saveTasks } from "../shared/lib/localStorage";

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
    },
});

store.subscribe(() => {
    const state = store.getState();
    saveTasks(state.tasks.items);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;