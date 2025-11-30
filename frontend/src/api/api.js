import axios from "axios";

/**
 * CONFIGURACIÓN
 * Cambia API_URL si tu FastAPI corre en otra URL/puerto.
 */
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adjuntar token (si existe) en Authorization
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token"); // ajuste según tu almacenamiento
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // no hacer nada si no hay localStorage (p.ej. SSR)
  }
  return config;
}, (error) => Promise.reject(error));

// Manejo uniforme de errores para mostrar mensajes en español
const manejarError = (error) => {
  if (!error) throw new Error("Error desconocido");
  if (error.response) {
    // Errores que vienen del servidor
    const status = error.response.status;
    const data = error.response.data;
    const mensaje = data?.detail || data?.message || JSON.stringify(data) || error.message;
    const err = new Error(`Error ${status}: ${mensaje}`);
    err.status = status;
    throw err;
  } else if (error.request) {
    throw new Error("No se recibió respuesta del servidor. Comprueba la conexión.");
  } else {
    throw new Error(error.message);
  }
};

// -----------------------------
// AUTENTICACIÓN (auth)
// -----------------------------
export const iniciarSesion = async (credenciales) => {
  // credenciales: {email, password} o {username, password}
  try {
    const res = await api.post("/auth/login", credenciales);
    return res.data;
  } catch (error) {
    manejarError(error);
  }
};

export const registrarUsuario = async (datosUsuario) => {
  try {
    const res = await api.post("/auth/register", datosUsuario);
    return res.data;
  } catch (error) {
    manejarError(error);
  }
};

export const obtenerPerfil = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (error) {
    manejarError(error);
  }
};

// -----------------------------
// USUARIOS
// -----------------------------
export const listarUsuarios = async (params = {}) => {
  // params: {page, limit, q}
  try {
    const res = await api.get("/usuarios", { params });
    return res.data;
  } catch (error) {
    manejarError(error);
  }
};

export const obtenerUsuario = async (usuarioId) => {
  try {
    const res = await api.get(`/usuarios/${usuarioId}`);
    return res.data;
  } catch (error) {
    manejarError(error);
  }
};

export const crearUsuario = async (usuarioData) => {
  try {
    const res = await api.post("/usuarios", usuarioData);
    return res.data;
  } catch (error) {
    manejarError(error);
  }
};

export const actualizarUsuario = async (usuarioId, usuarioData) => {
  try {
    const res = await api.put(`/usuarios/${usuarioId}`, usuarioData);
    return res.data;
  } catch (error) {
    manejarError(error);
  }
};

export const eliminarUsuario = async (usuarioId) => {
  try {
    const res = await api.delete(`/usuarios/${usuarioId}`);
    return res.data;
  } catch (error) {
    manejarError(error);
  }
};

// -----------------------------
// LIBROS
// -----------------------------
export const listarLibros = async (params = {}) => {
  // params: {page, limit, autor, titulo, categoria}
  try {
    const res = await api.get("/libros", { params });
    return res.data;
  } catch (error) {
    manejarError(error);
  }
};

export const obtenerLibro = async (libroId) => {
  try {
    const res = await api.get(`/libros/${libroId}`);
    return res.data;
  } catch (error) {
    manejarError(error);
  }
};

export const crearLibro = async (libroData) => {
  try {
    const res = await api.post("/libros", libroData);
    return res.data;
  } catch (error) {
    manejarError(error);
  }
};

export const actualizarLibro = async (libroId, libroData) => {
  try {
    const res = await api.put(`/libros/${libroId}`, libroData);
    return res.data;
  } catch (error) {
    manejarError(error);
  }
};

export const eliminarLibro = async (libroId) => {
  try {
    const res = await api.delete(`/libros/${libroId}`);
    return res.data;
  } catch (error) {
    manejarError(error);
  }
};

// -----------------------------
// PRÉSTAMOS
// -----------------------------
export const listarPrestamos = async (params = {}) => {
  // params: {usuarioId, estado, fecha_inicio, fecha_fin}
  try {
    const res = await api.get("/prestamos", { params });
    return res.data;
  } catch (error) {
    manejarError(error);
  }
};

export const crearPrestamo = async (prestamoData) => {
  // prestamoData: {usuario_id, libro_id, fecha_prestamo, fecha_devolucion_estimada}
  try {
    const res = await api.post("/prestamos", prestamoData);
    return res.data;
  } catch (error) {
    manejarError(error);
  }
};

export const devolverPrestamo = async (prestamoId, datos = {}) => {
  // datos opcionales: {fecha_devolucion_real, multa}
  try {
    const res = await api.post(`/prestamos/${prestamoId}/devolver`, datos);
    return res.data;
  } catch (error) {
    manejarError(error);
  }
};

export const eliminarPrestamo = async (prestamoId) => {
  try {
    const res = await api.delete(`/prestamos/${prestamoId}`);
    return res.data;
  } catch (error) {
    manejarError(error);
  }
};

// -----------------------------
// BÚSQUEDAS Y FILTROS
// -----------------------------
export const buscarLibros = async (query, params = {}) => {
  // query: texto a buscar; params: {page, limit, categoria, autor}
  try {
    const res = await api.get("/libros/search", { params: { q: query, ...params } });
    return res.data;
  } catch (error) {
    manejarError(error);
  }
};

// -----------------------------
// CATEGORÍAS
// -----------------------------
export const listarCategorias = async () => {
  try {
    const res = await api.get("/categorias");
    return res.data;
  } catch (error) {
    manejarError(error);
  }
};

export const crearCategoria = async (categoriaData) => {
  try {
    const res = await api.post("/categorias", categoriaData);
    return res.data;
  } catch (error) {
    manejarError(error);
  }
};

// -----------------------------
// SUBIDA DE ARCHIVOS (portada, PDF, avatar)
// -----------------------------
export const subirArchivo = async (archivo, campo = "file") => {
  // archivo: File (from <input type="file">)
  // campo: nombre del campo esperado por el backend
  try {
    const form = new FormData();
    form.append(campo, archivo);

    const res = await api.post("/uploads", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    manejarError(error);
  }
};

// -----------------------------
// UTILIDADES
// -----------------------------
export const ping = async () => {
  try {
    const res = await api.get("/ping");
    return res.data;
  } catch (error) {
    manejarError(error);
  }
};

// Exportar instancia por si se necesita usar directamente
export { api };

// Export por defecto (opcional)
export default {
  // auth
  iniciarSesion,
  registrarUsuario,
  obtenerPerfil,
  // usuarios
  listarUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  // libros
  listarLibros,
  obtenerLibro,
  crearLibro,
  actualizarLibro,
  eliminarLibro,
  // prestamos
  listarPrestamos,
  crearPrestamo,
  devolverPrestamo,
  eliminarPrestamo,
  // busquedas y categorias
  buscarLibros,
  listarCategorias,
  crearCategoria,
  // uploads
  subirArchivo,
  // util
  ping,
};