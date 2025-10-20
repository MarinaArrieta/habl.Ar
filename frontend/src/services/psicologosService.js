// Endpoint de tu API de Express para obtener la lista de psicólogos
// Si tu backend y frontend están en el mismo host, puedes omitir el dominio.
const API_URL = 'http://localhost:3000/api/psicologos'; 

/**
 * Obtiene la lista completa de psicólogos aprobados del backend (Express).
 * @returns {Promise<Array>} Lista de objetos de psicólogos.
 */
export const getPsicologosList = async () => {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            // Manejar errores HTTP 
            throw new Error(`Error al cargar la lista de psicólogos: ${response.statusText}`);
        }

        const data = await response.json();
        return data; // Array de psicólogos
    } catch (error) {
        console.error("Error en getPsicologosList:", error);
        throw error;
    }
};