import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home/Home'
import Dashboard from './pages/Dashboard/Dashboard'
import BookingPage from './pages/Booking/BookingPage'
import ProfilePage from './pages/Profile/ProfilePage'
import ProductsPage from './pages/Products/ProductsPage'
import NotFound from './pages/NotFound'
import Toast from './components/ui/Toast'
import { useApp } from './context/AppContext'

export default function App() {
  const { toasts } = useApp()

  return (
    <div className="app">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <Toast toasts={toasts} />
    </div>
  )
}
