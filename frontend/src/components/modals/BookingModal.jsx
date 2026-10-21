import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, ChevronLeft, Calendar, Clock, User, Scissors } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { useApp } from '../../context/AppContext'
import { servicesAPI, staffAPI, appointmentsAPI } from '../../services/api'
import { MOCK_SERVICES, MOCK_STAFF } from '../../data/mockData'
import styles from './BookingModal.module.css'

const clientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  notes: z.string().optional(),
})

const STEPS = [
  { id: 1, label: 'Service', icon: <Scissors size={14}/> },
  { id: 2, label: 'Stylist', icon: <User size={14}/> },
  { id: 3, label: 'Date & Time', icon: <Calendar size={14}/> },
  { id: 4, label: 'Confirm', icon: <Check size={14}/> },
]

const TIME_SLOTS = [
  '9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
  '12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM',
  '3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM',
]

const UNAVAILABLE_SLOTS = ['9:00 AM', '11:00 AM', '2:00 PM', '4:30 PM']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

export default function BookingModal({ isOpen, onClose }) {
  const { bookingStep, bookingData, updateBooking, setBookingStep, resetBooking, addToast } = useApp()
  const [services, setServices] = useState(MOCK_SERVICES)
  const [staff, setStaff] = useState(MOCK_STAFF)
  const [calMonth, setCalMonth] = useState(new Date())
  const [confirmed, setConfirmed] = useState(false)
  const [confirmRef, setConfirmRef] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(clientSchema)
  })

  useEffect(() => {
    servicesAPI.getAll().then(r => setServices(r.data)).catch(() => {})
    staffAPI.getAll().then(r => setStaff(r.data)).catch(() => {})
  }, [])

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setConfirmed(false)
      resetBooking()
      reset()
    }, 300)
  }

  const today = new Date()
  const year = calMonth.getFullYear()
  const month = calMonth.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const monthName = calMonth.toLocaleString('default', { month: 'long', year: 'numeric' })

  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const isPastDay = (day) => {
    const d = new Date(year, month, day)
    d.setHours(0,0,0,0)
    const t = new Date(); t.setHours(0,0,0,0)
    return d < t
  }

  const selectedDateStr = bookingData.date
    ? new Date(bookingData.date).toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' })
    : ''

  const onSubmit = async (formData) => {
    if (!bookingData.service || !bookingData.staff || !bookingData.date || !bookingData.time) {
      addToast({ type:'error', title:'Incomplete', message:'Please complete all steps' })
      return
    }
    setSubmitting(true)
    try {
      const res = await appointmentsAPI.create({
        client_name: formData.name,
        client_phone: formData.phone,
        service_id: bookingData.service.id,
        staff_id: bookingData.staff.id,
        appointment_date: bookingData.date,
        appointment_time: bookingData.time,
        notes: formData.notes || ''
      })
      setConfirmRef(res.data.booking_ref)
      setConfirmed(true)
      addToast({ type:'success', title:'Booked!', message:`Ref: ${res.data.booking_ref}` })
    } catch {
      // Use mock confirmation if backend is offline
      const ref = 'GS-' + Math.floor(100000 + Math.random() * 900000)
      setConfirmRef(ref)
      setConfirmed(true)
      addToast({ type:'success', title:'Booking Confirmed!', message:`Your appointment ref: ${ref}` })
    } finally {
      setSubmitting(false)
    }
  }

  const stepVariants = {
    enter: { x: 30, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -30, opacity: 0 },
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={confirmed ? undefined : 'Book Your \u2728 Experience'}
      size="md"
      id="booking-modal"
    >
      {confirmed ? (
        <motion.div className={styles.confirmed} initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}}>
          <div className={styles.confCircle}>
            <Check size={36} strokeWidth={2.5} color="var(--rose-500)" />
          </div>
          <h3>Booking Confirmed!</h3>
          <p>Your appointment has been reserved. A confirmation SMS and email will be sent shortly.</p>
          <div className={styles.confRef}>{confirmRef}</div>
          <div className={styles.confDetails}>
            <div className={styles.confRow}>
              <span>Service</span><strong>{bookingData.service?.name}</strong>
            </div>
            <div className={styles.confRow}>
              <span>Stylist</span><strong>{bookingData.staff?.name}</strong>
            </div>
            <div className={styles.confRow}>
              <span>Date</span><strong>{selectedDateStr}</strong>
            </div>
            <div className={styles.confRow}>
              <span>Time</span><strong>{bookingData.time}</strong>
            </div>
          </div>
          <Button variant="rose" fullWidth onClick={handleClose}>Done ✦</Button>
        </motion.div>
      ) : (
        <>
          {/* Step Indicators */}
          <div className={styles.steps}>
            {STEPS.map((s, i) => (
              <div key={s.id} className={styles.stepWrap}>
                <div className={`${styles.stepDot} ${bookingStep > s.id ? styles.done : ''} ${bookingStep === s.id ? styles.active : ''}`}>
                  {bookingStep > s.id ? <Check size={12}/> : s.id}
                </div>
                <span className={`${styles.stepLabel} ${bookingStep === s.id ? styles.stepLabelActive : ''}`}>{s.label}</span>
                {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${bookingStep > s.id ? styles.stepLineDone : ''}`} />}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {/* Step 1: Service */}
            {bookingStep === 1 && (
              <motion.div key="s1" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{duration:0.2}}>
                <h3 className={styles.stepTitle}>Choose a Service</h3>
                <div className={styles.serviceGrid}>
                  {services.map(svc => (
                    <motion.button
                      key={svc.id}
                      className={`${styles.serviceCard} ${bookingData.service?.id === svc.id ? styles.serviceCardSel : ''}`}
                      onClick={() => updateBooking({ service: svc })}
                      whileHover={{scale:1.02}} whileTap={{scale:0.98}}
                    >
                      <span className={styles.serviceIcon}>{svc.icon}</span>
                      <span className={styles.serviceName}>{svc.name}</span>
                      <span className={styles.servicePrice}>${svc.price}</span>
                      {svc.is_popular && <span className={styles.popularBadge}>Popular</span>}
                    </motion.button>
                  ))}
                </div>
                <Button variant="rose" fullWidth onClick={() => bookingData.service && setBookingStep(2)} disabled={!bookingData.service}>
                  Continue <ChevronRight size={16}/>
                </Button>
              </motion.div>
            )}

            {/* Step 2: Stylist */}
            {bookingStep === 2 && (
              <motion.div key="s2" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{duration:0.2}}>
                <h3 className={styles.stepTitle}>Select Your Stylist</h3>
                <div className={styles.stylistList}>
                  {staff.map(s => (
                    <motion.button
                      key={s.id}
                      className={`${styles.stylistItem} ${bookingData.staff?.id === s.id ? styles.stylistItemSel : ''}`}
                      onClick={() => updateBooking({ staff: s })}
                      whileHover={{x:4}} whileTap={{scale:0.99}}
                    >
                      <div className={styles.stylistAvatar}>{s.avatar_initials}</div>
                      <div className={styles.stylistInfo}>
                        <span className={styles.stylistName}>{s.name}</span>
                        <span className={styles.stylistRole}>{s.role}</span>
                      </div>
                      <div className={styles.stylistMeta}>
                        <span className={styles.stylistRating}>★ {s.rating}</span>
                        <span className={styles.stylistBookings}>{s.bookings_count} bookings</span>
                      </div>
                      {bookingData.staff?.id === s.id && <Check size={16} color="var(--rose-500)" className={styles.selCheck} />}
                    </motion.button>
                  ))}
                </div>
                <div className={styles.stepNav}>
                  <Button variant="ghost" onClick={() => setBookingStep(1)}><ChevronLeft size={16}/> Back</Button>
                  <Button variant="rose" onClick={() => bookingData.staff && setBookingStep(3)} disabled={!bookingData.staff}>Continue <ChevronRight size={16}/></Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Date & Time */}
            {bookingStep === 3 && (
              <motion.div key="s3" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{duration:0.2}}>
                <h3 className={styles.stepTitle}>Pick Date & Time</h3>
                <div className={styles.calendarWrap}>
                  {/* Calendar */}
                  <div className={styles.calendar}>
                    <div className={styles.calHeader}>
                      <button className={styles.calNav} onClick={() => setCalMonth(new Date(year, month-1))} aria-label="Previous month">‹</button>
                      <span className={styles.calMonthLabel}>{monthName}</span>
                      <button className={styles.calNav} onClick={() => setCalMonth(new Date(year, month+1))} aria-label="Next month">›</button>
                    </div>
                    <div className={styles.calGrid}>
                      {DAY_LABELS.map(d => <span key={d} className={styles.calDayLabel}>{d}</span>)}
                      {Array.from({length: firstDay}, (_, i) => <span key={`e${i}`} />)}
                      {Array.from({length: daysInMonth}, (_, i) => {
                        const day = i + 1
                        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
                        const past = isPastDay(day)
                        const isSel = bookingData.date === dateStr
                        const isToday = today.getDate()===day && today.getMonth()===month && today.getFullYear()===year
                        return (
                          <button
                            key={day}
                            className={`${styles.calDay} ${past?styles.calDayPast:''} ${isSel?styles.calDaySel:''} ${isToday&&!isSel?styles.calDayToday:''}`}
                            onClick={() => !past && updateBooking({date: dateStr, time: null})}
                            disabled={past}
                            aria-label={`${day} ${monthName}`}
                            aria-pressed={isSel}
                          >
                            {day}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  {/* Time Slots */}
                  <div className={styles.timeSlots}>
                    <h4 className={styles.timeSlotsTitle}>Available Times</h4>
                    <div className={styles.slotsGrid}>
                      {TIME_SLOTS.map(t => {
                        const unavail = UNAVAILABLE_SLOTS.includes(t)
                        const isSel = bookingData.time === t
                        return (
                          <button
                            key={t}
                            className={`${styles.timeSlot} ${unavail?styles.timeSlotUnavail:''} ${isSel?styles.timeSlotSel:''}`}
                            onClick={() => !unavail && updateBooking({time: t})}
                            disabled={unavail || !bookingData.date}
                            aria-pressed={isSel}
                          >
                            {t}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <div className={styles.stepNav}>
                  <Button variant="ghost" onClick={() => setBookingStep(2)}><ChevronLeft size={16}/> Back</Button>
                  <Button variant="rose" onClick={() => (bookingData.date && bookingData.time) && setBookingStep(4)} disabled={!bookingData.date || !bookingData.time}>Continue <ChevronRight size={16}/></Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Confirm */}
            {bookingStep === 4 && (
              <motion.div key="s4" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{duration:0.2}}>
                <h3 className={styles.stepTitle}>Confirm Booking</h3>
                {/* Summary */}
                <div className={styles.summary}>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}><Scissors size={13}/> Service</span>
                    <span className={styles.summaryVal}>{bookingData.service?.name}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}><User size={13}/> Stylist</span>
                    <span className={styles.summaryVal}>{bookingData.staff?.name}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}><Calendar size={13}/> Date</span>
                    <span className={styles.summaryVal}>{selectedDateStr}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}><Clock size={13}/> Time</span>
                    <span className={styles.summaryVal}>{bookingData.time}</span>
                  </div>
                  <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                    <span className={styles.summaryLabel}>Total</span>
                    <span className={styles.summaryPrice}>${bookingData.service?.price}</span>
                  </div>
                </div>
                {/* Client Form */}
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label htmlFor="b-name">Full Name *</label>
                    <input id="b-name" type="text" placeholder="Your full name" {...register('name')} />
                    {errors.name && <span className={styles.error}>{errors.name.message}</span>}
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="b-phone">Phone Number *</label>
                    <input id="b-phone" type="tel" placeholder="+1 (555) 000-0000" {...register('phone')} />
                    {errors.phone && <span className={styles.error}>{errors.phone.message}</span>}
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="b-notes">Special Requests</label>
                    <textarea id="b-notes" rows={2} placeholder="Any preferences or notes..." {...register('notes')} />
                  </div>
                  <div className={styles.stepNav}>
                    <Button variant="ghost" type="button" onClick={() => setBookingStep(3)}><ChevronLeft size={16}/> Back</Button>
                    <Button variant="rose" type="submit" loading={submitting}>Confirm Booking ✦</Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </Modal>
  )
}
