import { configureStore } from "@reduxjs/toolkit";
import checkListReducer from "../features/checkList";
import orderingReducer from "../features/ordering/orderingSlice";

export const store = configureStore({
    reducer: {
        checkList: checkListReducer,
        ordering: orderingReducer,
    }
})

store.subscribe(() => {
    const { cart, orders } = store.getState().ordering
    try {
        localStorage.setItem('ew-customer-cart', JSON.stringify(cart))
        localStorage.setItem('ew-customer-orders', JSON.stringify(orders))
    } catch {
        // The ordering flow remains usable if browser storage is unavailable.
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch