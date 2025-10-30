/* const API_BASE_URL = 'http://localhost:3000/api'; */
const BASE_DOMAIN = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:3000';
const API_BASE_URL = `${BASE_DOMAIN}/api`;
const USERS_URL = `${API_BASE_URL}/usuarios`;
const PAYMENT_URL = `${API_BASE_URL}/mercadopago`;
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
        const errorMessage = data?.error || data?.message || `Error del servidor: ${response.statusText}`;
        const error = new Error(errorMessage);
        error.response = { data: { error: errorMessage } };
        throw error;
    }

    return data;
};

// USUARIOS

export const registerPublic = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios/register-public`, {
            method: 'POST',
            body: formData,
        });
        return handleResponse(response);
    } catch (error) {
        console.error("Error en registerPublic:", error);
        throw error;
    }
};

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

export const getUsuarios = async () => {
    try {
        const response = await fetch(USERS_URL, {
            method: 'GET',
            headers: getAuthHeaders({ 'Content-Type': undefined }),
        });
        return handleResponse(response);
    } catch (error) {
        console.error("Error en getUsuarios:", error);
        throw error;
    }
};

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

export const createPaymentPreference = async (paymentDetails) => {
    try {
        const response = await fetch(`${PAYMENT_URL}/preference`, {
            method: 'POST',
            headers: getAuthHeaders(), // Usa 'Content-Type': 'application/json' de getAuthHeaders
            body: JSON.stringify(paymentDetails),
        });
        // La respuesta del backend debe ser { preferenceId: 'ID_DE_MP' }
        return handleResponse(response);
    } catch (error) {
        console.error("Error en createPaymentPreference:", error);
        throw error;
    }
};

export const getPsicologosList = async () => {
    try {
        const response = await fetch(`${USERS_URL}/psicologos`);

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
