import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:3000" });

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
export const promoteUserToAdmin = (id) => API.post("/api/admin/register", { id });

// TÉCNICAS
export const getTecnicas = () => API.get("/tecnicas");
export const getTecnica = (id) => API.get(`/tecnicas/${id}`);
export const createTecnica = (data) => API.post("/tecnicas", data);
export const updateTecnica = (id, data) => API.put(`/tecnicas/${id}`, data);
export const deleteTecnica = (id) => API.delete(`/tecnicas/${id}`);

export default API;

