from sqlalchemy import create_engine, String, Text, DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker
from datetime import datetime, timezone
from uuid import uuid4
from .config import DATABASE_URL

class Base(DeclarativeBase): pass

class Enquiry(Base):
    __tablename__ = 'enquiries'
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    name: Mapped[str] = mapped_column(String(120))
    phone: Mapped[str] = mapped_column(String(40))
    email: Mapped[str | None] = mapped_column(String(254))
    area: Mapped[str] = mapped_column(String(160), default='')
    puppy_slug: Mapped[str | None] = mapped_column(String(150))
    message: Mapped[str] = mapped_column(Text, default='')
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

engine = create_engine(DATABASE_URL, pool_pre_ping=True, connect_args={'check_same_thread': False} if DATABASE_URL.startswith('sqlite') else {})
Session = sessionmaker(bind=engine)

def get_db():
    with Session() as db:
        yield db
