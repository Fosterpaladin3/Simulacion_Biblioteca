from fastapi import APIRouter
from models.models import Prestamo
from routers.libros import libros     # importamos lista de libros
from routers.usuarios import usuarios # importamos lista de usuarios

router = APIRouter(prefix="/prestamos", tags=["Préstamos"])

prestamos = []

@router.get("/")
def listar_prestamos():
    return {"prestamos": prestamos}

@router.get("/{id_prestamo}")
def obtener_prestamo(id_prestamo: int):
    for p in prestamos:
        if p.id == id_prestamo:
            return p
    return {"mensaje": "Préstamo no encontrado"}

@router.post("/")
def crear_prestamo(prestamo: Prestamo):
    # Validar usuario
    if not any(u.id == prestamo.id_usuario for u in usuarios):
        return {"error": "El usuario no existe"}

    # Validar libro
    for libro in libros:
        if libro.id == prestamo.id_libro:
            if not libro.disponible:
                return {"error": "El libro NO está disponible"}
            libro.disponible = False
            prestamos.append(prestamo)
            return {"mensaje": "Préstamo creado correctamente", "prestamo": prestamo}

    return {"error": "Libro no encontrado"}

@router.put("/{id_prestamo}")
def actualizar_prestamo(id_prestamo: int, prestamo: Prestamo):
    for i, p in enumerate(prestamos):
        if p.id == id_prestamo:
            prestamos[i] = prestamo
            return {"mensaje": "Préstamo actualizado", "prestamo": prestamo}
    return {"mensaje": "Préstamo no encontrado"}

@router.delete("/{id_prestamo}")
def eliminar_prestamo(id_prestamo: int):
    for i, p in enumerate(prestamos):
        if p.id == id_prestamo:
            # devolver disponibilidad al libro
            for libro in libros:
                if libro.id == p.id_libro:
                    libro.disponible = True
            prestamos.pop(i)
            return {"mensaje": "Préstamo eliminado"}
    return {"mensaje": "Préstamo no encontrado"}

@router.post("/{id_prestamo}/devolver")
def devolver_prestamo(id_prestamo: int):
    for p in prestamos:
        if p.id == id_prestamo:
            p.estado = "DEVUELTO"
            for libro in libros:
                if libro.id == p.id_libro:
                    libro.disponible = True
            return {"mensaje": "Libro devuelto correctamente"}
    return {"mensaje": "Préstamo no encontrado"}
