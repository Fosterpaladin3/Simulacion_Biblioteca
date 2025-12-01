import { useState, useEffect } from "react";
import api from "../api/api";

function Generos() {
  // Estados para crear
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Estados para listar
  const [generos, setGeneros] = useState([]);

  // Estado para edición
  const [editando, setEditando] = useState(null); // guardará id_genero
  const [editNombre, setEditNombre] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");

  // Cargar géneros al iniciar
  useEffect(() => {
    cargarGeneros();
  }, []);

  const cargarGeneros = async () => {
    try {
      const resp = await api.get("/generos/");
      setGeneros(resp.data);
    } catch (error) {
      console.log("Error al cargar géneros", error);
    }
  };

  // Crear género
  const crearGenero = async () => {
    try {
      await api.post("/generos/", {
        nombre_genero: nombre,
        descripcion,
      });

      alert("Género creado correctamente");

      setNombre("");
      setDescripcion("");

      cargarGeneros();
    } catch (error) {
      console.log(error);
      alert("Error al crear género");
    }
  };

  // Eliminar género
  const eliminarGenero = async (id_genero) => {
    try {
      await api.delete(`/generos/${id_genero}`);
      alert("Género eliminado");
      cargarGeneros();
    } catch (error) {
      console.log(error);
      alert("Error al eliminar género");
    }
  };

  // Activar modo edición (recibe el objeto retornado por el backend)
  const activarEdicion = (g) => {
    setEditando(g.id_genero);
    setEditNombre(g.nombre_genero ?? "");
    setEditDescripcion(g.descripcion ?? "");
  };

  // Guardar edición
  const actualizarGenero = async () => {
    try {
      await api.put(`/generos/${editando}`, {
        nombre_genero: editNombre,
        descripcion: editDescripcion,
      });

      alert("Género actualizado");
      setEditando(null);
      setEditNombre("");
      setEditDescripcion("");
      cargarGeneros();
    } catch (error) {
      console.log(error);
      alert("Error al actualizar género");
    }
  };

  return (
    <div>
      <h2>Crear Género</h2>

      {/* FORMULARIO CREAR */}
      <div>
        <label>Nombre:</label>
        <br />
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <br />
        <br />

        <label>Descripción:</label>
        <br />
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <br />
        <br />

        <button onClick={crearGenero}>Guardar</button>
      </div>

      <hr />

      {/* LISTADO */}
      <h2>Listado de Géneros</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {generos.map((g) => (
            <tr key={g.id_genero}>
              <td>{g.id_genero}</td>

              {/* NOMBRE */}
              <td>
                {editando === g.id_genero ? (
                  <input
                    value={editNombre}
                    onChange={(e) => setEditNombre(e.target.value)}
                  />
                ) : (
                  g.nombre_genero
                )}
              </td>

              {/* DESCRIPCIÓN */}
              <td>
                {editando === g.id_genero ? (
                  <textarea
                    value={editDescripcion}
                    onChange={(e) => setEditDescripcion(e.target.value)}
                  />
                ) : (
                  g.descripcion
                )}
              </td>

              {/* BOTONES */}
              <td>
                {editando === g.id_genero ? (
                  <>
                    <button onClick={actualizarGenero}>Guardar</button>
                    <button
                      onClick={() => {
                        setEditando(null);
                        setEditNombre("");
                        setEditDescripcion("");
                      }}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => activarEdicion(g)}>Editar</button>
                    <button
                      onClick={() => eliminarGenero(g.id_genero)}
                      style={{ color: "red", marginLeft: "10px" }}
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Generos;
