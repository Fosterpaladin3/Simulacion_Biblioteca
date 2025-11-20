from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db
from models.models import Genero
from schemas.genero import GeneroCreate, GeneroUpdate, GeneroResponse

router = APIRouter(prefix="/generos", tags=["Géneros"])


# LISTAR GENEROS
@router.get("/", response_model=list[GeneroResponse])
def listar_generos(db: Session = Depends(get_db)):
    return db.query(Genero).all()


# OBTENER GENERO
@router.get("/{id_genero}", response_model=GeneroResponse)
def obtener_genero(id_genero: int, db: Session = Depends(get_db)):
    genero = db.query(Genero).filter(Genero.id_genero == id_genero).first()
    if not genero:
        raise HTTPException(status_code=404, detail="Género no encontrado")
    return genero


# CREAR GENERO
@router.post("/", response_model=GeneroResponse)
def agregar_genero(data: GeneroCreate, db: Session = Depends(get_db)):
    nuevo_genero = Genero(
        nombre_genero=data.nombre_genero,
        descripcion=data.descripcion
    )
    db.add(nuevo_genero)
    db.commit()
    db.refresh(nuevo_genero)
    return nuevo_genero


# ACTUALIZAR GENERO
@router.put("/{id_genero}", response_model=GeneroResponse)
def actualizar_genero(id_genero: int, data: GeneroUpdate, db: Session = Depends(get_db)):
    genero = db.query(Genero).filter(Genero.id_genero == id_genero).first()
    if not genero:
        raise HTTPException(status_code=404, detail="Género no encontrado")

    genero.nombre_genero = data.nombre_genero
    genero.descripcion = data.descripcion

    db.commit()
    db.refresh(genero)
    return genero


# ELIMINAR GENERO
@router.delete("/{id_genero}")
def eliminar_genero(id_genero: int, db: Session = Depends(get_db)):
    genero = db.query(Genero).filter(Genero.id_genero == id_genero).first()
    if not genero:
        raise HTTPException(status_code=404, detail="Género no encontrado")

    db.delete(genero)
    db.commit()
    return {"mensaje": "Género eliminado correctamente"}


# BUSCAR POR NOMBRE
@router.get("/buscar/nombre/{nombre}", response_model=list[GeneroResponse])
def buscar_genero(nombre: str, db: Session = Depends(get_db)):
    return db.query(Genero).filter(Genero.nombre_genero.ilike(f"%{nombre}%")).all()
