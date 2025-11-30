from fastapi import FastAPI
from fastapi.responses import Response

# Routers
from routers import autores, generos, libros, usuarios, prestamos

# Base de datos
from db.database import Base, engine

# Crear tablas en BD si no existen aún
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API Biblioteca",
    description="Sistema de gestión de biblioteca con FastAPI + SQLAlchemy",
    version="1.0.0"
)

# Registrar routers
app.include_router(autores.router)
app.include_router(generos.router)
app.include_router(libros.router)
app.include_router(usuarios.router)
app.include_router(prestamos.router)


@app.get("/")
def inicio():
    return {"mensaje": "API Biblioteca funcionando correctamente"}


@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)
