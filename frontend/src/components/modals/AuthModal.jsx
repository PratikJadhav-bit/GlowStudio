import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import styles from './AuthModal.module.css'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Enter a valid phone number').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function AuthModal({ isOpen, onClose }) {
  const [tab, setTab] = useState('signin')
  const { login, register: registerUser } = useAuth()
  const { addToast } = useApp()

  const {
    register: regLogin,
    handleSubmit: handleLogin,
    formState: { errors: loginErrors, isSubmitting: loginLoading },
    reset: resetLogin,
  } = useForm({ resolver: zodResolver(loginSchema) })

  const {
    register: regSignup,
    handleSubmit: handleSignup,
    formState: { errors: signupErrors, isSubmitting: signupLoading },
    reset: resetSignup,
  } = useForm({ resolver: zodResolver(registerSchema) })

  const onLogin = async (data) => {
    const result = await login(data.email, data.password)
    if (result.success) {
      addToast({ type: 'success', title: 'Welcome back!', message: `Good to see you, ${result.user.name}` })
      onClose()
      resetLogin()
    } else {
      addToast({ type: 'error', title: 'Login Failed', message: result.error })
    }
  }

  const onRegister = async (data) => {
    const result = await registerUser(data)
    if (result.success) {
      addToast({ type: 'success', title: 'Welcome to GlowStudio!', message: `Your account has been created. You earned 250 welcome points!` })
      onClose()
      resetSignup()
    } else {
      addToast({ type: 'error', title: 'Registration Failed', message: result.error })
    }
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => { resetLogin(); resetSignup() }, 300)
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="sm" id="auth-modal">
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'signin' ? styles.tabActive : ''}`}
          onClick={() => setTab('signin')}
        >
          Sign In
        </button>
        <button
          className={`${styles.tab} ${tab === 'signup' ? styles.tabActive : ''}`}
          onClick={() => setTab('signup')}
        >
          Create Account
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'signin' ? (
          <motion.form
            key="signin"
            onSubmit={handleLogin(onLogin)}
            className={styles.form}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.formIntro}>
              <h3>Welcome back</h3>
              <p>Sign in to your GlowStudio account</p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="login-email">Email</label>
              <input id="login-email" type="email" placeholder="you@example.com" {...regLogin('email')} />
              {loginErrors.email && <span className={styles.error}>{loginErrors.email.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="login-pass">Password</label>
              <input id="login-pass" type="password" placeholder="••••••••" {...regLogin('password')} />
              {loginErrors.password && <span className={styles.error}>{loginErrors.password.message}</span>}
            </div>

            <Button variant="rose" fullWidth type="submit" loading={loginLoading}>
              Sign In ✦
            </Button>

            <p className={styles.hint}>
              Don't have an account?{' '}
              <button type="button" className={styles.hintLink} onClick={() => setTab('signup')}>Create one</button>
            </p>
          </motion.form>
        ) : (
          <motion.form
            key="signup"
            onSubmit={handleSignup(onRegister)}
            className={styles.form}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.formIntro}>
              <h3>Join GlowStudio</h3>
              <p>Create your account and earn 250 welcome points</p>
            </div>

            <div className={styles.welcomeBonus}>
              🎁 250 Glow Points as a welcome gift!
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reg-name">Full Name</label>
              <input id="reg-name" type="text" placeholder="Your full name" {...regSignup('name')} />
              {signupErrors.name && <span className={styles.error}>{signupErrors.name.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reg-email">Email</label>
              <input id="reg-email" type="email" placeholder="you@example.com" {...regSignup('email')} />
              {signupErrors.email && <span className={styles.error}>{signupErrors.email.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reg-phone">Phone (Optional)</label>
              <input id="reg-phone" type="tel" placeholder="+1 (555) 000-0000" {...regSignup('phone')} />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reg-pass">Password</label>
              <input id="reg-pass" type="password" placeholder="Create a strong password" {...regSignup('password')} />
              {signupErrors.password && <span className={styles.error}>{signupErrors.password.message}</span>}
            </div>

            <Button variant="rose" fullWidth type="submit" loading={signupLoading}>
              Create Account ✦
            </Button>

            <p className={styles.hint}>
              Already a member?{' '}
              <button type="button" className={styles.hintLink} onClick={() => setTab('signin')}>Sign in</button>
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </Modal>
  )
}
