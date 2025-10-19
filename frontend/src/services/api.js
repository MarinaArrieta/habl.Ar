import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Usuarios
export const registerPublic = (data) => API.post("/usuarios/register-public", data);
export const registerAdmin = (data) => API.post("/usuarios/register-admin", data);
export const login = (data) => API.post("/usuarios/login", data);

export const getUsuario = (id) => API.get(`/usuarios/${id}`);
export const updateUsuario = (id, data) => API.put(`/usuarios/${id}`, data);
export const deleteUsuario = (id) => API.delete(`/usuarios/${id}`);
export const getUsuarios = () => API.get("/usuarios");

// Técnicas
export const getTecnicas = () => API.get("/tecnicas");
export const getTecnica = (id) => API.get(`/tecnicas/${id}`);
export const createTecnica = (data) => API.post("/tecnicas", data);
export const updateTecnica = (id, data) => API.put(`/tecnicas/${id}`, data);
export const deleteTecnica = (id) => API.delete(`/tecnicas/${id}`);

export default API;