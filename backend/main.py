"""
GlowStudio – FastAPI Backend
Production-grade REST API with JWT auth, SQLAlchemy ORM, and AI engine.
"""
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import random
import string

from database import create_tables, get_db, Client, Staff, Service, Appointment, Product, LoyaltyTransaction, QueueEntry, Reminder
from ai_engine import generate_recommendations

# ─── CONFIG ───────────────────────────────────────────────────────────────────
SECRET_KEY = "glowstudio-secret-key-2026-luxury-beauty-tech"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# ─── APP SETUP ────────────────────────────────────────────────────────────────
app = FastAPI(
    title="GlowStudio API",
    description="AI-powered luxury salon & beauty studio backend",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── PYDANTIC SCHEMAS ──────────────────────────────────────────────────────────

class ClientCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    password: str

class ClientUpdate(BaseModel):
    face_shape: Optional[str] = None
    skin_tone: Optional[str] = None
    hair_type: Optional[str] = None
    style_vibe: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    client: dict

class AppointmentCreate(BaseModel):
    client_name: str
    client_phone: str
    service_id: int
    staff_id: int
    appointment_date: str
    appointment_time: str
    notes: Optional[str] = None

class AIRequest(BaseModel):
    face_shape: str
    hair_type: str
    style_vibe: str
    skin_tone: Optional[str] = None

# ─── AUTH HELPERS ─────────────────────────────────────────────────────────────

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def generate_booking_ref() -> str:
    return "GS-" + "".join(random.choices(string.digits, k=6))

# ─── STARTUP ──────────────────────────────────────────────────────────────────

@app.on_event("startup")
def startup():
    create_tables()
    seed_database()

def seed_database():
    """Seed initial data if tables are empty."""
    db = next(get_db())
    try:
        if db.query(Staff).count() == 0:
            _seed_staff(db)
        if db.query(Service).count() == 0:
            _seed_services(db)
        if db.query(Product).count() == 0:
            _seed_products(db)
        if db.query(QueueEntry).count() == 0:
            _seed_queue(db)
        if db.query(Reminder).count() == 0:
            _seed_reminders(db)
    finally:
        db.close()

def _seed_staff(db):
    staff_data = [
        {"name": "Sophia Laurent", "role": "Master Hair Stylist", "specialties": "Balayage,Cut & Style,Keratin", "rating": 4.9, "bookings_count": 342, "avatar_initials": "SL", "experience_years": 12, "bio": "With 12+ years at top Parisian salons, Sophia brings world-class expertise to every client."},
        {"name": "Isabella Chen", "role": "Color Specialist & Makeup Artist", "specialties": "Color,Highlights,Makeup", "rating": 4.8, "bookings_count": 287, "avatar_initials": "IC", "experience_years": 9, "bio": "Isabella's editorial makeup and precision coloring has graced runways from Milan to New York."},
        {"name": "Marcus Webb", "role": "Senior Barber & Grooming Expert", "specialties": "Beard,Cuts,Scalp Treatments", "rating": 4.9, "bookings_count": 415, "avatar_initials": "MW", "experience_years": 15, "bio": "Marcus is Beverly Hills' most sought-after men's grooming specialist with a celebrity clientele."},
        {"name": "Priya Sharma", "role": "Nail Artist & Skincare Specialist", "specialties": "Nail Art,Facials,Waxing", "rating": 4.7, "bookings_count": 198, "avatar_initials": "PS", "experience_years": 7, "bio": "Priya's intricate nail artistry and soothing skincare rituals leave every client glowing."},
    ]
    for s in staff_data:
        db.add(Staff(**s))
    db.commit()

def _seed_services(db):
    services_data = [
        {"name": "Signature Cut & Style", "category": "hair", "description": "Precision haircut tailored to your face shape with a luxury blowout finish.", "price": 95, "duration_minutes": 75, "icon": "✂️", "is_popular": True},
        {"name": "Balayage Color Treatment", "category": "color", "description": "Hand-painted highlights for a natural, sun-kissed dimensional look.", "price": 245, "duration_minutes": 180, "icon": "🎨", "is_popular": True},
        {"name": "Keratin Smoothing Treatment", "category": "treatment", "description": "Brazilian keratin treatment for frizz-free, silky smooth hair for 3–6 months.", "price": 320, "duration_minutes": 240, "icon": "💎"},
        {"name": "Luxury Glow Facial", "category": "skincare", "description": "Hyaluronic acid infusion facial with jade rolling and LED light therapy.", "price": 175, "duration_minutes": 90, "icon": "🌟", "is_popular": True},
        {"name": "Sculpted Nail Art", "category": "nails", "description": "Bespoke nail art with gel, chrome, or 3D embellishments by our nail artist.", "price": 85, "duration_minutes": 90, "icon": "💅"},
        {"name": "Bridal Hair & Makeup", "category": "bridal", "description": "Complete bridal transformation package with trial session included.", "price": 550, "duration_minutes": 300, "icon": "👰"},
        {"name": "Men's Grooming Package", "category": "grooming", "description": "Classic cut, hot towel shave, beard sculpt, and scalp massage.", "price": 120, "duration_minutes": 90, "icon": "🪒"},
        {"name": "Deep Condition & Repair", "category": "treatment", "description": "Intensive protein and moisture treatment to restore damaged hair.", "price": 145, "duration_minutes": 90, "icon": "✨"},
    ]
    for s in services_data:
        db.add(Service(**s))
    db.commit()

def _seed_products(db):
    products_data = [
        {"name": "Olaplex No.3 Hair Perfector", "brand": "Olaplex", "category": "treatment", "price": 28, "description": "Reduces breakage and strengthens hair. A weekly at-home treatment.", "icon": "🧴", "rating": 4.9, "units_sold": 342, "badge": "Best Seller", "revenue": 9576},
        {"name": "Kérastase Elixir Ultime Oil", "brand": "Kérastase", "category": "oil", "price": 52, "description": "Sublime beautifying hair oil for brilliant shine and nourishment.", "icon": "✨", "rating": 4.8, "units_sold": 218, "badge": "Luxury Pick", "revenue": 11336},
        {"name": "Moroccanoil Treatment", "brand": "Moroccanoil", "category": "treatment", "price": 34, "description": "Argan oil-infused treatment for soft, smooth, frizz-free hair.", "icon": "🌿", "rating": 4.7, "units_sold": 295, "badge": "Staff Fav", "revenue": 10030},
        {"name": "Gloss & Glow Serum", "brand": "GlowStudio Pro", "category": "serum", "price": 65, "description": "Our exclusive salon-grade serum for mirror-like glass hair finish.", "icon": "💎", "rating": 4.9, "units_sold": 187, "badge": "Exclusive", "revenue": 12155},
        {"name": "Hyaluronic Moisture Mask", "brand": "SkinLuxe", "category": "skincare", "price": 42, "description": "Intense hydration face mask for plump, dewy, luminous skin.", "icon": "🌸", "rating": 4.6, "units_sold": 154, "revenue": 6468},
        {"name": "Rose Gold Lip Collection", "brand": "GlowStudio Pro", "category": "makeup", "price": 38, "description": "Exclusive rose gold lip palette with 12 curated shades.", "icon": "💄", "rating": 4.8, "units_sold": 203, "badge": "New", "revenue": 7714},
    ]
    for p in products_data:
        db.add(Product(**p))
    db.commit()

def _seed_queue(db):
    queue_data = [
        {"client_name": "Emma Wilson", "service_name": "Balayage Color Treatment", "staff_name": "Isabella Chen", "wait_minutes": 0, "status": "in_progress", "position": 1, "avatar_initials": "EW"},
        {"client_name": "James Parker", "service_name": "Men's Grooming Package", "staff_name": "Marcus Webb", "wait_minutes": 0, "status": "in_progress", "position": 2, "avatar_initials": "JP"},
        {"client_name": "Aisha Rahman", "service_name": "Luxury Glow Facial", "staff_name": "Priya Sharma", "wait_minutes": 15, "status": "waiting", "position": 3, "avatar_initials": "AR"},
        {"client_name": "Sofia Martinez", "service_name": "Signature Cut & Style", "staff_name": "Sophia Laurent", "wait_minutes": 28, "status": "waiting", "position": 4, "avatar_initials": "SM"},
    ]
    for q in queue_data:
        db.add(QueueEntry(**q))
    db.commit()

def _seed_reminders(db):
    reminders_data = [
        {"reminder_type": "email", "message": "Appointment reminder 24hrs before", "sent_count": 1842, "open_rate": 94.2, "is_active": True},
        {"reminder_type": "sms", "message": "Appointment reminder 2hrs before", "sent_count": 1654, "open_rate": 98.1, "is_active": True},
        {"reminder_type": "email", "message": "Rebooking suggestion after 6 weeks", "sent_count": 892, "open_rate": 68.4, "is_active": True},
        {"reminder_type": "push", "message": "Loyalty points milestone notification", "sent_count": 423, "open_rate": 87.3, "is_active": True},
    ]
    for r in reminders_data:
        db.add(Reminder(**r))
    db.commit()

# ─── AUTH ROUTES ──────────────────────────────────────────────────────────────

@app.post("/api/auth/register", response_model=Token, tags=["Auth"])
def register(data: ClientCreate, db: Session = Depends(get_db)):
    if db.query(Client).filter(Client.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    client = Client(
        name=data.name,
        email=data.email,
        phone=data.phone,
        password_hash=get_password_hash(data.password),
        loyalty_points=250,  # Welcome bonus
        loyalty_tier="Pearl"
    )
    db.add(client)
    db.commit()
    db.refresh(client)
    token = create_access_token({"sub": str(client.id), "email": client.email})
    return {"access_token": token, "token_type": "bearer", "client": {"id": client.id, "name": client.name, "email": client.email, "loyalty_points": client.loyalty_points, "loyalty_tier": client.loyalty_tier}}

@app.post("/api/auth/login", response_model=Token, tags=["Auth"])
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.email == form_data.username).first()
    if not client or not verify_password(form_data.password, client.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(client.id), "email": client.email})
    return {"access_token": token, "token_type": "bearer", "client": {"id": client.id, "name": client.name, "email": client.email, "loyalty_points": client.loyalty_points, "loyalty_tier": client.loyalty_tier}}

# ─── SERVICES ────────────────────────────────────────────────────────────────

@app.get("/api/services", tags=["Services"])
def get_services(db: Session = Depends(get_db)):
    services = db.query(Service).all()
    return [{"id": s.id, "name": s.name, "category": s.category, "description": s.description, "price": s.price, "duration_minutes": s.duration_minutes, "icon": s.icon, "is_popular": s.is_popular} for s in services]

# ─── STAFF ───────────────────────────────────────────────────────────────────

@app.get("/api/staff", tags=["Staff"])
def get_staff(db: Session = Depends(get_db)):
    staff = db.query(Staff).all()
    return [{"id": s.id, "name": s.name, "role": s.role, "specialties": s.specialties.split(",") if s.specialties else [], "rating": s.rating, "bookings_count": s.bookings_count, "avatar_initials": s.avatar_initials, "experience_years": s.experience_years, "bio": s.bio, "is_available": s.is_available} for s in staff]

# ─── APPOINTMENTS ─────────────────────────────────────────────────────────────

@app.post("/api/appointments", tags=["Appointments"])
def create_appointment(data: AppointmentCreate, db: Session = Depends(get_db)):
    # Verify service and staff exist
    service = db.query(Service).filter(Service.id == data.service_id).first()
    staff = db.query(Staff).filter(Staff.id == data.staff_id).first()
    if not service or not staff:
        raise HTTPException(status_code=404, detail="Service or staff not found")

    ref = generate_booking_ref()
    appointment = Appointment(
        service_id=data.service_id,
        staff_id=data.staff_id,
        appointment_date=data.appointment_date,
        appointment_time=data.appointment_time,
        notes=data.notes,
        booking_ref=ref,
        status="confirmed"
    )
    db.add(appointment)
    staff.bookings_count += 1
    db.commit()
    db.refresh(appointment)
    return {
        "booking_ref": ref,
        "service": service.name,
        "stylist": staff.name,
        "date": data.appointment_date,
        "time": data.appointment_time,
        "price": service.price,
        "status": "confirmed",
        "message": "Booking confirmed! A reminder will be sent 24hrs before your appointment."
    }

@app.get("/api/appointments", tags=["Appointments"])
def get_appointments(db: Session = Depends(get_db)):
    appointments = db.query(Appointment).order_by(desc(Appointment.created_at)).limit(20).all()
    result = []
    for a in appointments:
        result.append({
            "id": a.id,
            "booking_ref": a.booking_ref,
            "service": a.service.name if a.service else "",
            "stylist": a.staff.name if a.staff else "",
            "date": a.appointment_date,
            "time": a.appointment_time,
            "status": a.status,
            "price": a.service.price if a.service else 0,
        })
    return result

# ─── PRODUCTS ─────────────────────────────────────────────────────────────────

@app.get("/api/products", tags=["Products"])
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).order_by(desc(Product.units_sold)).all()
    return [{"id": p.id, "name": p.name, "brand": p.brand, "category": p.category, "price": p.price, "description": p.description, "icon": p.icon, "rating": p.rating, "units_sold": p.units_sold, "badge": p.badge, "revenue": p.revenue} for p in products]

# ─── AI RECOMMENDATIONS ───────────────────────────────────────────────────────

@app.post("/api/ai/recommend", tags=["AI"])
def ai_recommend(data: AIRequest):
    result = generate_recommendations(
        face_shape=data.face_shape,
        hair_type=data.hair_type,
        style_vibe=data.style_vibe,
        skin_tone=data.skin_tone
    )
    return result

# ─── ANALYTICS ────────────────────────────────────────────────────────────────

@app.get("/api/analytics/revenue", tags=["Analytics"])
def revenue_analytics():
    """Returns mock revenue analytics data for dashboard charts."""
    return {
        "week": {
            "amount": 48290,
            "change": 12.4,
            "subtitle": "This week vs last week",
            "chart": [
                {"day": "Mon", "revenue": 6200, "appointments": 14},
                {"day": "Tue", "revenue": 7800, "appointments": 18},
                {"day": "Wed", "revenue": 5900, "appointments": 13},
                {"day": "Thu", "revenue": 8400, "appointments": 19},
                {"day": "Fri", "revenue": 9200, "appointments": 22},
                {"day": "Sat", "revenue": 10800, "appointments": 26},
                {"day": "Sun", "revenue": 0, "appointments": 0},
            ]
        },
        "month": {
            "amount": 184650,
            "change": 8.7,
            "subtitle": "This month vs last month",
            "chart": [
                {"day": "Week 1", "revenue": 42100, "appointments": 98},
                {"day": "Week 2", "revenue": 48300, "appointments": 112},
                {"day": "Week 3", "revenue": 45800, "appointments": 106},
                {"day": "Week 4", "revenue": 48450, "appointments": 114},
            ]
        },
        "year": {
            "amount": 2148000,
            "change": 23.5,
            "subtitle": "This year vs last year",
            "chart": [
                {"day": "Jan", "revenue": 162000, "appointments": 380},
                {"day": "Feb", "revenue": 155000, "appointments": 362},
                {"day": "Mar", "revenue": 178000, "appointments": 415},
                {"day": "Apr", "revenue": 184000, "appointments": 428},
                {"day": "May", "revenue": 195000, "appointments": 452},
                {"day": "Jun", "revenue": 188000, "appointments": 435},
                {"day": "Jul", "revenue": 201000, "appointments": 468},
                {"day": "Aug", "revenue": 196000, "appointments": 455},
                {"day": "Sep", "revenue": 182000, "appointments": 422},
                {"day": "Oct", "revenue": 175000, "appointments": 405},
                {"day": "Nov", "revenue": 168000, "appointments": 390},
                {"day": "Dec", "revenue": 164000, "appointments": 382},
            ]
        }
    }

@app.get("/api/analytics/bookings", tags=["Analytics"])
def booking_analytics():
    return {
        "today": {"total": 28, "completed": 16, "in_progress": 7, "cancelled": 2, "no_show": 3},
        "donut": [
            {"name": "Completed", "value": 16, "color": "#5BA88A"},
            {"name": "In Progress", "value": 7, "color": "#B76E79"},
            {"name": "Cancelled", "value": 2, "color": "#C4566A"},
            {"name": "No Show", "value": 3, "color": "#C9A84C"},
        ],
        "top_services": [
            {"name": "Balayage Color", "bookings": 87, "revenue": 21315, "pct": 100},
            {"name": "Signature Cut", "bookings": 124, "revenue": 11780, "pct": 55},
            {"name": "Keratin Tx", "bookings": 42, "revenue": 13440, "pct": 63},
            {"name": "Glow Facial", "bookings": 68, "revenue": 11900, "pct": 56},
            {"name": "Nail Art", "bookings": 95, "revenue": 8075, "pct": 38},
        ]
    }

@app.get("/api/analytics/staff-performance", tags=["Analytics"])
def staff_performance(db: Session = Depends(get_db)):
    staff = db.query(Staff).all()
    return [{"id": s.id, "name": s.name, "role": s.role, "bookings": s.bookings_count, "rating": s.rating, "avatar_initials": s.avatar_initials} for s in staff]

# ─── QUEUE ───────────────────────────────────────────────────────────────────

@app.get("/api/queue", tags=["Queue"])
def get_queue(db: Session = Depends(get_db)):
    queue = db.query(QueueEntry).order_by(QueueEntry.position).all()
    return {
        "queue": [{"id": q.id, "client_name": q.client_name, "service_name": q.service_name, "staff_name": q.staff_name, "wait_minutes": q.wait_minutes, "status": q.status, "position": q.position, "avatar_initials": q.avatar_initials} for q in queue],
        "stats": {
            "avg_wait": 12,
            "active_clients": 7,
            "in_queue": len(queue),
            "available_stylists": 3
        }
    }

# ─── LOYALTY ─────────────────────────────────────────────────────────────────

@app.get("/api/loyalty/tiers", tags=["Loyalty"])
def get_loyalty_tiers():
    return {
        "tiers": [
            {"name": "Pearl", "icon": "🤍", "min_points": 0, "max_points": 999, "perks": ["5% off services", "Birthday bonus", "Newsletter access"]},
            {"name": "Gold", "icon": "💛", "min_points": 1000, "max_points": 2999, "perks": ["10% off services", "Priority booking", "Free blowout monthly"]},
            {"name": "Platinum", "icon": "🩶", "min_points": 3000, "max_points": 7999, "perks": ["15% off all services", "Same-day booking", "Monthly treatment", "Exclusive product access"]},
            {"name": "Diamond", "icon": "💎", "min_points": 8000, "max_points": None, "perks": ["20% off everything", "Dedicated stylist", "Free monthly service", "VIP lounge access", "Annual gala invite"]},
        ]
    }

# ─── REMINDERS ────────────────────────────────────────────────────────────────

@app.get("/api/reminders", tags=["Reminders"])
def get_reminders(db: Session = Depends(get_db)):
    reminders = db.query(Reminder).all()
    return [{"id": r.id, "type": r.reminder_type, "message": r.message, "sent_count": r.sent_count, "open_rate": r.open_rate, "is_active": r.is_active} for r in reminders]

# ─── HEALTH ───────────────────────────────────────────────────────────────────

@app.get("/api/health", tags=["System"])
def health_check():
    return {"status": "healthy", "version": "2.0.0", "service": "GlowStudio API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
