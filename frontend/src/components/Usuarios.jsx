import { useState, useEffect } from "react";
import api from "../api/api";

export default function Usuarios() {
    // Estados para crear
    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [fechaRegistro, setFechaRegistro] = useState("");

    // Estados para listar
    const [usuarios, setUsuarios] = useState([]);

    // Estado para edición
    const [editando, setEditando] = useState(null);
    const [editNombre, setEditNombre] = useState("");
    const [editDireccion, setEditDireccion] = useState("");
    const [editTelefono, setEditTelefono] = useState("");
    const [editCorreo, setEditCorreo] = useState("");
    const [editFechaRegistro, setEditFechaRegistro] = useState("");

    // Cargar datos al iniciar
    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            const resp = await api.get("/usuarios/");
            setUsuarios(resp.data);
        } catch (error) {
            console.log("Error al cargar usuarios", error);
        }
    };

    // Crear usuario
    const crearUsuario = async () => {
        try {
            await api.post("/usuarios/", {
                nombre,
                direccion,
                telefono,
                correo,
                fecha_registro: fechaRegistro || new Date().toISOString(),
            });

            alert("Usuario creado correctamente");

            setNombre("");
            setDireccion("");
            setTelefono("");
            setCorreo("");
            setFechaRegistro("");

            cargarUsuarios();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.detail || "Error al crear usuario");
        }
    };

    // Eliminar usuario
    const eliminarUsuario = async (id) => {
        try {
            await api.delete(`/usuarios/${id}`);
            alert("Usuario eliminado");
            cargarUsuarios();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.detail || "Error al eliminar usuario");
        }
    };

    // Activar modo edición
    const activarEdicion = (usuario) => {
        setEditando(usuario.id_usuario);
        setEditNombre(usuario.nombre);
        setEditDireccion(usuario.direccion || "");
        setEditTelefono(usuario.telefono || "");
        setEditCorreo(usuario.correo || "");
        // Normalizar fecha si viene en ISO
        setEditFechaRegistro(usuario.fecha_registro ? usuario.fecha_registro.split("T")[0] : "");
    };

    // Guardar edición
    const actualizarUsuario = async () => {
        try {
            await api.put(`/usuarios/${editando}`, {
                nombre: editNombre,
                direccion: editDireccion,
                telefono: editTelefono,
                correo: editCorreo,
                fecha_registro: editFechaRegistro || new Date().toISOString(),
            });

            alert("Usuario actualizado");
            setEditando(null);
            cargarUsuarios();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.detail || "Error al actualizar usuario");
        }
    };

    return (
        <div>
            <h2>Crear Usuario</h2>

            {/* FORMULARIO CREAR */}
            <div>
                <label>Nombre:</label><br />
                <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                /><br /><br />

                <label>Dirección:</label><br />
                <input
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                /><br /><br />

                <label>Teléfono:</label><br />
                <input
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                /><br /><br />

                <label>Correo:</label><br />
                <input
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                /><br /><br />

                <label>Fecha de registro:</label><br />
                <input
                    type="date"
                    value={fechaRegistro}
                    onChange={(e) => setFechaRegistro(e.target.value)}
                /><br /><br />

                <button onClick={crearUsuario}>Guardar</button>
            </div>

            <hr />

            {/* LISTADO */}
            <h2>Listado de Usuarios</h2>

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Teléfono</th>
                        <th>Correo</th>
                        <th>Fecha registro</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {usuarios.map((usr) => (
                        <tr key={usr.id_usuario}>
                            <td>{usr.id_usuario}</td>

                            {/* NOMBRE */}
                            <td>
                                {editando === usr.id_usuario ? (
                                    <input
                                        value={editNombre}
                                        onChange={(e) => setEditNombre(e.target.value)}
                                    />
                                ) : (
                                    usr.nombre
                                )}
                            </td>

                            {/* DIRECCION */}
                            <td>
                                {editando === usr.id_usuario ? (
                                    <input
                                        value={editDireccion}
                                        onChange={(e) => setEditDireccion(e.target.value)}
                                    />
                                ) : (
                                    usr.direccion
                                )}
                            </td>

                            {/* TELEFONO */}
                            <td>
                                {editando === usr.id_usuario ? (
                                    <input
                                        value={editTelefono}
                                        onChange={(e) => setEditTelefono(e.target.value)}
                                    />
                                ) : (
                                    usr.telefono
                                )}
                            </td>

                            {/* CORREO */}
                            <td>
                                {editando === usr.id_usuario ? (
                                    <input
                                        value={editCorreo}
                                        onChange={(e) => setEditCorreo(e.target.value)}
                                    />
                                ) : (
                                    usr.correo
                                )}
                            </td>

                            {/* FECHA REGISTRO */}
                            <td>
                                {editando === usr.id_usuario ? (
                                    <input
                                        type="date"
                                        value={editFechaRegistro}
                                        onChange={(e) => setEditFechaRegistro(e.target.value)}
                                    />
                                ) : (
                                    usr.fecha_registro ? usr.fecha_registro.split("T")[0] : ""
                                )}
                            </td>

                            {/* BOTONES */}
                            <td>
                                {editando === usr.id_usuario ? (
                                    <>
                                        <button onClick={actualizarUsuario}>
                                            Guardar
                                        </button>

                                        <button onClick={() => setEditando(null)}>
                                            Cancelar
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => activarEdicion(usr)}>
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => eliminarUsuario(usr.id_usuario)}
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
