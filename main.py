from fastapi import FastAPI
from fastapi.responses import Response
from routers import autores, generos, libros, usuarios, prestamos

app = FastAPI()

app.include_router(autores.router)
app.include_router(generos.router)
app.include_router(libros.router)
app.include_router(usuarios.router)
app.include_router(prestamos.router)

@app.get("/")
def inicio():
    return {"mensaje": "API Biblioteca funcionando correctamente "}

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)