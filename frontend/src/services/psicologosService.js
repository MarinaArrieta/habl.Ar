/* const API_BASE_URL = 'http://localhost:3000/api/usuarios';  */
const API_BASE_URL = 'http://localhost:3000/api/usuarios';
// NOTA: Cambié API_URL a API_BASE_URL y la ajusté a la ruta base de usuarios 
//       para que coincida con las rutas de Express proporcionadas (Fragmento 1).

/**
 * Obtiene la lista completa de psicólogos aprobados del backend (Express).
 * RUTA: GET /api/usuarios/psicologos
 * @returns {Promise<Array>} Lista de objetos de psicólogos.
 */
export const getPsicologosList = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/psicologos`);
        
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

/**
 * Registra un nuevo usuario (común, psicólogo o voluntario).
 * RUTA: POST /api/usuarios/register-public
 * * @param {FormData} formData - Los datos del formulario, incluyendo campos de texto y archivos binarios.
 * @returns {Promise<object>} Los datos de respuesta del servidor (token, usuario, etc.).
 */
export const registerPublic = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/register-public`, {
            method: 'POST',
            // NO establezcas Content-Type: 'multipart/form-data'. 
            // La función fetch lo establece automáticamente (con el 'boundary' correcto) 
            // cuando el body es un objeto FormData.
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            // Si la respuesta no es 2xx, el servidor probablemente devolvió un error JSON
            // con un campo 'error' o 'message'.
            const errorMessage = data.error || data.message || `Error del servidor: ${response.statusText}`;
            const error = new Error(errorMessage);
            // Adjuntamos la respuesta para que el componente React pueda leerla
            error.response = { data: { error: errorMessage } }; 
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Error en registerPublic:", error);
        throw error;
    }
};