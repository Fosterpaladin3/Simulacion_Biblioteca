from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db
from models.models import Usuario
from schemas.usuario import UsuarioCreate, UsuarioUpdate, UsuarioResponse

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])


# LISTAR USUARIOS 
@router.get("/", response_model=list[UsuarioResponse])
def listar_usuarios(db: Session = Depends(get_db)):
    return db.query(Usuario).all()


# OBTENER UN USUARIO 
@router.get("/{id_usuario}", response_model=UsuarioResponse)
def obtener_usuario(id_usuario: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario


# CREAR USUARIO 
@router.post("/", response_model=UsuarioResponse)
def agregar_usuario(data: UsuarioCreate, db: Session = Depends(get_db)):

    # Validar correo único
    correo_existente = db.query(Usuario).filter(Usuario.correo == data.correo).first()
    if correo_existente:
        raise HTTPException(status_code=400, detail="Ese correo ya está registrado")

    nuevo_usuario = Usuario(
        nombre=data.nombre,
        direccion=data.direccion,
        telefono=data.telefono,
        correo=data.correo,
        fecha_registro=data.fecha_registro
    )

    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    return nuevo_usuario


# ACTUALIZAR USUARIO
@router.put("/{id_usuario}", response_model=UsuarioResponse)
def actualizar_usuario(id_usuario: int, data: UsuarioUpdate, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Validar correo único si se está cambiando
    correo_existente = db.query(Usuario).filter(
        Usuario.correo == data.correo,
        Usuario.id_usuario != id_usuario
    ).first()

    if correo_existente:
        raise HTTPException(status_code=400, detail="Otro usuario ya usa ese correo")

    usuario.nombre = data.nombre
    usuario.direccion = data.direccion
    usuario.telefono = data.telefono
    usuario.correo = data.correo
    usuario.fecha_registro = data.fecha_registro

    db.commit()
    db.refresh(usuario)
    return usuario


# ELIMINAR USUARIO
@router.delete("/{id_usuario}")
def eliminar_usuario(id_usuario: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    db.delete(usuario)
    db.commit()
    return {"mensaje": "Usuario eliminado correctamente"}


# BUSCAR POR NOMBRE
@router.get("/buscar/nombre/{nombre}", response_model=list[UsuarioResponse])
def buscar_por_nombre(nombre: str, db: Session = Depends(get_db)):
    return db.query(Usuario).filter(Usuario.nombre.ilike(f"%{nombre}%")).all()
