"""
GlowStudio – Database Configuration
SQLAlchemy + SQLite setup with full schema
"""
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, Text, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

DATABASE_URL = "sqlite:///./glowstudio.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=False
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ─── ORM MODELS ───────────────────────────────────────────────────────────────

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    phone = Column(String(20))
    password_hash = Column(String(255))
    face_shape = Column(String(50))
    skin_tone = Column(String(50))
    hair_type = Column(String(50))
    style_vibe = Column(String(50))
    loyalty_points = Column(Integer, default=0)
    loyalty_tier = Column(String(20), default="Pearl")
    total_visits = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    appointments = relationship("Appointment", back_populates="client")
    loyalty_transactions = relationship("LoyaltyTransaction", back_populates="client")


class Staff(Base):
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    specialties = Column(Text)          # comma-separated
    rating = Column(Float, default=5.0)
    bookings_count = Column(Integer, default=0)
    avatar_initials = Column(String(5))
    bio = Column(Text)
    experience_years = Column(Integer, default=1)
    is_available = Column(Boolean, default=True)

    appointments = relationship("Appointment", back_populates="staff")


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    category = Column(String(80))
    description = Column(Text)
    price = Column(Float, nullable=False)
    duration_minutes = Column(Integer, default=60)
    icon = Column(String(10))
    is_popular = Column(Boolean, default=False)

    appointments = relationship("Appointment", back_populates="service")


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    staff_id = Column(Integer, ForeignKey("staff.id"))
    service_id = Column(Integer, ForeignKey("services.id"))
    appointment_date = Column(String(20))      # ISO date string
    appointment_time = Column(String(10))
    status = Column(String(20), default="confirmed")  # confirmed | in_progress | completed | cancelled
    notes = Column(Text)
    booking_ref = Column(String(20), unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    client = relationship("Client", back_populates="appointments")
    staff = relationship("Staff", back_populates="appointments")
    service = relationship("Service", back_populates="appointments")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    brand = Column(String(100))
    category = Column(String(80))
    price = Column(Float, nullable=False)
    description = Column(Text)
    icon = Column(String(10))
    rating = Column(Float, default=4.5)
    units_sold = Column(Integer, default=0)
    badge = Column(String(30))          # e.g. "Best Seller", "New"
    revenue = Column(Float, default=0.0)


class LoyaltyTransaction(Base):
    __tablename__ = "loyalty_transactions"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    points = Column(Integer, nullable=False)
    reason = Column(String(200))
    created_at = Column(DateTime, default=datetime.utcnow)

    client = relationship("Client", back_populates="loyalty_transactions")


class QueueEntry(Base):
    __tablename__ = "queue_entries"

    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String(100))
    service_name = Column(String(150))
    staff_name = Column(String(100))
    wait_minutes = Column(Integer, default=0)
    status = Column(String(20), default="waiting")   # waiting | in_progress
    position = Column(Integer)
    avatar_initials = Column(String(5))
    created_at = Column(DateTime, default=datetime.utcnow)


class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    reminder_type = Column(String(50))   # email | sms | push
    message = Column(Text)
    sent_count = Column(Integer, default=0)
    open_rate = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    Base.metadata.create_all(bind=engine)
