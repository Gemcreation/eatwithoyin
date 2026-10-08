import { configureStore } from "@reduxjs/toolkit";
import orderingReducer from "../features/ordering/orderingSlice";

export const store = configureStore({
    reducer: {
        ordering: orderingReducer,
    }
})

store.subscribe(() => {
    const { cart, orders, foods, kitchenSettings, riderOnline } = store.getState().ordering
    try {
        localStorage.setItem('ew-customer-cart', JSON.stringify(cart))
        localStorage.setItem('ew-customer-orders', JSON.stringify(orders))
        localStorage.setItem('ew-menu-foods', JSON.stringify(foods))
        localStorage.setItem('ew-kitchen-settings', JSON.stringify(kitchenSettings))
        localStorage.setItem('ew-rider-online', String(riderOnline))
    } catch {
        // The ordering flow remains usable if browser storage is unavailable.
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch