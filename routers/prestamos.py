from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from db.database import get_db
from models.models import Prestamo, Usuario, Libro
from schemas.prestamo import PrestamoCreate, PrestamoUpdate, PrestamoResponse

router = APIRouter(prefix="/prestamos", tags=["Préstamos"])

# LISTAR
@router.get("/", response_model=list[PrestamoResponse])
def listar_prestamos(db: Session = Depends(get_db)):
    return db.query(Prestamo).all()


# OBTENER
@router.get("/{id_prestamo}", response_model=PrestamoResponse)
def obtener_prestamo(id_prestamo: int, db: Session = Depends(get_db)):
    prestamo = db.query(Prestamo).filter(Prestamo.id_prestamo == id_prestamo).first()
    if not prestamo:
        raise HTTPException(status_code=404, detail="Préstamo no encontrado")
    return prestamo


# CREAR
@router.post("/", response_model=PrestamoResponse)
def crear_prestamo(data: PrestamoCreate, db: Session = Depends(get_db)):
    
    # Validar usuario
    usuario = db.query(Usuario).filter(Usuario.id_usuario == data.id_usuario).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="El usuario no existe")

    # Validar libro
    libro = db.query(Libro).filter(Libro.id_libro == data.id_libro).first()
    if not libro:
        raise HTTPException(status_code=404, detail="El libro no existe")

    if not libro.disponible:
        raise HTTPException(status_code=400, detail="El libro NO está disponible")

    # Crear préstamo
    nuevo_prestamo = Prestamo(
        id_usuario=data.id_usuario,
        id_libro=data.id_libro,
        fecha_prestamo=data.fecha_prestamo,
        fecha_devolucion=data.fecha_devolucion,
        estado="PRESTADO"
    )

    # Cambiar disponibilidad del libro
    libro.disponible = False

    db.add(nuevo_prestamo)
    db.commit()
    db.refresh(nuevo_prestamo)
    return nuevo_prestamo


# ACTUALIZAR
@router.put("/{id_prestamo}", response_model=PrestamoResponse)
def actualizar_prestamo(id_prestamo: int, data: PrestamoUpdate, db: Session = Depends(get_db)):
    prestamo = db.query(Prestamo).filter(Prestamo.id_prestamo == id_prestamo).first()
    
    if not prestamo:
        raise HTTPException(status_code=404, detail="Préstamo no encontrado")

    prestamo.id_usuario = data.id_usuario
    prestamo.id_libro = data.id_libro
    prestamo.fecha_prestamo = data.fecha_prestamo
    prestamo.fecha_devolucion = data.fecha_devolucion
    prestamo.estado = data.estado

    db.commit()
    db.refresh(prestamo)
    return prestamo


# ELIMINAR
@router.delete("/{id_prestamo}")
def eliminar_prestamo(id_prestamo: int, db: Session = Depends(get_db)):
    prestamo = db.query(Prestamo).filter(Prestamo.id_prestamo == id_prestamo).first()

    if not prestamo:
        raise HTTPException(status_code=404, detail="Préstamo no encontrado")

    # Cambiar disponibilidad del libro
    libro = db.query(Libro).filter(Libro.id_libro == prestamo.id_libro).first()
    if libro:
        libro.disponible = True

    db.delete(prestamo)
    db.commit()

    return {"mensaje": "Préstamo eliminado correctamente"}


# DEVOLVER
@router.post("/{id_prestamo}/devolver")
def devolver_prestamo(id_prestamo: int, db: Session = Depends(get_db)):
    prestamo = db.query(Prestamo).filter(Prestamo.id_prestamo == id_prestamo).first()

    if not prestamo:
        raise HTTPException(status_code=404, detail="Préstamo no encontrado")

    # Cambiar estado del préstamo
    prestamo.estado = "DEVUELTO"
    prestamo.fecha_devolucion = date.today()

    # Cambiar disponibilidad del libro
    libro = db.query(Libro).filter(Libro.id_libro == prestamo.id_libro).first()
    if libro:
        libro.disponible = True

    db.commit()

    return {"mensaje": "Libro devuelto correctamente"}
