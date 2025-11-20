from pydantic import BaseModel

class GeneroBase(BaseModel):
    nombre_genero: str
    descripcion: str

class GeneroCreate(GeneroBase):
    pass

class GeneroUpdate(GeneroBase):
    pass

class GeneroResponse(GeneroBase):
    id_genero: int

    class Config:
        orm_mode = True
