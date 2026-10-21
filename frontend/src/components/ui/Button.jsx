import { motion } from 'framer-motion'
import styles from './Button.module.css'

const variants = {
  rose: styles.rose,
  'rose-outline': styles.roseOutline,
  ghost: styles.ghost,
  dark: styles.dark,
  gold: styles.gold,
}

const sizes = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  xl: styles.xl,
}

export default function Button({
  children,
  variant = 'rose',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  iconRight,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <motion.button
      type={type}
      className={[
        styles.btn,
        variants[variant] || styles.rose,
        sizes[size] || styles.md,
        fullWidth ? styles.fullWidth : '',
        loading ? styles.loading : '',
        disabled ? styles.disabled : '',
        className,
      ].join(' ')}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {!loading && icon && <span className={styles.iconLeft}>{icon}</span>}
      <span>{children}</span>
      {!loading && iconRight && <span className={styles.iconRight}>{iconRight}</span>}
    </motion.button>
  )
}
