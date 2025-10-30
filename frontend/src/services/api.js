import axios from "axios";
/* const API = axios.create({ baseURL: "https://habl-ar.onrender.com" }); */
const VERCEL_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://habl-ar.onrender.com";
const API = axios.create({ baseURL: VERCEL_BASE_URL });

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// USUARIOS
export const registerPublic = (data) => API.post("/api/register-public", data);
export const login = (data) => API.post("/api/login", data);
export const getUsuarios = () => API.get("/api/usuarios");
export const getUsuario = (id) => API.get(`/api/usuarios/${id}`);
export const updateUsuario = (id, data) => API.put(`/api/usuarios/${id}`, data);
export const deleteUsuario = (id) => API.delete(`/api/usuarios/${id}`);
/* export const promoteUserToAdmin = (id) => API.post("/api/admin/register", { id }); */
export const aprobarPsicologo = (id) => API.patch(`/api/usuarios/${id}/aprobar`);
// NUEVA FUNCIÓN PARA REGISTRAR ADMINISTRADORES CON DATOS COMPLETOS
/* export const registerAdminUser = (data) => API.post("/api/register-admin", data); */
export const registerAdminUser = (data) => API.post("/api/usuarios/register-admin", data);


// NUEVA FUNCIÓN para subir o actualizar la foto de perfil
// Recibe el ID del usuario y un objeto FormData que debe contener la imagen
export const uploadVolunteerProfilePicture = (id, formData) =>
    API.put(`/api/usuarios/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data", // Importante para enviar archivos
        },
    });

// TÉCNICAS
export const getTecnicas = () => API.get("/api/tecnicas");
export const getTecnica = (id) => API.get(`/api/tecnicas/${id}`);
export const createTecnica = (data) => API.post("/api/tecnicas", data);
export const updateTecnica = (id, data) => API.put(`/api/tecnicas/${id}`, data);
export const deleteTecnica = (id) => API.delete(`/api/tecnicas/${id}`);

export default API;

