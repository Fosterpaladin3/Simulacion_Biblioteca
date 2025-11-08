from fastapi import APIRouter 
from models.models import Libro

router = APIRouter(prefix="/libros", tags=["Libros"])

libros = []

@router.get("/")
def listar_libros():
    return {"libros": libros}

@router.get("/{id_libro}")
def obtener_libro(id_libro: int):
    for libro in libros:
        if libro.id == id_libro:
            return libro
    return {"mensaje": "Libro no encontrado"}

@router.post("/")
def agregar_libro(libro: Libro):
    for l in libros:
        if l.id == libro.id:
            return {"error": "Ese ID de libro ya existe"}
        if l.ISBN == libro.ISBN:
            return {"error": "Ya existe un libro con ese ISBN"}
    libros.append(libro)
    return {"mensaje": "Libro agregado", "libro": libro}

@router.put("/{id_libro}")
def actualizar_libro(id_libro: int, libro: Libro):
    for i, l in enumerate(libros):
        if l.id == id_libro:
            libros[i] = libro
            return {"mensaje": "Libro actualizado", "libro": libro}
    return {"mensaje": "Libro no encontrado"}

@router.delete("/{id_libro}")
def eliminar_libro(id_libro: int):
    for i, l in enumerate(libros):
        if l.id == id_libro:
            libros.pop(i)
            return {"mensaje": "Libro eliminado"}
    return {"mensaje": "Libro no encontrado"}

@router.get("/buscar/titulo/{titulo}")
def buscar_titulo(titulo: str):
    resultado = [l for l in libros if titulo.lower() in l.titulo.lower()]
    return {"resultado": resultado}
