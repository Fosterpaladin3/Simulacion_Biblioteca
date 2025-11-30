from pydantic import BaseModel

class AutorBase(BaseModel):
    nombre: str
    nacionalidad: str


class AutorCreate(AutorBase):
    pass


class AutorUpdate(AutorBase):
    pass


class AutorResponse(AutorBase):
    id_autor: int

    # Pydantic v2
    model_config = {
        "from_attributes": True
    }
