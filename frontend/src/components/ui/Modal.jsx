import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import styles from './Modal.module.css'

export default function Modal({ isOpen, onClose, title, subtitle, children, size = 'md', id }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleBackdrop = useCallback((e) => {
    if (e.target === e.currentTarget) onClose()
  }, [onClose])

  const sizeClass = { sm: styles.sm, md: styles.md, lg: styles.lg, xl: styles.xl }[size] || styles.md

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          onClick={handleBackdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          id={id}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            className={`${styles.box} ${sizeClass}`}
            initial={{ scale: 0.92, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 16, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {(title || subtitle) && (
              <div className={styles.header}>
                {title && <h2 className={styles.title}>{title}</h2>}
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
              </div>
            )}

            <div className={styles.content}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
