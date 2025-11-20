from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db
from models.models import Libro
from schemas.libro import LibroCreate, LibroUpdate, LibroResponse

router = APIRouter(prefix="/libros", tags=["Libros"])


# LISTAR LIBROS
@router.get("/", response_model=list[LibroResponse])
def listar_libros(db: Session = Depends(get_db)):
    return db.query(Libro).all()


# OBTENER LIBRO
@router.get("/{id_libro}", response_model=LibroResponse)
def obtener_libro(id_libro: int, db: Session = Depends(get_db)):
    libro = db.query(Libro).filter(Libro.id_libro == id_libro).first()
    if not libro:
        raise HTTPException(status_code=404, detail="Libro no encontrado")
    return libro


# CREAR LIBRO 
@router.post("/", response_model=LibroResponse)
def agregar_libro(data: LibroCreate, db: Session = Depends(get_db)):

    # Verificar ISBN único
    isbn_existente = db.query(Libro).filter(Libro.ISBN == data.ISBN).first()
    if isbn_existente:
        raise HTTPException(status_code=400, detail="Ya existe un libro con ese ISBN")

    nuevo_libro = Libro(
        id_autor=data.id_autor,
        id_genero=data.id_genero,
        titulo=data.titulo,
        anio_publicacion=data.anio_publicacion,
        editorial=data.editorial,
        ISBN=data.ISBN,
        disponible=data.disponible
    )

    db.add(nuevo_libro)
    db.commit()
    db.refresh(nuevo_libro)
    return nuevo_libro


# ACTUALIZAR LIBRO
@router.put("/{id_libro}", response_model=LibroResponse)
def actualizar_libro(id_libro: int, data: LibroUpdate, db: Session = Depends(get_db)):
    libro = db.query(Libro).filter(Libro.id_libro == id_libro).first()
    if not libro:
        raise HTTPException(status_code=404, detail="Libro no encontrado")
    
    # Validar ISBN único (si se cambia)
    isbn_existente = db.query(Libro).filter(Libro.ISBN == data.ISBN, Libro.id_libro != id_libro).first()
    if isbn_existente:
        raise HTTPException(status_code=400, detail="Otro libro ya tiene ese ISBN")

    libro.id_autor = data.id_autor
    libro.id_genero = data.id_genero
    libro.titulo = data.titulo
    libro.anio_publicacion = data.anio_publicacion
    libro.editorial = data.editorial
    libro.ISBN = data.ISBN
    libro.disponible = data.disponible

    db.commit()
    db.refresh(libro)
    return libro


# ELIMINAR LIBRO
@router.delete("/{id_libro}")
def eliminar_libro(id_libro: int, db: Session = Depends(get_db)):
    libro = db.query(Libro).filter(Libro.id_libro == id_libro).first()
    if not libro:
        raise HTTPException(status_code=404, detail="Libro no encontrado")

    db.delete(libro)
    db.commit()
    return {"mensaje": "Libro eliminado correctamente"}


# BUSCAR POR TÍTULO
@router.get("/buscar/titulo/{titulo}", response_model=list[LibroResponse])
def buscar_titulo(titulo: str, db: Session = Depends(get_db)):
    return db.query(Libro).filter(Libro.titulo.ilike(f"%{titulo}%")).all()
