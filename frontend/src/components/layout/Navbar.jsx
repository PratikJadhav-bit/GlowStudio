import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingBag, User, Sparkles } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'
import AuthModal from '../modals/AuthModal'
import BookingModal from '../modals/BookingModal'
import AIModal from '../modals/AIModal'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { to: '/', label: 'Home', exact: true },
  { to: '/#services', label: 'Services' },
  { to: '/products', label: 'Products' },
  { to: '/#stylists', label: 'Stylists' },
  { to: '/#gallery', label: 'Gallery' },
  { to: '/#loyalty', label: 'VIP' },
  { to: '/dashboard', label: 'Dashboard' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { cart, isBookingModalOpen, isAIModalOpen, isLoginModalOpen, openModal, closeModal } = useApp()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  const handleHashLink = (e, href) => {
    if (href.startsWith('/#')) {
      e.preventDefault()
      const id = href.slice(2)
      if (window.location.pathname !== '/') {
        navigate('/')
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300)
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }
      setMobileOpen(false)
    }
  }

  return (
    <>
      <motion.header
        className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      >
        <div className={styles.inner}>
          {/* Logo */}
          <Link to="/" className={styles.logo} aria-label="GlowStudio Home">
            <span className={styles.logoIcon}>✦</span>
            <span className={styles.logoText}>GlowStudio</span>
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.navLinks} aria-label="Main navigation">
            {NAV_LINKS.map(({ to, label }) => (
              <a
                key={to}
                href={to}
                className={styles.navLink}
                onClick={(e) => handleHashLink(e, to)}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              className={styles.iconBtn}
              onClick={() => openModal('AI')}
              aria-label="AI Stylist"
              title="Try AI Stylist"
            >
              <Sparkles size={18} />
            </button>

            {cartCount > 0 && (
              <button
                className={styles.iconBtn}
                onClick={() => navigate('/products')}
                aria-label={`Cart (${cartCount} items)`}
              >
                <ShoppingBag size={18} />
                <span className={styles.cartBadge}>{cartCount}</span>
              </button>
            )}

            {user ? (
              <div className={styles.userMenu}>
                <button className={styles.avatarBtn} onClick={() => navigate('/profile')}>
                  <div className={styles.avatar}>{user.name?.slice(0,2).toUpperCase()}</div>
                </button>
                <div className={styles.userDropdown}>
                  <p className={styles.userName}>{user.name}</p>
                  <p className={styles.userTier}>✦ {user.loyalty_tier} Member</p>
                  <Link to="/profile" className={styles.dropLink}>My Profile</Link>
                  <Link to="/dashboard" className={styles.dropLink}>Dashboard</Link>
                  <button className={styles.dropLink} onClick={logout} style={{color:'var(--danger)'}}>Sign Out</button>
                </div>
              </div>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => openModal('Login')}>
                <User size={15} /> Sign In
              </Button>
            )}

            <Button
              variant="rose"
              size="sm"
              onClick={() => openModal('Booking')}
            >
              Book Now
            </Button>

            {/* Hamburger */}
            <button
              className={styles.hamburger}
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className={styles.mobileMenu}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              {NAV_LINKS.map(({ to, label }) => (
                <a
                  key={to}
                  href={to}
                  className={styles.mobileLink}
                  onClick={(e) => { handleHashLink(e, to); setMobileOpen(false) }}
                >
                  {label}
                </a>
              ))}
              <div className={styles.mobileBtns}>
                <Button variant="rose" fullWidth onClick={() => { openModal('Booking'); setMobileOpen(false) }}>
                  Book Appointment
                </Button>
                <Button variant="ghost" fullWidth onClick={() => { openModal('AI'); setMobileOpen(false) }}>
                  <Sparkles size={16} /> Try AI Stylist
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Modals */}
      <BookingModal isOpen={isBookingModalOpen} onClose={() => closeModal('Booking')} />
      <AIModal isOpen={isAIModalOpen} onClose={() => closeModal('AI')} />
      <AuthModal isOpen={isLoginModalOpen} onClose={() => closeModal('Login')} />
    </>
  )
}
