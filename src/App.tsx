import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'

// Layouts
import Header from './components/layouts/Header'
import Footer from './components/layouts/Footer'

// Components
import Home from './components/pages/Home'
import Order from './components/pages/Order'
import CheckLists from './components/layouts/CheckLists'

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
        <Route path='place-order' element={<Order checkListFunction={openCheckList} />} />
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
