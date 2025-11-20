from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

databaseUrl = "sqlite:///./biblioteca.db"

engine = create_engine(
    databaseUrl,
    echo=True,          # ACTIVAR LOGS SQL
    connect_args={"check_same_thread": False}  # NECESARIO PARA SQLite
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


# Dependencia para obtener una sesión DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
