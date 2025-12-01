import { useState, useEffect } from "react";
import api from "../api/api";

export default function Autores() {
    // Estados para crear
    const [nombre, setNombre] = useState("");
    const [nacionalidad, setNacionalidad] = useState("");

    // Estados para listar
    const [autores, setAutores] = useState([]);

    // Estado para edición
    const [editando, setEditando] = useState(null);
    const [editNombre, setEditNombre] = useState("");
    const [editNacionalidad, setEditNacionalidad] = useState("");

    // Cargar datos al iniciar
    useEffect(() => {
        cargarAutores();
    }, []);

    const cargarAutores = async () => {
        try {
            const resp = await api.get("/autores/");
            // El backend devuelve objetos con la propiedad `id_autor`
            setAutores(resp.data);
        } catch (error) {
            console.log("Error al cargar autores", error);
        }
    };

    // Crear autor
    const crearAutor = async () => {
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
            alert("Error al crear autor");
        }
    };

    // Eliminar autor
    const eliminarAutor = async (id_autor) => {
        try {
            await api.delete(`/autores/${id_autor}`);
            alert("Autor eliminado");
            cargarAutores();
        } catch (error) {
            alert("Error al eliminar autor");
        }
    };

    // Activar modo edición
    const activarEdicion = (aut) => {
        setEditando(aut.id_autor);
        setEditNombre(aut.nombre);
        setEditNacionalidad(aut.nacionalidad);
    };

    // Guardar edición
    const actualizarAutor = async () => {
        try {
            await api.put(`/autores/${editando}`, {
                nombre: editNombre,
                nacionalidad: editNacionalidad,
            });

            alert("Autor actualizado");
            setEditando(null);
            cargarAutores();
        } catch (error) {
            alert("Error al actualizar autor");
        }
    };

    return (
        <div>
            <h2>Crear Autor</h2>

            {/* FORMULARIO CREAR */}
            <div>
                <label>Nombre:</label><br />
                <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                /><br /><br />

                <label>Nacionalidad:</label><br />
                <input
                    value={nacionalidad}
                    onChange={(e) => setNacionalidad(e.target.value)}
                /><br /><br />

                <button onClick={crearAutor}>Guardar</button>
            </div>

            <hr />

            {/* LISTADO */}
            <h2>Listado de Autores</h2>

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Nacionalidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {autores.map((aut) => (
                        <tr key={aut.id_autor}>
                            <td>{aut.id_autor}</td>

                            {/* NOMBRE */}
                            <td>
                                {editando === aut.id_autor ? (
                                    <input
                                        value={editNombre}
                                        onChange={(e) => setEditNombre(e.target.value)}
                                    />
                                ) : (
                                    aut.nombre
                                )}
                            </td>

                            {/* NACIONALIDAD */}
                            <td>
                                {editando === aut.id_autor ? (
                                    <input
                                        value={editNacionalidad}
                                        onChange={(e) => setEditNacionalidad(e.target.value)}
                                    />
                                ) : (
                                    aut.nacionalidad
                                )}
                            </td>

                            {/* BOTONES */}
                            <td>
                                {editando === aut.id_autor ? (
                                    <>
                                        <button onClick={actualizarAutor}>
                                            Guardar
                                        </button>

                                        <button onClick={() => setEditando(null)}>
                                            Cancelar
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => activarEdicion(aut)}>
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => eliminarAutor(aut.id_autor)}
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
