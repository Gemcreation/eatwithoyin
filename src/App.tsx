import { useState } from 'react'
import './App.css'
import { Route, Routes, useLocation } from 'react-router-dom'

// Layouts
import Header from './components/layouts/Header'
import Footer from './components/layouts/Footer'

// Components
import Home from './components/pages/Home'
import Order from './components/pages/Order'
import Gallery from './components/pages/Gallery'
import Login from './components/pages/Login'
import SignUp from './components/pages/SignUp'
import CheckLists from './components/layouts/CheckLists'
import Menu from './components/pages/Menu'
import FoodDetails from './components/pages/FoodDetails'
import Cart from './components/pages/Cart'
import Checkout from './components/pages/Checkout'
import OrderTracking from './components/pages/OrderTracking'
import Orders from './components/pages/Orders'
import KitchenLayout from './components/kitchen/KitchenLayout'
import KitchenDashboard from './components/pages/kitchen/KitchenDashboard'
import KitchenOrders from './components/pages/kitchen/KitchenOrders'
import KitchenOrderDetails from './components/pages/kitchen/KitchenOrderDetails'
import KitchenMenu from './components/pages/kitchen/KitchenMenu'
import KitchenMenuFormPage from './components/pages/kitchen/KitchenMenuFormPage'
import KitchenSettingsPage from './components/pages/kitchen/KitchenSettings'
import RiderLayout from './components/rider/RiderLayout'
import RiderDashboard from './components/pages/rider/RiderDashboard'
import RiderDeliveries from './components/pages/rider/RiderDeliveries'
import RiderDeliveryDetails from './components/pages/rider/RiderDeliveryDetails'
import RiderHistory from './components/pages/rider/RiderHistory'
import RiderProfile from './components/pages/rider/RiderProfile'

function App() {
  const [checkListSwitch, setCheckListSwitch] = useState(false)
  const location = useLocation()
  const isKitchenRoute = location.pathname.startsWith('/kitchen')
  const isRiderRoute = location.pathname.startsWith('/rider')
  const isOperationsRoute = isKitchenRoute || isRiderRoute
  
  const openCheckList = () => {
        setCheckListSwitch(true)
    }

    const closeCheckList = () => {
        setCheckListSwitch(false)
    }

  return (
    <>
      {!isOperationsRoute && (
        <div className='bg-secondaryColor sticky top-0 z-999'>
          <Header />
        </div>
      )}
      <Routes>
        <Route path='kitchen' element={<KitchenLayout />}>
          <Route index element={<KitchenDashboard />} />
          <Route path='orders' element={<KitchenOrders />} />
          <Route path='orders/:id' element={<KitchenOrderDetails />} />
          <Route path='menu' element={<KitchenMenu />} />
          <Route path='menu/new' element={<KitchenMenuFormPage />} />
          <Route path='menu/:id/edit' element={<KitchenMenuFormPage />} />
          <Route path='settings' element={<KitchenSettingsPage />} />
        </Route>
        <Route path='rider' element={<RiderLayout />}>
          <Route index element={<RiderDashboard />} />
          <Route path='deliveries' element={<RiderDeliveries />} />
          <Route path='deliveries/:id' element={<RiderDeliveryDetails />} />
          <Route path='history' element={<RiderHistory />} />
          <Route path='profile' element={<RiderProfile />} />
        </Route>
        <Route path='/' index element={<Home />} />
        <Route path='menu' element={<Menu />} />
        <Route path='menu/:id' element={<FoodDetails />} />
        <Route path='cart' element={<Cart />} />
        <Route path='checkout' element={<Checkout />} />
        <Route path='order/:id' element={<OrderTracking />} />
        <Route path='orders' element={<Orders />} />
        <Route path='place-order' element={<Order checkListFunction={openCheckList} />} />
        <Route path='gallery' element={<Gallery />} />
        {/* UI-only authentication routes; backend integration is intentionally deferred. */}
        <Route path='login' element={<Login />} />
        <Route path='signup' element={<SignUp />} />
      </Routes>
      {!isOperationsRoute && <Footer />}

      {!isOperationsRoute && (
        <aside className={`bg-mainColor w-full lg:w-[450px] h-screen fixed top-0 z-1000 transition-all duration-1000 ease-in-out ${checkListSwitch ? 'right-0' : ' -right-full'}`}>
            {checkListSwitch && <CheckLists closeCheckList={closeCheckList} />}
        </aside>
      )}
    </>
  )
}

export default App
