import { useState, useEffect } from "react";
import api from "../api/api";

function Generos() {
  // Estados
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [generos, setGeneros] = useState([]);

  // Edición
  const [editando, setEditando] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");

  useEffect(() => {
    cargarGeneros();
  }, []);

  const cargarGeneros = async () => {
    try {
      const res = await api.get("/generos/");
      setGeneros(res.data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar los géneros");
    }
  };

  const crearGenero = async () => {
    try {
      await api.post("/generos/", {
        nombre,
        descripcion,
      });
      alert("Género creado correctamente");
      setNombre("");
      setDescripcion("");
      cargarGeneros();
    } catch (error) {
      console.error(error);
      alert("Error al crear género: " + (error.response?.data?.detail || ""));
    }
  };

  const eliminarGenero = async (id_genero) => {
    if (!window.confirm("¿Eliminar género? Esta acción no se puede deshacer.")) return;

    try {
      await api.delete(`/generos/${id_genero}`);
      alert("Género eliminado");
      cargarGeneros();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar género");
    }
  };

  const activarEdicion = (g) => {
    setEditando(g.id_genero);
    setEditNombre(g.nombre);
    setEditDescripcion(g.descripcion);
  };

  const cancelarEdicion = () => {
    setEditando(null);
  };

  const actualizarGenero = async () => {
    try {
      await api.put(`/generos/${editando}`, {
        nombre: editNombre,
        descripcion: editDescripcion,
      });
      alert("Género actualizado");
      setEditando(null);
      cargarGeneros();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar género: " + (error.response?.data?.detail || ""));
    }
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {/* Crear Género */}
      <div className="card">
        <h3 style={{ marginBottom: 12 }}>Crear Género</h3>

        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <label>Nombre:</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={{ width: "100%", padding: 8, borderRadius: 8 }}
            />
          </div>

          <div>
            <label>Descripción:</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              style={{ width: "100%", padding: 8, borderRadius: 8 }}
            />
          </div>
        </div>

        <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={crearGenero}>
          Guardar
        </button>
      </div>

      {/* Listado */}
      <div className="card">
        <h3 style={{ marginBottom: 12 }}>Listado de Géneros</h3>

        <table className="table" style={{ width: "100%" }}>
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

                {/* Nombre */}
                <td>
                  {editando === g.id_genero ? (
                    <input
                      value={editNombre}
                      onChange={(e) => setEditNombre(e.target.value)}
                    />
                  ) : (
                    g.nombre
                  )}
                </td>

                {/* Descripción */}
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

                <td>
                  {editando === g.id_genero ? (
                    <>
                      <button className="btn btn-primary" onClick={actualizarGenero}>
                        Guardar
                      </button>
                      <button
                        className="btn"
                        style={{ marginLeft: 8 }}
                        onClick={cancelarEdicion}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn" onClick={() => activarEdicion(g)}>
                        Editar
                      </button>

                      <button
                        className="btn btn-danger"
                        style={{ marginLeft: 8 }}
                        onClick={() => eliminarGenero(g.id_genero)}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}

            {generos.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No hay géneros registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Generos;
