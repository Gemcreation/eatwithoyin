import React, {useState} from 'react'
import { Link } from 'react-router-dom'

// assets-images
import Logo from '../../assets/images/OyinLogo.png'
import { Album02Icon, Cancel01Icon, Home01Icon, Menu11Icon, ShoppingCart01Icon } from 'hugeicons-react'

type NavLink = {
    label: string
    path: string
    icon: React.ComponentType<{size: number}>
}

const Header: React.FC = () => {
    const [toggle, setToggle] = useState(false)
    const [activeLink, setActiveLink] = useState(0)
    const navLinks: NavLink[] = [
        {
            label: 'Home',
            path: '/',
            icon: Home01Icon
        },
        {
            label: 'Order',
            path: 'place-order',
            icon: ShoppingCart01Icon
        },
        {
            label: 'Gallery',
            path: 'gallery',
            icon: Album02Icon
        },
    ]
    

    // functions
    const handleToggleNav = () => {
        setToggle(!toggle)
    }
  return (
      <section className='sticky top-0'>
          <header className='max-w-[85%] z-[999] mx-auto flex flex-row items-center justify-between sticky top-0'>
              <div className='w-[128px] h-[64px] lg:w-[160px] lg:h-[80px] flex items-center justify-center overflow-hidden'>
                <img src={Logo} alt="Oyin-Logo" className='max-w-full max-h-full object-contain object-center' />
              </div>

              <nav className='hidden text-mainColor text-lg lg:flex gap-[15px]'>
                  {navLinks.map((link, index) => (
                      <Link key={index} to={link.path} className={`nav-link ${activeLink === index ? 'active' : ''}`} onClick={() => setActiveLink(index)}>{ link.label}</Link>
                  ))}
              </nav>

              <div className='hidden lg:block'>
                  <button className='bg-primaryColor text-mainColor w-[150px] h-[40px] rounded-md'>Download App</button>
              </div>

              {/* Mobile */}
              <div onClick={handleToggleNav} className='block lg:hidden z-[999]'>
                  {!toggle
                      ? <Menu11Icon size={24} className='text-mainColor' />
                      : <Cancel01Icon size={24} className='text-mainColor' />
                  }
              </div>

              <div className={`fixed bg-secondaryColor z-[999] w-screen h-[100vh] top-[14.7%] lg:hidden
                    ${toggle ? 'left-0 transition-all ease-in-out duration-1000'
                      : 'left-[-100%] transition-all ease-in-out duration-500'}
                `}>
                
                <nav className=' text-mainColor text-lg flex flex-col w-[85%] mx-auto mt-[30px]'>
                      {navLinks.map((link, index) => (
                        <div className='flex gap-[12px] mb-10' onClick={() => setToggle(false)}>
                            <link.icon size={24} />  
                            <Link key={index} to={link.path}>{link.label}</Link>
                        </div>
                    ))}
                </nav>
            </div>
          </header>
    </section>
  )
}

export default Header
