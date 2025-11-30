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

    # Pydantic v2
    model_config = {
        "from_attributes": True
    }
