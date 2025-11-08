from pydantic import BaseModel
from typing import Optional

class Autor(BaseModel):
    id_autor: int
    nombre: str
    nacionalidad: str

class Genero(BaseModel):
    id_genero: int
    nombre_genero: str
    descripcion: str

class Libro(BaseModel):
    id_libro: int
    id_autor: int
    id_genero: int
    titulo: str
    anio_publicacion: int
    editorial: str
    ISBN: str
    disponible: bool = True    

class Usuario(BaseModel):
    id_usuario: int
    nombre: str
    direccion: str
    telefono: str
    correo: str
    fecha_registro: str

class Prestamo(BaseModel):
    id_prestamo: int
    id_usuario: int
    id_libro: int
    fecha_prestamo: str
    fecha_devolucion: Optional[str] = None  
    estado: str = "PRESTADO"

