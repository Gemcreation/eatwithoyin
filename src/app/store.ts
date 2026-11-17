import { configureStore, type Middleware } from "@reduxjs/toolkit";
import orderingReducer, {
    assignRiderToOrder,
    canTransitionOrderStatus,
    DELETED_DEMO_ORDER_STORAGE_KEY,
    ORDER_STORAGE_KEY,
    parseDeletedDemoOrderIds,
    parseStoredOrders,
    setOrderStatus,
    synchronizeOrders,
} from "../features/ordering/orderingSlice";
import type { CustomerOrder, OrderStatus } from "../features/ordering/types";

type OrderingRoot = { ordering: ReturnType<typeof orderingReducer> };
const riderStatuses = new Set<OrderStatus>(['RIDER_ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED'])

const transitionDiagnostics: Middleware<object, OrderingRoot> = ({ getState }) => (next) => (action) => {
    if (setOrderStatus.match(action)) {
        const order = getState().ordering.orders.find((item) => item.id === action.payload.orderId)
        if (!order) {
            console.warn(`[EatWithOyin] Ignored status update: order "${action.payload.orderId}" was not found.`)
        } else if (!canTransitionOrderStatus(order.status, action.payload.status) ||
            riderStatuses.has(action.payload.status) && !order.rider) {
            console.warn(`[EatWithOyin] Ignored invalid order transition ${order.status} → ${action.payload.status} for "${order.id}".`)
        }
    } else if (assignRiderToOrder.match(action)) {
        const order = getState().ordering.orders.find((item) => item.id === action.payload.orderId)
        if (!order) {
            console.warn(`[EatWithOyin] Ignored rider assignment: order "${action.payload.orderId}" was not found.`)
        } else if (!canTransitionOrderStatus(order.status, 'RIDER_ASSIGNED')) {
            console.warn(`[EatWithOyin] Ignored rider assignment for "${order.id}" in status ${order.status}.`)
        }
    }
    return next(action)
}

export const store = configureStore({
    reducer: {
        ordering: orderingReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(transitionDiagnostics),
})

const persistValue = (key: string, value: string) => {
    try {
        if (localStorage.getItem(key) !== value) localStorage.setItem(key, value)
    } catch (error) {
        console.error(`[EatWithOyin] Could not persist "${key}". Changes may not survive a refresh.`, error)
    }
}

store.subscribe(() => {
    const { cart, orders, deletedDemoOrderIds, foods, kitchenSettings, riderOnline } = store.getState().ordering
    let persistedTombstones = deletedDemoOrderIds
    try {
        persistedTombstones = [...new Set([
            ...persistedTombstones,
            ...parseDeletedDemoOrderIds(localStorage.getItem(DELETED_DEMO_ORDER_STORAGE_KEY)),
        ])]
    } catch (error) {
        console.error(`[EatWithOyin] Could not reconcile deleted demo IDs from "${DELETED_DEMO_ORDER_STORAGE_KEY}".`, error)
    }

    persistValue(DELETED_DEMO_ORDER_STORAGE_KEY, JSON.stringify(persistedTombstones))
    persistValue('ew-customer-cart', JSON.stringify(cart))
    persistValue(ORDER_STORAGE_KEY, JSON.stringify(
        orders.filter((order) => !order.isDemo || !persistedTombstones.includes(order.id)),
    ))
    persistValue('ew-menu-foods', JSON.stringify(foods))
    persistValue('ew-kitchen-settings', JSON.stringify(kitchenSettings))
    persistValue('ew-rider-online', String(riderOnline))
})

// localStorage has no transactions or compare-and-swap; concurrent writes can briefly race.
// Open tabs reconcile order snapshots and converge while active, but cannot guarantee server-grade durability.
if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
        if (event.key !== ORDER_STORAGE_KEY && event.key !== DELETED_DEMO_ORDER_STORAGE_KEY) return
        try {
            if (event.storageArea !== localStorage) return
        } catch (error) {
            console.error('[EatWithOyin] Could not inspect the order storage event.', error)
            return
        }

        const previousOrders = event.key === ORDER_STORAGE_KEY
            ? parseStoredOrders(event.oldValue)
            : []
        const incomingOrders = parseStoredOrders(
            event.key === ORDER_STORAGE_KEY ? event.newValue : localStorage.getItem(ORDER_STORAGE_KEY),
        )
        const tombstones = parseDeletedDemoOrderIds(
            event.key === DELETED_DEMO_ORDER_STORAGE_KEY ? event.newValue : localStorage.getItem(DELETED_DEMO_ORDER_STORAGE_KEY),
        )
        const incomingIds = new Set(incomingOrders.map((order) => order.id))
        const removedDemoOrderIds = [...new Set([
            ...tombstones,
            ...previousOrders
            .filter((order) => order.isDemo && !incomingIds.has(order.id))
            .map((order) => order.id),
        ])]

        store.dispatch(synchronizeOrders({
            orders: incomingOrders,
            removedDemoOrderIds,
        }))
    })
}

export const isOrderPersisted = (order: CustomerOrder) => {
    try {
        const orders = parseStoredOrders(localStorage.getItem(ORDER_STORAGE_KEY))
        return orders.some((storedOrder) => JSON.stringify(storedOrder) === JSON.stringify(order))
    } catch (error) {
        console.error(`[EatWithOyin] Could not verify order persistence in "${ORDER_STORAGE_KEY}".`, error)
        return false
    }
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch