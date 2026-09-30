import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'

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

function App() {
  const [checkListSwitch, setCheckListSwitch] = useState(false)
  
  const openCheckList = () => {
        setCheckListSwitch(true)
    }

    const closeCheckList = () => {
        setCheckListSwitch(false)
    }

  return (
    <>
      <div className='bg-secondaryColor sticky top-0 z-[999]'>
        <Header />
      </div>
      <Routes>
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
      <div>
        <Footer />
      </div>

      <aside className={`bg-mainColor w-full lg:w-[450px] h-screen fixed top-0 z-[1000] transition-all duration-1000 ease-in-out ${checkListSwitch ? 'right-0' : ' right-[-100%]'}`}>
          {checkListSwitch && (
              <CheckLists closeCheckList={closeCheckList} />
          )}
      </aside>
    </>
  )
}

export default App
