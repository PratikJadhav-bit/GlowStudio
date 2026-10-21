import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RotateCcw } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { useApp } from '../../context/AppContext'
import { aiAPI } from '../../services/api'
import styles from './AIModal.module.css'

const FACE_OPTIONS = [
  { value: 'Oval', label: 'Oval', emoji: '🥚' },
  { value: 'Round', label: 'Round', emoji: '⭕' },
  { value: 'Square', label: 'Square', emoji: '⬜' },
  { value: 'Heart', label: 'Heart', emoji: '❤️' },
  { value: 'Diamond', label: 'Diamond', emoji: '💎' },
]

const HAIR_OPTIONS = [
  { value: 'Straight', label: 'Straight', emoji: '➖' },
  { value: 'Wavy', label: 'Wavy', emoji: '〰️' },
  { value: 'Curly', label: 'Curly', emoji: '🌀' },
  { value: 'Coily', label: 'Coily', emoji: '🔁' },
]

const STYLE_OPTIONS = [
  { value: 'Classic', label: 'Classic', emoji: '🎩' },
  { value: 'Boho', label: 'Boho', emoji: '🌸' },
  { value: 'Edgy', label: 'Edgy', emoji: '⚡' },
  { value: 'Romantic', label: 'Romantic', emoji: '🌹' },
]

function OptionGrid({ options, value, onChange }) {
  return (
    <div className={styles.optionGrid}>
      {options.map(opt => (
        <motion.button
          key={opt.value}
          className={`${styles.option} ${value === opt.value ? styles.optionSel : ''}`}
          onClick={() => onChange(opt.value)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className={styles.optEmoji}>{opt.emoji}</span>
          <span className={styles.optLabel}>{opt.label}</span>
        </motion.button>
      ))}
    </div>
  )
}

export default function AIModal({ isOpen, onClose }) {
  const { openModal, closeModal, addToast } = useApp()
  const [face, setFace] = useState(null)
  const [hair, setHair] = useState(null)
  const [style, setStyle] = useState(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

  const handleGenerate = async () => {
    if (!face || !hair || !style) {
      addToast({ type: 'warning', title: 'Complete Profile', message: 'Please select all options to continue' })
      return
    }
    setLoading(true)
    try {
      const res = await aiAPI.recommend({ face_shape: face, hair_type: hair, style_vibe: style })
      setResults(res.data)
    } catch {
      // Fallback mock results
      setResults({
        recommendations: [
          { title: 'Soft Layers with Face-Framing Pieces', category: 'hairstyle', icon: '✂️', confidence: 97, desc: `Your ${face} face shape is perfect for soft layers with face-framing highlights that enhance your natural symmetry.`, service: 'Signature Cut & Style', stylist_match: 'Sophia Laurent' },
          { title: 'Balayage Caramel Highlights', category: 'color', icon: '🎨', confidence: 94, desc: `Warm caramel balayage will complement your ${style} style vibe and add beautiful dimensional depth.`, service: 'Balayage Color Treatment', stylist_match: 'Isabella Chen' },
          { title: `${hair} Hair Enhancement`, category: 'treatment', icon: '💎', confidence: 93, desc: `Our specialist ${hair} hair treatment will enhance your natural texture and boost shine and health.`, service: 'Deep Condition & Repair', stylist_match: 'Sophia Laurent' },
        ],
        profile_summary: { face_shape: face, hair_type: hair, style_vibe: style, match_score: 95 },
        suggested_products: [
          { name: 'Olaplex No.3 Hair Perfector', icon: '🧴', price: 28 },
          { name: 'Kérastase Elixir Ultime Oil', icon: '✨', price: 52 },
        ],
        top_stylist: 'Sophia Laurent',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFace(null)
    setHair(null)
    setStyle(null)
    setResults(null)
  }

  const handleBookRecommended = () => {
    onClose()
    setTimeout(() => openModal('Booking'), 200)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" id="ai-modal">
      <div className={styles.header}>
        <div className={styles.headerIcon}>✦</div>
        <h2 className={styles.headerTitle}>GlowAI™ Stylist</h2>
        <p className={styles.headerSub}>Your personalized AI beauty advisor</p>
      </div>

      <AnimatePresence mode="wait">
        {!results ? (
          <motion.div key="quiz" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            <div className={styles.section}>
              <label className={styles.qLabel}>What is your face shape?</label>
              <OptionGrid options={FACE_OPTIONS} value={face} onChange={setFace} />
            </div>
            <div className={styles.section}>
              <label className={styles.qLabel}>Your current hair type?</label>
              <OptionGrid options={HAIR_OPTIONS} value={hair} onChange={setHair} />
            </div>
            <div className={styles.section}>
              <label className={styles.qLabel}>Your style vibe?</label>
              <OptionGrid options={STYLE_OPTIONS} value={style} onChange={setStyle} />
            </div>
            <Button
              variant="rose"
              fullWidth
              onClick={handleGenerate}
              loading={loading}
              disabled={!face || !hair || !style}
              icon={!loading && <Sparkles size={16} />}
            >
              Generate My Beauty Profile
            </Button>
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Profile Score */}
            <div className={styles.scoreCard}>
              <div className={styles.scoreCircle}>
                <span className={styles.scoreNum}>{results.profile_summary.match_score}</span>
                <span className={styles.scorePct}>%</span>
              </div>
              <div>
                <div className={styles.scoreLabel}>Profile Match Score</div>
                <div className={styles.scoreSub}>{face} · {hair} · {style}</div>
              </div>
            </div>

            {/* Recommendations */}
            <div className={styles.recList}>
              {results.recommendations?.map((rec, i) => (
                <motion.div
                  key={i}
                  className={styles.recCard}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className={styles.recIcon}>{rec.icon}</div>
                  <div className={styles.recBody}>
                    <div className={styles.recHeader}>
                      <span className={styles.recTitle}>{rec.title}</span>
                      <span className={styles.recConf}>{rec.confidence}% match</span>
                    </div>
                    <p className={styles.recDesc}>{rec.desc}</p>
                    <div className={styles.recMeta}>
                      <span>✦ {rec.service}</span>
                      <span>👤 {rec.stylist_match}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Suggested Products */}
            {results.suggested_products?.length > 0 && (
              <div className={styles.products}>
                <h4 className={styles.productsTitle}>Recommended Products</h4>
                <div className={styles.productsList}>
                  {results.suggested_products.map((p, i) => (
                    <div key={i} className={styles.productChip}>
                      <span>{p.icon}</span>
                      <span>{p.name}</span>
                      <span className={styles.productPrice}>${p.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.resultActions}>
              <Button variant="ghost" onClick={handleReset} icon={<RotateCcw size={15}/>}>Start Over</Button>
              <Button variant="rose" onClick={handleBookRecommended}>Book Recommended Service →</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  )
}
