// src/components/Usuarios.jsx
import { useState, useEffect } from "react";
import api from "../api/api";

function Usuarios() {
  // Listado
  const [usuarios, setUsuarios] = useState([]);

  // Crear usuario
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");

  // Edición inline (id_usuario)
  const [editando, setEditando] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editCorreo, setEditCorreo] = useState("");

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await api.get("/usuarios/");
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      alert("Error al cargar usuarios");
    }
  };

  // Crear usuario
  const crearUsuario = async (e) => {
    e?.preventDefault();
    if (!nombre.trim() || !correo.trim()) {
      alert("Nombre y correo son obligatorios.");
      return;
    }
    try {
      await api.post("/usuarios/", {
        nombre,
        correo, // backend espera 'correo' (si tu backend usa 'email', también funcionará cuando lo adapte)
      });
      alert("Usuario creado correctamente");
      setNombre("");
      setCorreo("");
      cargarUsuarios();
    } catch (error) {
      console.error("Error al crear usuario:", error);
      alert("Error al crear usuario: " + (error.response?.data?.detail || ""));
    }
  };

  // Eliminar usuario
  const eliminarUsuario = async (id_usuario) => {
    if (!window.confirm("¿Eliminar usuario? Esta acción no se puede deshacer.")) return;
    try {
      await api.delete(`/usuarios/${id_usuario}`);
      alert("Usuario eliminado");
      cargarUsuarios();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Error al eliminar usuario");
    }
  };

  // Activar edición inline
  const activarEdicion = (u) => {
    // adaptarse a posibles nombres de campo (id_usuario o id)
    const id = u.id_usuario ?? u.id;
    setEditando(id);
    setEditNombre(u.nombre ?? "");
    setEditCorreo(u.correo ?? u.email ?? "");
  };

  const cancelarEdicion = () => {
    setEditando(null);
  };

  // Actualizar usuario
  const actualizarUsuario = async () => {
    try {
      await api.put(`/usuarios/${editando}`, {
        nombre: editNombre,
        correo: editCorreo,
      });
      alert("Usuario actualizado");
      setEditando(null);
      cargarUsuarios();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      alert("Error al actualizar usuario: " + (error.response?.data?.detail || ""));
    }
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {/* Crear usuario (card) */}
      <div className="card">
        <h3 style={{ marginBottom: 12 }}>Crear Usuario</h3>

        <form onSubmit={crearUsuario} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label>Nombre:</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={{ width: "100%", padding: 8, borderRadius: 8 }}
              placeholder="Nombre del usuario"
            />
          </div>

          <div>
            <label>Correo electrónico:</label>
            <input
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              style={{ width: "100%", padding: 8, borderRadius: 8 }}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
            <button className="btn btn-primary" type="submit">Guardar</button>
          </div>
        </form>
      </div>

      {/* Listado y edición inline (card) */}
      <div className="card">
        <h3 style={{ marginBottom: 12 }}>Listado de Usuarios</h3>

        <table className="table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((u) => {
              const id = u.id_usuario ?? u.id;
              return (
                <tr key={id}>
                  <td>{id}</td>

                  <td>
                    {editando === id ? (
                      <input
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        style={{ width: "100%", padding: 8, borderRadius: 8 }}
                      />
                    ) : (
                      u.nombre
                    )}
                  </td>

                  <td>
                    {editando === id ? (
                      <input
                        value={editCorreo}
                        onChange={(e) => setEditCorreo(e.target.value)}
                        style={{ width: "100%", padding: 8, borderRadius: 8 }}
                      />
                    ) : (
                      u.correo ?? u.email ?? "-"
                    )}
                  </td>

                  <td>
                    {editando === id ? (
                      <>
                        <button className="btn btn-primary" onClick={actualizarUsuario}>Guardar</button>
                        <button className="btn" style={{ marginLeft: 8 }} onClick={cancelarEdicion}>Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button className="btn" onClick={() => activarEdicion(u)}>Editar</button>
                        <button className="btn btn-danger" style={{ marginLeft: 8 }} onClick={() => eliminarUsuario(id)}>Eliminar</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}

            {usuarios.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>No hay usuarios registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Usuarios;
