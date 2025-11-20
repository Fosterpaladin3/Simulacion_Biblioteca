from pydantic import BaseModel, EmailStr
from datetime import date

class UsuarioBase(BaseModel):
    nombre: str
    direccion: str
    telefono: str
    correo: EmailStr
    fecha_registro: date


class UsuarioCreate(UsuarioBase):
    pass


class UsuarioUpdate(UsuarioBase):
    pass


class UsuarioResponse(UsuarioBase):
    id_usuario: int

    class Config:
        orm_mode = True
