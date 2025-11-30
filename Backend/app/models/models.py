from db.database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, Date
from sqlalchemy.orm import relationship

class Autor(Base):
    __tablename__ = 'autores'
    
    id_autor = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    nacionalidad = Column(String, nullable=False)
    
    libros = relationship('Libro', back_populates='autor')


class Genero(Base):
    __tablename__ = 'generos'
    
    id_genero = Column(Integer, primary_key=True)
    nombre_genero = Column(String, nullable=False)
    descripcion = Column(String, nullable=False)
    
    libros = relationship('Libro', back_populates='genero')


class Libro(Base):
    __tablename__ = 'libros'
    
    id_libro = Column(Integer, primary_key=True)
    id_autor = Column(Integer, ForeignKey('autores.id_autor'), nullable=False)
    id_genero = Column(Integer, ForeignKey('generos.id_genero'), nullable=False)
    
    titulo = Column(String, nullable=False)
    anio_publicacion = Column(Integer, nullable=False)
    editorial = Column(String, nullable=False)
    ISBN = Column(String, nullable=False)
    disponible = Column(Boolean, default=True)

    autor = relationship('Autor', back_populates='libros')
    genero = relationship('Genero', back_populates='libros')

    # 🔹 Relación faltante (necesaria para Prestamo)
    prestamos = relationship('Prestamo', back_populates='libro')


class Usuario(Base):
    __tablename__ = 'usuarios'
    
    id_usuario = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    direccion = Column(String, nullable=False)
    telefono = Column(String, nullable=False)
    correo = Column(String, nullable=False)
    fecha_registro = Column(Date, nullable=False)
    
    prestamos = relationship('Prestamo', back_populates='usuario')


class Prestamo(Base):
    __tablename__ = 'prestamos'
    
    id_prestamo = Column(Integer, primary_key=True)
    id_usuario = Column(Integer, ForeignKey('usuarios.id_usuario'), nullable=False)
    id_libro = Column(Integer, ForeignKey('libros.id_libro'), nullable=False)
    
    fecha_prestamo = Column(Date, nullable=False)
    fecha_devolucion = Column(Date, nullable=True)
    estado = Column(String, default='PRESTADO')

    usuario = relationship('Usuario', back_populates='prestamos')
    libro = relationship('Libro', back_populates='prestamos')
