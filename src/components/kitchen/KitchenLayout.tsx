import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Cancel01Icon, Home01Icon, Menu11Icon, ShoppingCart01Icon, Album02Icon } from 'hugeicons-react'
import Logo from '../../assets/images/OyinLogo.png'
import '../../Kitchen.css'

const navigation = [
  { label: 'Overview', to: '/kitchen', icon: Home01Icon, end: true },
  { label: 'Orders', to: '/kitchen/orders', icon: ShoppingCart01Icon, end: false },
  { label: 'Menu', to: '/kitchen/menu', icon: Album02Icon, end: false },
  { label: 'Settings', to: '/kitchen/settings', icon: Home01Icon, end: false },
]

const KitchenLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="kitchen-app">
      <aside className={`kitchen-sidebar ${menuOpen ? 'is-open' : ''}`}>
        <Link to="/kitchen" className="kitchen-brand" onClick={() => setMenuOpen(false)}>
          <img src={Logo} alt="EatWithOyin" />
          <span><strong>Oyin's Kitchen</strong><small>Operations</small></span>
        </Link>
        <nav className="kitchen-navigation" aria-label="Kitchen navigation">
          <p className="kitchen-nav-label">WORKSPACE</p>
          {navigation.map(({ label, to, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setMenuOpen(false)} className={({ isActive }) => `kitchen-nav-link ${isActive ? 'is-active' : ''}`}>
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="kitchen-sidebar-footer">
          <span className="kitchen-open-indicator" />
          <div><strong>Kitchen workspace</strong><small>Frontend preview</small></div>
        </div>
      </aside>

      {menuOpen && <button type="button" className="kitchen-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}

      <div className="kitchen-content">
        <header className="kitchen-topbar">
          <button type="button" className="kitchen-mobile-menu" aria-label={menuOpen ? 'Close kitchen navigation' : 'Open kitchen navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <Cancel01Icon size={22} /> : <Menu11Icon size={22} />}
          </button>
          <div className="kitchen-breadcrumb">
            <span>Oyin's Kitchen</span><span aria-hidden="true">/</span>
            <strong>{navigation.find((item) => item.to === location.pathname)?.label ?? (location.pathname.includes('/orders/') ? 'Order details' : location.pathname.includes('/menu/') ? 'Edit menu item' : 'Workspace')}</strong>
          </div>
          <button type="button" className="kitchen-signout" disabled title="Kitchen sign-in is not part of this frontend phase">Sign out</button>
        </header>
        <main className="kitchen-main"><Outlet /></main>
      </div>
    </div>
  )
}

export default KitchenLayout