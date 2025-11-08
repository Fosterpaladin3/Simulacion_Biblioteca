from fastapi import APIRouter
from models.models import Usuario

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

usuarios = []

@router.get("/")
def listar_usuarios():
    return {"usuarios": usuarios}

@router.get("/{id_usuario}")
def obtener_usuario(id_usuario: int):
    for u in usuarios:
        if u.id == id_usuario:
            return u
    return {"mensaje": "Usuario no encontrado"}

@router.post("/")
def agregar_usuario(usuario: Usuario):
    for u in usuarios:
        if u.id == usuario.id:
            return {"error": "Ese ID ya existe"}
        if u.correo == usuario.correo:
            return {"error": "Ese correo ya está registrado"}
    usuarios.append(usuario)
    return {"mensaje": "Usuario registrado", "usuario": usuario}

@router.put("/{id_usuario}")
def actualizar_usuario(id_usuario: int, usuario: Usuario):
    for i, u in enumerate(usuarios):
        if u.id == id_usuario:
            usuarios[i] = usuario
            return {"mensaje": "Usuario actualizado", "usuario": usuario}
    return {"mensaje": "Usuario no encontrado"}

@router.delete("/{id_usuario}")
def eliminar_usuario(id_usuario: int):
    for i, u in enumerate(usuarios):
        if u.id == id_usuario:
            usuarios.pop(i)
            return {"mensaje": "Usuario eliminado"}
    return {"mensaje": "Usuario no encontrado"}

@router.get("/buscar/nombre/{nombre}")
def buscar_por_nombre(nombre: str):
    resultado = [u for u in usuarios if nombre.lower() in u.nombre.lower()]
    return {"resultado": resultado}

