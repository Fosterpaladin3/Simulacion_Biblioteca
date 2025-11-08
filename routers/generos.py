from fastapi import APIRouter
from models.models import Genero

router = APIRouter(prefix="/generos", tags=["Géneros"])

generos = []

@router.get("/")
def listar_generos():
    return {"generos": generos}

@router.get("/{id_genero}")
def obtener_genero(id_genero: int):
    for g in generos:
        if g.id == id_genero:
            return g
    return {"mensaje": "Género no encontrado"}

@router.post("/")
def agregar_genero(genero: Genero):
    for g in generos:
        if g.id == genero.id:
            return {"error": "Ya existe un género con ese ID"}
    generos.append(genero)
    return {"mensaje": "Género agregado correctamente", "genero": genero}

@router.put("/{id_genero}")
def actualizar_genero(id_genero: int, genero: Genero):
    for i, g in enumerate(generos):
        if g.id == id_genero:
            generos[i] = genero
            return {"mensaje": "Género actualizado", "genero": genero}
    return {"mensaje": "Género no encontrado"}

@router.delete("/{id_genero}")
def eliminar_genero(id_genero: int):
    for i, g in enumerate(generos):
        if g.id == id_genero:
            generos.pop(i)
            return {"mensaje": "Género eliminado"}
    return {"mensaje": "Género no encontrado"}

@router.get("/buscar/nombre/{nombre}")
def buscar_genero(nombre: str):
    resultado = [g for g in generos if nombre.lower() in g.nombre_genero.lower()]
    return {"resultado": resultado}
