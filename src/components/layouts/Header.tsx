import React, {useState} from 'react'
import { Link, useLocation } from 'react-router-dom'

// assets-images
import Logo from '../../assets/images/OyinLogo.png'
import { Album02Icon, Cancel01Icon, Home01Icon, Menu11Icon, ShoppingCart01Icon } from 'hugeicons-react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../app/store'

type NavLink = {
    label: string
    path: string
    icon: React.ComponentType<{size: number}>
}

const Header: React.FC = () => {
    const [toggle, setToggle] = useState(false)
    const location = useLocation()
    const cartCount = useSelector((state: RootState) => state.ordering.cart.reduce((count, item) => count + item.quantity, 0))
    const mainNavLinks: NavLink[] = [
        {
            label: 'Home',
            path: '/',
            icon: Home01Icon
        },
        {
            label: 'Menu',
            path: '/menu',
            icon: ShoppingCart01Icon
        },
        {
            label: 'Order',
            path: '/place-order',
            icon: ShoppingCart01Icon
        },
        {
            label: 'Gallery',
            path: '/gallery',
            icon: Album02Icon
        },
        {
            label: 'Cart',
            path: '/cart',
            icon: ShoppingCart01Icon
        },
        {
            label: 'Orders',
            path: '/orders',
            icon: ShoppingCart01Icon
        }
    ]
    const authNavLinks: NavLink[] = [
        {
            label: 'Login',
            path: '/login',
            icon: Home01Icon
        },
        {
            label: 'Sign Up',
            path: '/signup',
            icon: Home01Icon
        },
    ]
    // The combined list preserves access to every route in the mobile menu.
    const navLinks = [...mainNavLinks, ...authNavLinks]
    

    // functions
    const handleToggleNav = () => {
        setToggle(!toggle)
    }
  return (
      <section className='sticky top-0'>
          <header className='max-w-[85%] z-999 mx-auto grid grid-cols-[auto_1fr_auto] items-center sticky top-0'>
              <div className='w-[128px] h-[64px] lg:w-[160px] lg:h-[80px] flex items-center justify-center overflow-hidden'>
                <img src={Logo} alt="Oyin-Logo" className='max-w-full max-h-full object-contain object-center' />
              </div>

              {/* Center navigation - grid column 2 ensures true centering */}
              <nav className='hidden text-mainColor text-lg lg:flex justify-center gap-[15px] whitespace-nowrap'>
                                    {mainNavLinks.map((link) => (
                                            <Link key={link.path} to={link.path} className={`nav-link ${location.pathname === link.path || (link.path === '/menu' && location.pathname.startsWith('/menu/')) ? 'active' : ''}`}>
                                                {link.label}{link.path === '/cart' && cartCount > 0 ? ` (${cartCount})` : ''}
                                            </Link>
                  ))}
              </nav>

              {/* Right-side authentication navigation */}
              <nav className='hidden text-mainColor text-lg lg:flex justify-end gap-[15px] whitespace-nowrap'>
                  {authNavLinks.map((link) => (
                      <Link key={link.path} to={link.path} className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}>{ link.label}</Link>
                  ))}
              </nav>

              {/* Download App button intentionally commented out for now.
                  Restore when the mobile app is ready. */}
              {/* <div className='hidden lg:block'>
                  <button className='bg-primaryColor text-mainColor w-[150px] h-[40px] rounded-md'>Download App</button>
              </div> */}

              {/* Mobile */}
              <button type='button' aria-label={toggle ? 'Close navigation' : 'Open navigation'} aria-expanded={toggle} aria-controls='mobile-navigation' onClick={handleToggleNav} className='col-start-3 block justify-self-end lg:hidden z-999 p-0 border-0 bg-transparent'>
                  {!toggle
                      ? <Menu11Icon size={24} className='text-mainColor' />
                      : <Cancel01Icon size={24} className='text-mainColor' />
                  }
              </button>

              <div id='mobile-navigation' inert={!toggle} className={`fixed bg-secondaryColor z-999 w-screen h-screen top-[14.7%] lg:hidden
                    ${toggle ? 'left-0 transition-all ease-in-out duration-1000'
                      : '-left-full transition-all ease-in-out duration-500'}
                `}>
                
                <nav className=' text-mainColor text-lg flex flex-col w-[85%] mx-auto mt-[30px]'>
                      {navLinks.map((link) => (
                        <div key={link.path} className='flex gap-[12px] mb-10' onClick={() => setToggle(false)}>
                            <link.icon size={24} />  
                            <Link to={link.path}>{link.label}{link.path === '/cart' && cartCount > 0 ? ` (${cartCount})` : ''}</Link>
                        </div>
                    ))}
                </nav>
            </div>
          </header>
    </section>
  )
}

export default Header
