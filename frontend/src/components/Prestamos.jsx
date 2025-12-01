import { useState, useEffect } from "react";
import api from "../api/api";

function Prestamos() {
  // Selects
  const [usuarios, setUsuarios] = useState([]);
  const [libros, setLibros] = useState([]);

  // Crear
  const [usuarioId, setUsuarioId] = useState("");
  const [libroId, setLibroId] = useState("");
  const [fechaPrestamo, setFechaPrestamo] = useState("");
  const [fechaDevolucion, setFechaDevolucion] = useState("");
  const [estado, setEstado] = useState(""); // backend fuerza "PRESTADO" al crear, pero lo dejamos por si lo necesitas

  // Listado
  const [prestamos, setPrestamos] = useState([]);

  // Edición
  const [editando, setEditando] = useState(null);
  const [editUsuarioId, setEditUsuarioId] = useState("");
  const [editLibroId, setEditLibroId] = useState("");
  const [editFechaPrestamo, setEditFechaPrestamo] = useState("");
  const [editFechaDevolucion, setEditFechaDevolucion] = useState("");
  const [editEstado, setEditEstado] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const p = await api.get("/prestamos/");
      const u = await api.get("/usuarios/");
      const l = await api.get("/libros/");

      setPrestamos(p.data);
      setUsuarios(u.data);
      setLibros(l.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      alert("Error al cargar datos. Revisa la consola.");
    }
  };

  // Crear préstamo
  const crearPrestamo = async () => {
    try {
      await api.post("/prestamos/", {
        id_usuario: usuarioId ? parseInt(usuarioId, 10) : null,
        id_libro: libroId ? parseInt(libroId, 10) : null,
        fecha_prestamo: fechaPrestamo || null,
        fecha_devolucion: fechaDevolucion || null,
        estado: estado || undefined, // backend colocará "PRESTADO" por defecto
      });

      alert("Préstamo creado correctamente");
      setUsuarioId("");
      setLibroId("");
      setFechaPrestamo("");
      setFechaDevolucion("");
      setEstado("");
      cargarDatos();
    } catch (error) {
      console.error(error);
      // Si el backend devuelve detalle, mostrarlo
      const msg = error.response?.data?.detail || "Error al crear préstamo";
      alert(msg);
    }
  };

  // Eliminar préstamo
  const eliminarPrestamo = async (id_prestamo) => {
    try {
      await api.delete(`/prestamos/${id_prestamo}`);
      alert("Préstamo eliminado");
      cargarDatos();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.detail || "Error al eliminar préstamo";
      alert(msg);
    }
  };

  // Devolver préstamo (ruta específica)
  const devolverPrestamo = async (id_prestamo) => {
    try {
      await api.post(`/prestamos/${id_prestamo}/devolver`);
      alert("Libro devuelto correctamente");
      cargarDatos();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.detail || "Error al devolver préstamo";
      alert(msg);
    }
  };

  // Activar edición
  const activarEdicion = (p) => {
    setEditando(p.id_prestamo);
    setEditUsuarioId(p.id_usuario);
    setEditLibroId(p.id_libro);
    // si vienen fechas en ISO "YYYY-MM-DDTHH:MM:SS", las truncamos
    setEditFechaPrestamo(p.fecha_prestamo ? p.fecha_prestamo.split("T")[0] : "");
    setEditFechaDevolucion(p.fecha_devolucion ? p.fecha_devolucion.split("T")[0] : "");
    setEditEstado(p.estado || "");
  };

  // Guardar edición
  const actualizarPrestamo = async () => {
    try {
      await api.put(`/prestamos/${editando}`, {
        id_usuario: editUsuarioId ? parseInt(editUsuarioId, 10) : null,
        id_libro: editLibroId ? parseInt(editLibroId, 10) : null,
        fecha_prestamo: editFechaPrestamo || null,
        fecha_devolucion: editFechaDevolucion || null,
        estado: editEstado,
      });

      alert("Préstamo actualizado correctamente");
      setEditando(null);
      cargarDatos();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.detail || "Error al actualizar préstamo";
      alert(msg);
    }
  };

  return (
    <div>
      <h2>Crear Préstamo</h2>

      <div>
        <label>Usuario:</label><br />
        <select value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)}>
          <option value="">Seleccione</option>
          {usuarios.map((u) => (
            <option key={u.id_usuario} value={u.id_usuario}>
              {u.nombre}
            </option>
          ))}
        </select>
        <br /><br />

        <label>Libro:</label><br />
        <select value={libroId} onChange={(e) => setLibroId(e.target.value)}>
          <option value="">Seleccione</option>
          {libros.map((l) => (
            <option key={l.id_libro} value={l.id_libro}>
              {l.titulo ?? l.nombre ?? `Libro ${l.id_libro}`}
            </option>
          ))}
        </select>
        <br /><br />

        <label>Fecha de préstamo:</label><br />
        <input type="date" value={fechaPrestamo} onChange={(e) => setFechaPrestamo(e.target.value)} />
        <br /><br />

        <label>Fecha de devolución (opcional):</label><br />
        <input type="date" value={fechaDevolucion} onChange={(e) => setFechaDevolucion(e.target.value)} />
        <br /><br />

        <label>Estado (opcional):</label><br />
        <input value={estado} onChange={(e) => setEstado(e.target.value)} />
        <br /><br />

        <button onClick={crearPrestamo}>Guardar</button>
      </div>

      <hr />

      <h2>Listado de Préstamos</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Libro</th>
            <th>Fecha préstamo</th>
            <th>Fecha devolución</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {prestamos.map((p) => (
            <tr key={p.id_prestamo}>
              <td>{p.id_prestamo}</td>

              {/* Usuario */}
              <td>
                {editando === p.id_prestamo ? (
                  <select value={editUsuarioId} onChange={(e) => setEditUsuarioId(e.target.value)}>
                    {usuarios.map((u) => (
                      <option key={u.id_usuario} value={u.id_usuario}>
                        {u.nombre}
                      </option>
                    ))}
                  </select>
                ) : (
                  usuarios.find((u) => u.id_usuario === p.id_usuario)?.nombre ?? p.id_usuario
                )}
              </td>

              {/* Libro */}
              <td>
                {editando === p.id_prestamo ? (
                  <select value={editLibroId} onChange={(e) => setEditLibroId(e.target.value)}>
                    {libros.map((l) => (
                      <option key={l.id_libro} value={l.id_libro}>
                        {l.titulo ?? l.nombre ?? `Libro ${l.id_libro}`}
                      </option>
                    ))}
                  </select>
                ) : (
                  libros.find((l) => l.id_libro === p.id_libro)?.titulo ??
                  libros.find((l) => l.id_libro === p.id_libro)?.nombre ??
                  p.id_libro
                )}
              </td>

              {/* Fecha préstamo */}
              <td>
                {editando === p.id_prestamo ? (
                  <input type="date" value={editFechaPrestamo} onChange={(e) => setEditFechaPrestamo(e.target.value)} />
                ) : (
                  p.fecha_prestamo ? p.fecha_prestamo.split("T")[0] : "-"
                )}
              </td>

              {/* Fecha devolución */}
              <td>
                {editando === p.id_prestamo ? (
                  <input type="date" value={editFechaDevolucion} onChange={(e) => setEditFechaDevolucion(e.target.value)} />
                ) : (
                  p.fecha_devolucion ? p.fecha_devolucion.split("T")[0] : "-"
                )}
              </td>

              {/* Estado */}
              <td>
                {editando === p.id_prestamo ? (
                  <input value={editEstado} onChange={(e) => setEditEstado(e.target.value)} />
                ) : (
                  p.estado ?? "-"
                )}
              </td>

              {/* Acciones */}
              <td>
                {editando === p.id_prestamo ? (
                  <>
                    <button onClick={actualizarPrestamo}>Guardar</button>
                    <button onClick={() => setEditando(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => activarEdicion(p)}>Editar</button>
                    <button
                      onClick={() => eliminarPrestamo(p.id_prestamo)}
                      style={{ color: "red", marginLeft: 8 }}
                    >
                      Eliminar
                    </button>
                    {/* Mostrar devolver solo si está PRESTADO */}
                    {p.estado === "PRESTADO" && (
                      <button
                        onClick={() => devolverPrestamo(p.id_prestamo)}
                        style={{ marginLeft: 8 }}
                      >
                        Devolver
                      </button>
                    )}
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

export default Prestamos;
