// src/components/Prestamos.jsx
import { useState, useEffect } from "react";
import api from "../api/api";

function Prestamos() {
  // Listas necesarias
  const [usuarios, setUsuarios] = useState([]);
  const [libros, setLibros] = useState([]);
  const [prestamos, setPrestamos] = useState([]);

  // Crear préstamo
  const [idUsuario, setIdUsuario] = useState("");
  const [idLibro, setIdLibro] = useState("");
  const [fechaPrestamo, setFechaPrestamo] = useState("");
  const [fechaDevolucion, setFechaDevolucion] = useState("");
  const [devuelto, setDevuelto] = useState(false);

  // Edición
  const [editando, setEditando] = useState(null); // id_prestamo
  const [editIdUsuario, setEditIdUsuario] = useState("");
  const [editIdLibro, setEditIdLibro] = useState("");
  const [editFechaPrestamo, setEditFechaPrestamo] = useState("");
  const [editFechaDevolucion, setEditFechaDevolucion] = useState("");
  const [editDevuelto, setEditDevuelto] = useState(false);

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    try {
      const [resPrestamos, resUsuarios, resLibros] = await Promise.all([
        api.get("/prestamos/"),
        api.get("/usuarios/"),
        api.get("/libros/"),
      ]);
      setPrestamos(resPrestamos.data);
      setUsuarios(resUsuarios.data);
      setLibros(resLibros.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      alert("Error al cargar préstamos/usuarios/libros");
    }
  };

  // Crear préstamo
  const crearPrestamo = async (e) => {
    e?.preventDefault();
    if (!idUsuario || !idLibro || !fechaPrestamo) {
      alert("Usuario, libro y fecha de préstamo son obligatorios.");
      return;
    }
    try {
      await api.post("/prestamos/", {
        id_usuario: idUsuario,
        id_libro: idLibro,
        fecha_prestamo: fechaPrestamo,
        fecha_devolucion: fechaDevolucion || null,
        devuelto: Boolean(devuelto),
      });
      alert("Préstamo creado correctamente");
      // reset
      setIdUsuario("");
      setIdLibro("");
      setFechaPrestamo("");
      setFechaDevolucion("");
      setDevuelto(false);
      cargarTodo();
    } catch (error) {
      console.error(error);
      alert("Error al crear préstamo: " + (error.response?.data?.detail || ""));
    }
  };

  // Eliminar préstamo
  const eliminarPrestamo = async (id_prestamo) => {
    if (!window.confirm("¿Eliminar préstamo? Esta acción no se puede deshacer.")) return;
    try {
      await api.delete(`/prestamos/${id_prestamo}`);
      alert("Préstamo eliminado");
      cargarTodo();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar préstamo");
    }
  };

  // Activar edición
  const activarEdicion = (p) => {
    setEditando(p.id_prestamo);
    setEditIdUsuario(p.id_usuario ?? "");
    setEditIdLibro(p.id_libro ?? "");
    setEditFechaPrestamo(p.fecha_prestamo ? p.fecha_prestamo.split("T")[0] : "");
    setEditFechaDevolucion(p.fecha_devolucion ? p.fecha_devolucion.split("T")[0] : "");
    setEditDevuelto(Boolean(p.devuelto));
  };

  const cancelarEdicion = () => {
    setEditando(null);
  };

  // Actualizar préstamo
  const actualizarPrestamo = async (e) => {
    e?.preventDefault();
    if (!editIdUsuario || !editIdLibro || !editFechaPrestamo) {
      alert("Usuario, libro y fecha de préstamo son obligatorios.");
      return;
    }
    try {
      await api.put(`/prestamos/${editando}`, {
        id_usuario: editIdUsuario,
        id_libro: editIdLibro,
        fecha_prestamo: editFechaPrestamo,
        fecha_devolucion: editFechaDevolucion || null,
        devuelto: Boolean(editDevuelto),
      });
      alert("Préstamo actualizado");
      setEditando(null);
      cargarTodo();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar préstamo: " + (error.response?.data?.detail || ""));
    }
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {/* Crear préstamo */}
      <div className="card">
        <h3 style={{ marginBottom: 12 }}>Crear Préstamo</h3>

        <form onSubmit={crearPrestamo} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label>Usuario:</label>
            <select value={idUsuario} onChange={(e) => setIdUsuario(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 8 }}>
              <option value="">Seleccione</option>
              {usuarios.map((u) => (
                <option key={u.id_usuario ?? u.id} value={u.id_usuario ?? u.id}>
                  {u.nombre ?? u.nombre_completo ?? `Usuario ${u.id_usuario ?? u.id}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Libro:</label>
            <select value={idLibro} onChange={(e) => setIdLibro(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 8 }}>
              <option value="">Seleccione</option>
              {libros.map((l) => (
                <option key={l.id_libro ?? l.id} value={l.id_libro ?? l.id}>
                  {l.titulo ?? `Libro ${l.id_libro ?? l.id}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Fecha de préstamo:</label>
            <input type="date" value={fechaPrestamo} onChange={(e) => setFechaPrestamo(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 8 }} />
          </div>

          <div>
            <label>Fecha de devolución (opcional):</label>
            <input type="date" value={fechaDevolucion} onChange={(e) => setFechaDevolucion(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 8 }} />
          </div>

          <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={devuelto} onChange={(e) => setDevuelto(e.target.checked)} />
              Devuelto
            </label>

            <div style={{ marginLeft: "auto" }}>
              <button className="btn btn-primary" type="submit">Guardar préstamo</button>
            </div>
          </div>
        </form>
      </div>

      {/* Listado y edición */}
      <div className="card">
        <h3 style={{ marginBottom: 12 }}>Listado de Préstamos</h3>

        <table className="table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Libro</th>
              <th>Fecha préstamo</th>
              <th>Fecha devolución</th>
              <th>Devuelto</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {prestamos.map((p) => (
              <tr key={p.id_prestamo}>
                <td>{p.id_prestamo}</td>

                <td>
                  {editando === p.id_prestamo ? (
                    <select value={editIdUsuario} onChange={(e) => setEditIdUsuario(e.target.value)}>
                      <option value="">Seleccione</option>
                      {usuarios.map((u) => (
                        <option key={u.id_usuario ?? u.id} value={u.id_usuario ?? u.id}>
                          {u.nombre ?? `Usuario ${u.id_usuario ?? u.id}`}
                        </option>
                      ))}
                    </select>
                  ) : (
                    usuarios.find((u) => (u.id_usuario ?? u.id) === p.id_usuario)?.nombre ?? p.id_usuario
                  )}
                </td>

                <td>
                  {editando === p.id_prestamo ? (
                    <select value={editIdLibro} onChange={(e) => setEditIdLibro(e.target.value)}>
                      <option value="">Seleccione</option>
                      {libros.map((l) => (
                        <option key={l.id_libro ?? l.id} value={l.id_libro ?? l.id}>
                          {l.titulo ?? `Libro ${l.id_libro ?? l.id}`}
                        </option>
                      ))}
                    </select>
                  ) : (
                    libros.find((l) => (l.id_libro ?? l.id) === p.id_libro)?.titulo ?? p.id_libro
                  )}
                </td>

                <td>
                  {editando === p.id_prestamo ? (
                    <input type="date" value={editFechaPrestamo} onChange={(e) => setEditFechaPrestamo(e.target.value)} />
                  ) : (
                    p.fecha_prestamo ? p.fecha_prestamo.split("T")[0] : "-"
                  )}
                </td>

                <td>
                  {editando === p.id_prestamo ? (
                    <input type="date" value={editFechaDevolucion} onChange={(e) => setEditFechaDevolucion(e.target.value)} />
                  ) : (
                    p.fecha_devolucion ? p.fecha_devolucion.split("T")[0] : "-"
                  )}
                </td>

                <td>
                  {editando === p.id_prestamo ? (
                    <input type="checkbox" checked={editDevuelto} onChange={(e) => setEditDevuelto(e.target.checked)} />
                  ) : (
                    p.devuelto ? "Sí" : "No"
                  )}
                </td>

                <td>
                  {editando === p.id_prestamo ? (
                    <>
                      <button className="btn btn-primary" onClick={actualizarPrestamo}>Guardar</button>
                      <button className="btn" style={{ marginLeft: 8 }} onClick={cancelarEdicion}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button className="btn" onClick={() => activarEdicion(p)}>Editar</button>
                      <button className="btn btn-danger" style={{ marginLeft: 8 }} onClick={() => eliminarPrestamo(p.id_prestamo)}>Eliminar</button>
                    </>
                  )}
                </td>
              </tr>
            ))}

            {prestamos.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>No hay préstamos registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Prestamos;
