from fastapi import APIRouter
from models.models import Autor

router = APIRouter(prefix="/autores", tags=["Autores"])

autores = []

@router.get("/")
def listar_autores():
    return {"autores": autores}

@router.get("/{id_autor}")
def obtener_autor(id_autor: int):
    for autor in autores:
        if autor.id == id_autor:
            return autor
    return {"mensaje": "Autor no encontrado"}

@router.post("/")
def agregar_autor(autor: Autor):
    for a in autores:
        if a.id == autor.id:
            return {"error": "Ya existe un autor con ese ID"}
    autores.append(autor)
    return {"mensaje": "Autor agregado correctamente", "autor": autor}

@router.put("/{id_autor}")
def actualizar_autor(id_autor: int, autor: Autor):
    for i, a in enumerate(autores):
        if a.id == id_autor:
            autores[i] = autor
            return {"mensaje": "Autor actualizado correctamente", "autor": autor}
    return {"mensaje": "Autor no encontrado"}

@router.delete("/{id_autor}")
def eliminar_autor(id_autor: int):
    for i, a in enumerate(autores):
        if a.id == id_autor:
            autores.pop(i)
            return {"mensaje": "Autor eliminado correctamente"}
    return {"mensaje": "Autor no encontrado"}

@router.get("/buscar/nombre/{nombre}")
def buscar_por_nombre(nombre: str):
    resultado = [a for a in autores if nombre.lower() in a.nombre.lower()]
    return {"resultado": resultado}
