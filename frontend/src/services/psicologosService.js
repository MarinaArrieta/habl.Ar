const API_BASE_URL = 'http://localhost:3000/api'; // Ruta base de la API: debe ser solo /api
const USERS_URL = `${API_BASE_URL}/usuarios`; // Entidad de usuarios

// Función auxiliar para manejar la autenticación
const getAuthHeaders = (extraHeaders = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
        'Content-Type': 'application/json',
        ...extraHeaders,
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

// Función auxiliar para manejar respuestas de fetch y errores JSON
const handleResponse = async (response) => {
    let data;
    try {
        data = await response.json();
    } catch (e) {
        // Si no es JSON (ej. 204 No Content), data será undefined
    }

    if (!response.ok) {
        // Si hay error en la respuesta HTTP (4xx o 5xx)
        const errorMessage = data?.error || data?.message || `Error del servidor: ${response.statusText}`;
        const error = new Error(errorMessage);
        // Adjuntamos la respuesta para que el componente React pueda leerla
        error.response = { data: { error: errorMessage } };
        throw error;
    }

    return data;
};

// ==========================================================
// USUARIOS
// ==========================================================

/**
 * Registra un nuevo usuario (común, psicólogo o voluntario).
 * RUTA: POST /api/usuarios/register-public
 */
export const registerPublic = async (formData) => {
    try {
        // Para FormData, no pasamos 'Content-Type', fetch lo maneja
        const response = await fetch(`${USERS_URL}/register-public`, {
            method: 'POST',
            body: formData,
        });
        return handleResponse(response);
    } catch (error) {
        console.error("Error en registerPublic:", error);
        throw error;
    }
};

/**
 * Inicia sesión de usuario.
 * RUTA: POST /api/usuarios/login
 */
export const login = async (data) => {
    try {
        const response = await fetch(`${USERS_URL}/login`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    } catch (error) {
        console.error("Error en login:", error);
        throw error;
    }
};

/**
 * Obtiene la lista completa de usuarios (para Admin).
 * RUTA: GET /api/usuarios
 */
export const getUsuarios = async () => {
    try {
        const response = await fetch(USERS_URL, { // Llama a /api/usuarios
            method: 'GET',
            headers: getAuthHeaders({ 'Content-Type': undefined }),
        });
        return handleResponse(response);
    } catch (error) {
        console.error("Error en getUsuarios:", error);
        throw error;
    }
};
/* export const getUsuario = async (id) => {
    try {
        const response = await fetch(`${USERS_URL}/${id}`, { 
            method: 'GET',
            headers: getAuthHeaders(), // <--- ⚠️ CLAVE: DEBE ENVIAR EL TOKEN
        });
        return handleResponse(response);
    } catch (error) {
        throw error;
    }
}; */

/**
 * Otorga el rol de 'admin' a un usuario.
 * RUTA: POST /api/usuarios/admin/register
 */
export const promoteUserToAdmin = async (id) => {
    try {
        const response = await fetch(`${USERS_URL}/admin/register`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ id }),
        });
        return handleResponse(response);
    } catch (error) {
        console.error("Error en promoteUserToAdmin:", error);
        throw error;
    }
};

/**
 * Aprueba la cuenta de un psicólogo pendiente (solo Admin).
 * RUTA: PATCH /api/usuarios/:id/aprobar
 */
export const aprobarPsicologo = async (id) => {
    try {
        const response = await fetch(`${USERS_URL}/${id}/aprobar`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    } catch (error) {
        console.error("Error en aprobarPsicologo:", error);
        throw error;
    }
};

/**
 * Obtiene la lista completa de psicólogos aprobados.
 * RUTA: GET /api/usuarios/psicologos
 */
export const getPsicologosList = async () => {
    try {
        const response = await fetch(`${USERS_URL}/psicologos`); // Llama a /api/usuarios/psicologos
        
        if (!response.ok) {
            throw new Error(`Error al cargar la lista de psicólogos: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en getPsicologosList:", error);
        throw error;
    }
};


// ==========================================================
// TÉCNICAS (Rutas futuras)
// ==========================================================
// const TECNICAS_URL = `${API_BASE_URL}/tecnicas`;
// export const getTecnicas = () => ...
