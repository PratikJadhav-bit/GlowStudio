import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import styles from './Toast.module.css'

const icons = {
  success: <CheckCircle size={18} />,
  error:   <AlertCircle size={18} />,
  info:    <Info size={18} />,
  warning: <AlertCircle size={18} />,
}

function ToastItem({ toast }) {
  const { removeToast } = useApp()
  return (
    <motion.div
      className={`${styles.toast} ${styles[toast.type || 'info']}`}
      initial={{ x: 120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 120, opacity: 0, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', damping: 20, stiffness: 280 }}
      layout
    >
      <span className={styles.icon}>{icons[toast.type] || icons.info}</span>
      <div className={styles.text}>
        {toast.title && <strong className={styles.title}>{toast.title}</strong>}
        {toast.message && <p className={styles.msg}>{toast.message}</p>}
      </div>
      <button
        className={styles.close}
        onClick={() => removeToast(toast.id)}
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}

export default function Toast({ toasts = [] }) {
  return (
    <div className={styles.container} aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map(t => <ToastItem key={t.id} toast={t} />)}
      </AnimatePresence>
    </div>
  )
}
