import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Cancel01Icon, Home01Icon, Menu11Icon, PackageReceive01Icon, UserCircleIcon, TimeQuarterPassIcon } from 'hugeicons-react'
import Logo from '../../assets/images/OyinLogo.png'
import '../../Rider.css'

const navigation = [
  { label: 'Dashboard', to: '/rider', icon: Home01Icon, end: true },
  { label: 'Deliveries', to: '/rider/deliveries', icon: PackageReceive01Icon, end: false },
  { label: 'History', to: '/rider/history', icon: TimeQuarterPassIcon, end: false },
  { label: 'Profile', to: '/rider/profile', icon: UserCircleIcon, end: false },
]

const RiderLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="rider-app">
      <aside className={`rider-sidebar ${menuOpen ? 'is-open' : ''}`}>
        <Link to="/rider" className="rider-brand" onClick={() => setMenuOpen(false)}>
          <img src={Logo} alt="EatWithOyin" />
          <span><strong>EatWithOyin</strong><small>Rider workspace</small></span>
        </Link>
        <nav className="rider-navigation" aria-label="Rider navigation">
          {navigation.map(({ label, to, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setMenuOpen(false)} className={({ isActive }) => `rider-nav-link ${isActive ? 'is-active' : ''}`}>
              <Icon size={19} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="rider-sidebar-footer"><span className="rider-online-dot" /><div><strong>Demo Rider</strong><small>RIDER-001</small></div></div>
      </aside>

      {menuOpen && <button type="button" className="rider-scrim" aria-label="Close rider navigation" onClick={() => setMenuOpen(false)} />}

      <div className="rider-content">
        <header className="rider-topbar">
          <button type="button" className="rider-mobile-menu" aria-label={menuOpen ? 'Close rider navigation' : 'Open rider navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <Cancel01Icon size={22} /> : <Menu11Icon size={22} />}
          </button>
          <div className="rider-breadcrumb"><span>Rider workspace</span><span aria-hidden="true">/</span><strong>{navigation.find((item) => item.to === location.pathname)?.label ?? 'Delivery details'}</strong></div>
          <div className="rider-topbar-actions"><span className="rider-preview-label">Demo mode</span><button type="button" className="rider-signout" disabled title="Rider sign-in is not part of this frontend phase">Sign out</button></div>
        </header>
        <main className="rider-main"><Outlet /></main>
      </div>
    </div>
  )
}

export default RiderLayout