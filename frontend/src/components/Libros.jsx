import { useState, useEffect } from "react";
import api from "../api/api";

function Libros() {
  // Selects: autores y géneros
  const [autores, setAutores] = useState([]);
  const [generos, setGeneros] = useState([]);

  // Crear libro
  const [titulo, setTitulo] = useState("");
  const [idAutor, setIdAutor] = useState("");
  const [idGenero, setIdGenero] = useState("");
  const [anioPublicacion, setAnioPublicacion] = useState("");
  const [editorial, setEditorial] = useState("");
  const [isbn, setIsbn] = useState("");
  const [disponible, setDisponible] = useState(true);

  // Listado
  const [libros, setLibros] = useState([]);

  // Edición
  const [editando, setEditando] = useState(null); // id_libro en edición
  const [editTitulo, setEditTitulo] = useState("");
  const [editIdAutor, setEditIdAutor] = useState("");
  const [editIdGenero, setEditIdGenero] = useState("");
  const [editAnioPublicacion, setEditAnioPublicacion] = useState("");
  const [editEditorial, setEditEditorial] = useState("");
  const [editIsbn, setEditIsbn] = useState("");
  const [editDisponible, setEditDisponible] = useState(true);

  // Búsqueda por título (opcional)
  const [termBusqueda, setTermBusqueda] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [resLibros, resAutores, resGeneros] = await Promise.all([
        api.get("/libros/"),
        api.get("/autores/"),
        api.get("/generos/")
      ]);
      setLibros(resLibros.data);
      setAutores(resAutores.data);
      setGeneros(resGeneros.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      alert("Error al cargar libros/autores/géneros");
    }
  };

  // Crear libro
  const crearLibro = async () => {
    try {
      await api.post("/libros/", {
        id_autor: idAutor || null,
        id_genero: idGenero || null,
        titulo,
        anio_publicacion: anioPublicacion ? parseInt(anioPublicacion, 10) : null,
        editorial,
        ISBN: isbn,
        disponible: Boolean(disponible)
      });
      alert("Libro creado correctamente");
      // reset
      setTitulo("");
      setIdAutor("");
      setIdGenero("");
      setAnioPublicacion("");
      setEditorial("");
      setIsbn("");
      setDisponible(true);
      cargarDatos();
    } catch (error) {
      console.error(error);
      alert("Error al crear libro: " + (error.response?.data?.detail || ""));
    }
  };

  // Eliminar libro
  const eliminarLibro = async (id_libro) => {
    if (!confirm("¿Eliminar libro? Esta acción no se puede deshacer.")) return;
    try {
      await api.delete(`/libros/${id_libro}`);
      alert("Libro eliminado");
      cargarDatos();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar libro");
    }
  };

  // Activar edición
  const activarEdicion = (l) => {
    setEditando(l.id_libro);
    setEditTitulo(l.titulo ?? "");
    setEditIdAutor(l.id_autor ?? "");
    setEditIdGenero(l.id_genero ?? "");
    setEditAnioPublicacion(l.anio_publicacion ?? "");
    setEditEditorial(l.editorial ?? "");
    setEditIsbn(l.ISBN ?? "");
    setEditDisponible(Boolean(l.disponible));
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setEditando(null);
  };

  // Actualizar libro
  const actualizarLibro = async () => {
    try {
      await api.put(`/libros/${editando}`, {
        id_autor: editIdAutor || null,
        id_genero: editIdGenero || null,
        titulo: editTitulo,
        anio_publicacion: editAnioPublicacion ? parseInt(editAnioPublicacion, 10) : null,
        editorial: editEditorial,
        ISBN: editIsbn,
        disponible: Boolean(editDisponible)
      });
      alert("Libro actualizado");
      setEditando(null);
      cargarDatos();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar libro: " + (error.response?.data?.detail || ""));
    }
  };

  // Buscar por título (usa /libros/buscar/titulo/{titulo})
  const buscarPorTitulo = async () => {
    if (!termBusqueda.trim()) {
      cargarDatos();
      return;
    }
    try {
      const res = await api.get(`/libros/buscar/titulo/${encodeURIComponent(termBusqueda)}`);
      setLibros(res.data);
    } catch (error) {
      console.error(error);
      alert("Error en búsqueda");
    }
  };

  return (
    <div>
      <h2>Crear Libro</h2>

      <div>
        <label>Título:</label><br />
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} /><br /><br />

        <label>Autor:</label><br />
        <select value={idAutor} onChange={(e) => setIdAutor(e.target.value)}>
          <option value="">Seleccione</option>
          {autores.map((a) => (
            <option key={a.id_autor ?? a.id} value={a.id_autor ?? a.id}>
              {a.nombre ?? a.nombre_completo ?? a.nombre_autor ?? `Autor ${a.id_autor ?? a.id}`}
            </option>
          ))}
        </select><br /><br />

        <label>Género:</label><br />
        <select value={idGenero} onChange={(e) => setIdGenero(e.target.value)}>
          <option value="">Seleccione</option>
          {generos.map((g) => (
            <option key={g.id_genero ?? g.id} value={g.id_genero ?? g.id}>
              {g.nombre ?? g.nombre_genero ?? `Género ${g.id_genero ?? g.id}`}
            </option>
          ))}
        </select><br /><br />

        <label>Año de publicación:</label><br />
        <input type="number" value={anioPublicacion} onChange={(e) => setAnioPublicacion(e.target.value)} /><br /><br />

        <label>Editorial:</label><br />
        <input value={editorial} onChange={(e) => setEditorial(e.target.value)} /><br /><br />

        <label>ISBN:</label><br />
        <input value={isbn} onChange={(e) => setIsbn(e.target.value)} /><br /><br />

        <label>
          <input type="checkbox" checked={disponible} onChange={(e) => setDisponible(e.target.checked)} /> Disponible
        </label><br /><br />

        <button onClick={crearLibro}>Guardar</button>
      </div>

      <hr />

      <h2>Listado de Libros</h2>

      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="Buscar por título..."
          value={termBusqueda}
          onChange={(e) => setTermBusqueda(e.target.value)}
        />
        <button onClick={buscarPorTitulo} style={{ marginLeft: 8 }}>Buscar</button>
        <button onClick={cargarDatos} style={{ marginLeft: 8 }}>Reset</button>
      </div>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Género</th>
            <th>Año</th>
            <th>Editorial</th>
            <th>ISBN</th>
            <th>Disponible</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {libros.map((l) => (
            <tr key={l.id_libro}>
              <td>{l.id_libro}</td>

              {/* TÍTULO */}
              <td>
                {editando === l.id_libro ? (
                  <input value={editTitulo} onChange={(e) => setEditTitulo(e.target.value)} />
                ) : (
                  l.titulo
                )}
              </td>

              {/* AUTOR */}
              <td>
                {editando === l.id_libro ? (
                  <select value={editIdAutor} onChange={(e) => setEditIdAutor(e.target.value)}>
                    <option value="">Seleccione</option>
                    {autores.map((a) => (
                      <option key={a.id_autor ?? a.id} value={a.id_autor ?? a.id}>
                        {a.nombre ?? a.nombre_completo}
                      </option>
                    ))}
                  </select>
                ) : (
                  autores.find((a) => (a.id_autor ?? a.id) === l.id_autor)?.nombre ?? l.id_autor
                )}
              </td>

              {/* GÉNERO */}
              <td>
                {editando === l.id_libro ? (
                  <select value={editIdGenero} onChange={(e) => setEditIdGenero(e.target.value)}>
                    <option value="">Seleccione</option>
                    {generos.map((g) => (
                      <option key={g.id_genero ?? g.id} value={g.id_genero ?? g.id}>
                        {g.nombre}
                      </option>
                    ))}
                  </select>
                ) : (
                  generos.find((g) => (g.id_genero ?? g.id) === l.id_genero)?.nombre ?? l.id_genero
                )}
              </td>

              {/* AÑO */}
              <td>
                {editando === l.id_libro ? (
                  <input type="number" value={editAnioPublicacion} onChange={(e) => setEditAnioPublicacion(e.target.value)} />
                ) : (
                  l.anio_publicacion
                )}
              </td>

              {/* EDITORIAL */}
              <td>
                {editando === l.id_libro ? (
                  <input value={editEditorial} onChange={(e) => setEditEditorial(e.target.value)} />
                ) : (
                  l.editorial
                )}
              </td>

              {/* ISBN */}
              <td>
                {editando === l.id_libro ? (
                  <input value={editIsbn} onChange={(e) => setEditIsbn(e.target.value)} />
                ) : (
                  l.ISBN
                )}
              </td>

              {/* DISPONIBLE */}
              <td>
                {editando === l.id_libro ? (
                  <input type="checkbox" checked={editDisponible} onChange={(e) => setEditDisponible(e.target.checked)} />
                ) : (
                  l.disponible ? "Sí" : "No"
                )}
              </td>

              {/* ACCIONES */}
              <td>
                {editando === l.id_libro ? (
                  <>
                    <button onClick={actualizarLibro}>Guardar</button>
                    <button onClick={cancelarEdicion} style={{ marginLeft: 8 }}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => activarEdicion(l)}>Editar</button>
                    <button onClick={() => eliminarLibro(l.id_libro)} style={{ color: "red", marginLeft: 8 }}>
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {libros.length === 0 && (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>No hay libros</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Libros;
