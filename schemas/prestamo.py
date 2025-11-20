from pydantic import BaseModel
from datetime import date

class PrestamoBase(BaseModel):
    id_usuario: int
    id_libro: int
    fecha_prestamo: date
    fecha_devolucion: date | None = None
    estado: str = "PRESTADO"

class PrestamoCreate(PrestamoBase):
    pass

class PrestamoUpdate(PrestamoBase):
    pass

class PrestamoResponse(PrestamoBase):
    id_prestamo: int

    class Config:
        orm_mode = True
