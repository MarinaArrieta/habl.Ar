import axios from "axios";

// Base URL para el backend
const API = axios.create({ baseURL: "http://localhost:3000" });

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ==========================================================
// USUARIOS
// ==========================================================
export const registerPublic = (data) => API.post("/api/register-public", data);
export const login = (data) => API.post("/api/login", data);

// CORRECCIÓN 1: La ruta para obtener todos los usuarios es /api/usuarios
export const getUsuarios = () => API.get("/api/usuarios");

export const getUsuario = (id) => API.get(`/api/${id}`);
export const updateUsuario = (id, data) => API.put(`/api/${id}`, data);
export const deleteUsuario = (id) => API.delete(`/api/${id}`);

// NUEVA FUNCIÓN: Usa la ruta implementada para promover un usuario existente a admin.
// La ruta es /api/admin/register y espera el { id } del usuario en el body.
export const promoteUserToAdmin = (id) => API.post("/api/admin/register", { id });

// La función 'registerAdmin' original no es necesaria si solo promovemos por ID, 
// pero si la quieres conservar para un nuevo registro de admin:
// export const registerAdmin = (data) => API.post("/api/register-admin", data);


// ==========================================================
// TÉCNICAS
// ==========================================================
export const getTecnicas = () => API.get("/tecnicas");
export const getTecnica = (id) => API.get(`/tecnicas/${id}`);
export const createTecnica = (data) => API.post("/tecnicas", data);
export const updateTecnica = (id, data) => API.put(`/tecnicas/${id}`, data);
export const deleteTecnica = (id) => API.delete(`/tecnicas/${id}`);

export default API;

