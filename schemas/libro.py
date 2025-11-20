from pydantic import BaseModel

class LibroBase(BaseModel):
    id_autor: int
    id_genero: int
    titulo: str
    anio_publicacion: int
    editorial: str
    ISBN: str
    disponible: bool = True


class LibroCreate(LibroBase):
    pass


class LibroUpdate(LibroBase):
    pass


class LibroResponse(LibroBase):
    id_libro: int

    class Config:
        orm_mode = True
