import { createContext, useContext, useReducer, useCallback } from 'react'

const AppContext = createContext(null)

const initialState = {
  toasts: [],
  isBookingModalOpen: false,
  isAIModalOpen: false,
  isLoginModalOpen: false,
  bookingStep: 1,
  bookingData: {
    service: null,
    staff: null,
    date: null,
    time: null,
  },
  cart: [],
  queueRefreshKey: 0,
}

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, { id: Date.now(), ...action.payload }] }
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) }
    case 'OPEN_MODAL':
      return { ...state, [`is${action.modal}ModalOpen`]: true }
    case 'CLOSE_MODAL':
      return { ...state, [`is${action.modal}ModalOpen`]: false }
    case 'SET_BOOKING_STEP':
      return { ...state, bookingStep: action.step }
    case 'UPDATE_BOOKING':
      return { ...state, bookingData: { ...state.bookingData, ...action.data } }
    case 'RESET_BOOKING':
      return { ...state, bookingStep: 1, bookingData: initialState.bookingData }
    case 'ADD_TO_CART': {
      const existing = state.cart.find(i => i.id === action.item.id)
      if (existing) {
        return { ...state, cart: state.cart.map(i => i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i) }
      }
      return { ...state, cart: [...state.cart, { ...action.item, qty: 1 }] }
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(i => i.id !== action.id) }
    case 'REFRESH_QUEUE':
      return { ...state, queueRefreshKey: state.queueRefreshKey + 1 }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const addToast = useCallback((toast) => {
    const id = Date.now()
    dispatch({ type: 'ADD_TOAST', payload: { id, ...toast } })
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id }), toast.duration ?? 4000)
  }, [])

  const removeToast = useCallback((id) => {
    dispatch({ type: 'REMOVE_TOAST', id })
  }, [])

  const openModal = useCallback((modal) => {
    dispatch({ type: 'OPEN_MODAL', modal })
  }, [])

  const closeModal = useCallback((modal) => {
    dispatch({ type: 'CLOSE_MODAL', modal })
  }, [])

  const updateBooking = useCallback((data) => {
    dispatch({ type: 'UPDATE_BOOKING', data })
  }, [])

  const setBookingStep = useCallback((step) => {
    dispatch({ type: 'SET_BOOKING_STEP', step })
  }, [])

  const resetBooking = useCallback(() => {
    dispatch({ type: 'RESET_BOOKING' })
  }, [])

  const addToCart = useCallback((item) => {
    dispatch({ type: 'ADD_TO_CART', item })
    addToast({ type: 'success', title: 'Added to Cart', message: `${item.name} added successfully` })
  }, [addToast])

  const removeFromCart = useCallback((id) => {
    dispatch({ type: 'REMOVE_FROM_CART', id })
  }, [])

  const value = {
    ...state,
    addToast,
    removeToast,
    openModal,
    closeModal,
    updateBooking,
    setBookingStep,
    resetBooking,
    addToCart,
    removeFromCart,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
