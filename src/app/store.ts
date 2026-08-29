import { configureStore } from "@reduxjs/toolkit";
import checkListReducer from "../features/checkList";

export const store = configureStore({
    reducer: {
        checkList: checkListReducer
    }
})

export type RootState = ReturnType<typeof store.getState>