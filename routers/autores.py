from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db                
from models.models import Autor               
from schemas.autor import (AutorCreate, AutorUpdate, AutorResponse)

router = APIRouter(prefix="/autores", tags=["Autores"])


# LISTAR AUTORES 
@router.get("/", response_model=list[AutorResponse])
def listar_autores(db: Session = Depends(get_db)):
    return db.query(Autor).all()


# OBTENER AUTOR 
@router.get("/{id_autor}", response_model=AutorResponse)
def obtener_autor(id_autor: int, db: Session = Depends(get_db)):
    autor = db.query(Autor).filter(Autor.id_autor == id_autor).first()
    if not autor:
        raise HTTPException(status_code=404, detail="Autor no encontrado")
    return autor


# CREAR AUTOR 
@router.post("/", response_model=AutorResponse)
def agregar_autor(data: AutorCreate, db: Session = Depends(get_db)):
    nuevo_autor = Autor(
        nombre=data.nombre,
        nacionalidad=data.nacionalidad
    )
    db.add(nuevo_autor)
    db.commit()
    db.refresh(nuevo_autor)
    return nuevo_autor


# ACTUALIZAR AUTOR
@router.put("/{id_autor}", response_model=AutorResponse)
def actualizar_autor(id_autor: int, data: AutorUpdate, db: Session = Depends(get_db)):
    autor = db.query(Autor).filter(Autor.id_autor == id_autor).first()
    if not autor:
        raise HTTPException(status_code=404, detail="Autor no encontrado")

    autor.nombre = data.nombre
    autor.nacionalidad = data.nacionalidad

    db.commit()
    db.refresh(autor)
    return autor


# ELIMINAR AUTOR
@router.delete("/{id_autor}")
def eliminar_autor(id_autor: int, db: Session = Depends(get_db)):
    autor = db.query(Autor).filter(Autor.id_autor == id_autor).first()
    if not autor:
        raise HTTPException(status_code=404, detail="Autor no encontrado")

    db.delete(autor)
    db.commit()
    return {"mensaje": "Autor eliminado correctamente"}


# BUSCAR POR NOMBRE
@router.get("/buscar/nombre/{nombre}", response_model=list[AutorResponse])
def buscar_por_nombre(nombre: str, db: Session = Depends(get_db)):
    resultado = db.query(Autor).filter(Autor.nombre.ilike(f"%{nombre}%")).all()
    return resultado
