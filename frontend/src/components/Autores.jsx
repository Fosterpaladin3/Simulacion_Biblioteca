// src/components/Autores.jsx
import { useState, useEffect } from "react";
import api from "../api/api";

function Autores() {
  // Estados para crear
  const [nombre, setNombre] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");

  // Listado
  const [autores, setAutores] = useState([]);

  // Edición
  const [editando, setEditando] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editNacionalidad, setEditNacionalidad] = useState("");

  useEffect(() => {
    cargarAutores();
  }, []);

  const cargarAutores = async () => {
    try {
      const res = await api.get("/autores/");
      setAutores(res.data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar autores");
    }
  };

  const crearAutor = async () => {
    if (!nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }
    try {
      await api.post("/autores/", {
        nombre,
        nacionalidad,
      });
      alert("Autor creado correctamente");
      setNombre("");
      setNacionalidad("");
      cargarAutores();
    } catch (error) {
      console.error(error);
      alert("Error al crear autor: " + (error.response?.data?.detail || ""));
    }
  };

  const eliminarAutor = async (id_autor) => {
    if (!window.confirm("¿Eliminar autor? Esta acción no se puede deshacer.")) return;
    try {
      await api.delete(`/autores/${id_autor}`);
      alert("Autor eliminado");
      cargarAutores();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar autor");
    }
  };

  const activarEdicion = (a) => {
    setEditando(a.id_autor);
    setEditNombre(a.nombre ?? "");
    setEditNacionalidad(a.nacionalidad ?? "");
  };

  const cancelarEdicion = () => {
    setEditando(null);
  };

  const actualizarAutor = async () => {
    if (!editNombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }
    try {
      await api.put(`/autores/${editando}`, {
        nombre: editNombre,
        nacionalidad: editNacionalidad,
      });
      alert("Autor actualizado");
      setEditando(null);
      cargarAutores();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar autor: " + (error.response?.data?.detail || ""));
    }
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {/* Crear Autor */}
      <div className="card">
        <h3 style={{ marginBottom: 12 }}>Crear Autor</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label>Nombre:</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={{ width: "100%", padding: 8, borderRadius: 8 }}
              placeholder="Nombre del autor"
            />
          </div>

          <div>
            <label>Nacionalidad:</label>
            <input
              value={nacionalidad}
              onChange={(e) => setNacionalidad(e.target.value)}
              style={{ width: "100%", padding: 8, borderRadius: 8 }}
              placeholder="E.g. Colombia"
            />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="btn btn-primary" onClick={crearAutor}>
            Guardar
          </button>
        </div>
      </div>

      {/* Listado de Autores */}
      <div className="card">
        <h3 style={{ marginBottom: 12 }}>Listado de Autores</h3>

        <table className="table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Nacionalidad</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {autores.map((a) => (
              <tr key={a.id_autor}>
                <td>{a.id_autor}</td>

                {/* Nombre */}
                <td>
                  {editando === a.id_autor ? (
                    <input value={editNombre} onChange={(e) => setEditNombre(e.target.value)} />
                  ) : (
                    a.nombre
                  )}
                </td>

                {/* Nacionalidad */}
                <td>
                  {editando === a.id_autor ? (
                    <input value={editNacionalidad} onChange={(e) => setEditNacionalidad(e.target.value)} />
                  ) : (
                    a.nacionalidad ?? "-"
                  )}
                </td>

                <td>
                  {editando === a.id_autor ? (
                    <>
                      <button className="btn btn-primary" onClick={actualizarAutor}>
                        Guardar
                      </button>
                      <button className="btn" style={{ marginLeft: 8 }} onClick={cancelarEdicion}>
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn" onClick={() => activarEdicion(a)}>
                        Editar
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{ marginLeft: 8 }}
                        onClick={() => eliminarAutor(a.id_autor)}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}

            {autores.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No hay autores registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Autores;
