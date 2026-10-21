// Mock data fallbacks when API is offline
// These are used when the backend is not running

export const MOCK_SERVICES = [
  { id: 1, name: 'Signature Cut & Style', category: 'hair', description: 'Precision haircut tailored to your face shape with a luxury blowout finish.', price: 95, duration_minutes: 75, icon: '✂️', is_popular: true },
  { id: 2, name: 'Balayage Color Treatment', category: 'color', description: 'Hand-painted highlights for a natural, sun-kissed dimensional look.', price: 245, duration_minutes: 180, icon: '🎨', is_popular: true },
  { id: 3, name: 'Keratin Smoothing', category: 'treatment', description: 'Brazilian keratin treatment for frizz-free, silky smooth hair for 3–6 months.', price: 320, duration_minutes: 240, icon: '💎', is_popular: false },
  { id: 4, name: 'Luxury Glow Facial', category: 'skincare', description: 'Hyaluronic acid infusion facial with jade rolling and LED light therapy.', price: 175, duration_minutes: 90, icon: '🌟', is_popular: true },
  { id: 5, name: 'Sculpted Nail Art', category: 'nails', description: 'Bespoke nail art with gel, chrome, or 3D embellishments.', price: 85, duration_minutes: 90, icon: '💅', is_popular: false },
  { id: 6, name: 'Bridal Package', category: 'bridal', description: 'Complete bridal transformation package with trial session included.', price: 550, duration_minutes: 300, icon: '👰', is_popular: true },
  { id: 7, name: "Men's Grooming Package", category: 'grooming', description: 'Classic cut, hot towel shave, beard sculpt, and scalp massage.', price: 120, duration_minutes: 90, icon: '🪒', is_popular: false },
  { id: 8, name: 'Deep Condition & Repair', category: 'treatment', description: 'Intensive protein and moisture treatment to restore damaged hair.', price: 145, duration_minutes: 90, icon: '✨', is_popular: false },
]

export const MOCK_STAFF = [
  { id: 1, name: 'Sophia Laurent', role: 'Master Hair Stylist', specialties: ['Balayage', 'Cut & Style', 'Keratin'], rating: 4.9, bookings_count: 342, avatar_initials: 'SL', experience_years: 12, bio: 'With 12+ years at top Parisian salons, Sophia brings world-class expertise to every client.', is_available: true },
  { id: 2, name: 'Isabella Chen', role: 'Color Specialist & Makeup Artist', specialties: ['Color', 'Highlights', 'Makeup'], rating: 4.8, bookings_count: 287, avatar_initials: 'IC', experience_years: 9, bio: "Isabella's editorial makeup and precision coloring has graced runways from Milan to New York.", is_available: true },
  { id: 3, name: 'Marcus Webb', role: 'Senior Barber & Grooming Expert', specialties: ['Beard', 'Cuts', 'Scalp Treatments'], rating: 4.9, bookings_count: 415, avatar_initials: 'MW', experience_years: 15, bio: "Marcus is Beverly Hills' most sought-after men's grooming specialist with a celebrity clientele.", is_available: true },
  { id: 4, name: 'Priya Sharma', role: 'Nail Artist & Skincare Specialist', specialties: ['Nail Art', 'Facials', 'Waxing'], rating: 4.7, bookings_count: 198, avatar_initials: 'PS', experience_years: 7, bio: "Priya's intricate nail artistry and soothing skincare rituals leave every client glowing.", is_available: true },
]

export const MOCK_PRODUCTS = [
  { id: 1, name: 'Olaplex No.3 Hair Perfector', brand: 'Olaplex', category: 'treatment', price: 28, description: 'Reduces breakage and strengthens hair. A weekly at-home treatment.', icon: '🧴', rating: 4.9, units_sold: 342, badge: 'Best Seller' },
  { id: 2, name: 'Kérastase Elixir Ultime Oil', brand: 'Kérastase', category: 'oil', price: 52, description: 'Sublime beautifying hair oil for brilliant shine and nourishment.', icon: '✨', rating: 4.8, units_sold: 218, badge: 'Luxury Pick' },
  { id: 3, name: 'Moroccanoil Treatment', brand: 'Moroccanoil', category: 'treatment', price: 34, description: 'Argan oil-infused treatment for soft, smooth, frizz-free hair.', icon: '🌿', rating: 4.7, units_sold: 295, badge: 'Staff Fav' },
  { id: 4, name: 'Gloss & Glow Serum', brand: 'GlowStudio Pro', category: 'serum', price: 65, description: 'Our exclusive salon-grade serum for mirror-like glass hair finish.', icon: '💎', rating: 4.9, units_sold: 187, badge: 'Exclusive' },
  { id: 5, name: 'Hyaluronic Moisture Mask', brand: 'SkinLuxe', category: 'skincare', price: 42, description: 'Intense hydration face mask for plump, dewy, luminous skin.', icon: '🌸', rating: 4.6, units_sold: 154, badge: null },
  { id: 6, name: 'Rose Gold Lip Collection', brand: 'GlowStudio Pro', category: 'makeup', price: 38, description: 'Exclusive rose gold lip palette with 12 curated shades.', icon: '💄', rating: 4.8, units_sold: 203, badge: 'New' },
]

export const MOCK_QUEUE = {
  queue: [
    { id: 1, client_name: 'Emma Wilson', service_name: 'Balayage Color Treatment', staff_name: 'Isabella Chen', wait_minutes: 0, status: 'in_progress', position: 1, avatar_initials: 'EW' },
    { id: 2, client_name: 'James Parker', service_name: "Men's Grooming Package", staff_name: 'Marcus Webb', wait_minutes: 0, status: 'in_progress', position: 2, avatar_initials: 'JP' },
    { id: 3, client_name: 'Aisha Rahman', service_name: 'Luxury Glow Facial', staff_name: 'Priya Sharma', wait_minutes: 15, status: 'waiting', position: 3, avatar_initials: 'AR' },
    { id: 4, client_name: 'Sofia Martinez', service_name: 'Signature Cut & Style', staff_name: 'Sophia Laurent', wait_minutes: 28, status: 'waiting', position: 4, avatar_initials: 'SM' },
  ],
  stats: { avg_wait: 12, active_clients: 7, in_queue: 4, available_stylists: 3 }
}

export const MOCK_ANALYTICS = {
  revenue: {
    week: {
      amount: 48290,
      change: 12.4,
      subtitle: 'This week vs last week',
      chart: [
        { day: 'Mon', revenue: 6200, appointments: 14 },
        { day: 'Tue', revenue: 7800, appointments: 18 },
        { day: 'Wed', revenue: 5900, appointments: 13 },
        { day: 'Thu', revenue: 8400, appointments: 19 },
        { day: 'Fri', revenue: 9200, appointments: 22 },
        { day: 'Sat', revenue: 10800, appointments: 26 },
        { day: 'Sun', revenue: 0, appointments: 0 },
      ]
    },
    month: {
      amount: 184650,
      change: 8.7,
      subtitle: 'This month vs last month',
      chart: [
        { day: 'Week 1', revenue: 42100, appointments: 98 },
        { day: 'Week 2', revenue: 48300, appointments: 112 },
        { day: 'Week 3', revenue: 45800, appointments: 106 },
        { day: 'Week 4', revenue: 48450, appointments: 114 },
      ]
    },
    year: {
      amount: 2148000,
      change: 23.5,
      subtitle: 'This year vs last year',
      chart: [
        { day: 'Jan', revenue: 162000 }, { day: 'Feb', revenue: 155000 },
        { day: 'Mar', revenue: 178000 }, { day: 'Apr', revenue: 184000 },
        { day: 'May', revenue: 195000 }, { day: 'Jun', revenue: 188000 },
        { day: 'Jul', revenue: 201000 }, { day: 'Aug', revenue: 196000 },
        { day: 'Sep', revenue: 182000 }, { day: 'Oct', revenue: 175000 },
        { day: 'Nov', revenue: 168000 }, { day: 'Dec', revenue: 164000 },
      ]
    }
  },
  bookings: {
    today: { total: 28, completed: 16, in_progress: 7, cancelled: 2, no_show: 3 },
    donut: [
      { name: 'Completed', value: 16, color: '#5BA88A' },
      { name: 'In Progress', value: 7, color: '#B76E79' },
      { name: 'Cancelled', value: 2, color: '#C4566A' },
      { name: 'No Show', value: 3, color: '#C9A84C' },
    ],
    top_services: [
      { name: 'Balayage Color', bookings: 87, revenue: 21315, pct: 100 },
      { name: 'Signature Cut', bookings: 124, revenue: 11780, pct: 55 },
      { name: 'Keratin Tx', bookings: 42, revenue: 13440, pct: 63 },
      { name: 'Glow Facial', bookings: 68, revenue: 11900, pct: 56 },
      { name: 'Nail Art', bookings: 95, revenue: 8075, pct: 38 },
    ]
  }
}

export const MOCK_LOYALTY_TIERS = [
  { name: 'Pearl', icon: '🤍', min_points: 0, max_points: 999, perks: ['5% off services', 'Birthday bonus', 'Newsletter access'] },
  { name: 'Gold', icon: '💛', min_points: 1000, max_points: 2999, perks: ['10% off services', 'Priority booking', 'Free blowout monthly'] },
  { name: 'Platinum', icon: '🩶', min_points: 3000, max_points: 7999, perks: ['15% off all services', 'Same-day booking', 'Monthly treatment', 'Exclusive products'] },
  { name: 'Diamond', icon: '💎', min_points: 8000, max_points: null, perks: ['20% off everything', 'Dedicated stylist', 'Free monthly service', 'VIP lounge', 'Annual gala invite'] },
]

export const GALLERY_ITEMS = [
  { id: 1, category: 'color', label: 'Rose Gold Balayage', sub: 'Isabella Chen · 3hrs', color: 'linear-gradient(135deg, #f4a9b6, #c97a8a)', emoji: '🎨' },
  { id: 2, category: 'hair', label: 'Precision Bob Cut', sub: 'Sophia Laurent · 90min', color: 'linear-gradient(135deg, #d4a0a7, #8b4f5a)', emoji: '✂️' },
  { id: 3, category: 'makeup', label: 'Glam Evening Look', sub: 'Isabella Chen · 60min', color: 'linear-gradient(135deg, #f5d0d7, #e07d92)', emoji: '💄' },
  { id: 4, category: 'nail', label: 'Marble Nail Art', sub: 'Priya Sharma · 90min', color: 'linear-gradient(135deg, #fae8eb, #ecaab7)', emoji: '💅' },
  { id: 5, category: 'color', label: 'Platinum Blonde', sub: 'Isabella Chen · 4hrs', color: 'linear-gradient(135deg, #e8c97a, #c9a84c)', emoji: '⚡' },
  { id: 6, category: 'hair', label: 'Textured Waves', sub: 'Sophia Laurent · 2hrs', color: 'linear-gradient(135deg, #ecaab7, #b76e79)', emoji: '🌊' },
  { id: 7, category: 'nail', label: 'French Ombré', sub: 'Priya Sharma · 75min', color: 'linear-gradient(135deg, #fdf5f6, #fae8eb)', emoji: '🌸' },
  { id: 8, category: 'makeup', label: 'Bridal Glam', sub: 'Isabella Chen · 2.5hrs', color: 'linear-gradient(135deg, #b76e79, #5e2e3d)', emoji: '👰' },
  { id: 9, category: 'color', label: 'Chocolate Brunette', sub: 'Isabella Chen · 2hrs', color: 'linear-gradient(135deg, #8b4f5a, #4a4440)', emoji: '🍫' },
]

export const VISIT_HISTORY = [
  { date: 'May 18, 2026', service: 'Balayage Color Treatment', stylist: 'Isabella Chen', rating: 5, emoji: '🎨' },
  { date: 'Apr 2, 2026', service: 'Signature Cut & Style', stylist: 'Sophia Laurent', rating: 5, emoji: '✂️' },
  { date: 'Feb 24, 2026', service: 'Luxury Glow Facial', stylist: 'Priya Sharma', rating: 5, emoji: '🌟' },
  { date: 'Jan 10, 2026', service: 'Keratin Smoothing', stylist: 'Sophia Laurent', rating: 4, emoji: '💎' },
  { date: 'Nov 28, 2025', service: 'Sculpted Nail Art', stylist: 'Priya Sharma', rating: 5, emoji: '💅' },
]

export const AI_SUGGESTIONS = [
  { icon: '✂️', title: 'Curtain Bangs', match: '97%', desc: 'Perfectly frames your oval face shape while adding effortless movement to your wavy hair.' },
  { icon: '🎨', title: 'Caramel Balayage', match: '94%', desc: 'Warm caramel tones will beautifully complement your warm medium skin tone and boho style.' },
  { icon: '💎', title: 'Keratin Refresh', match: '91%', desc: 'Time for your 6-month keratin refresh based on your last treatment date.' },
  { icon: '🌸', title: 'Hydration Facial', match: '89%', desc: 'Our hyaluronic acid glow facial is ideal for your skin type and current season.' },
]
