/* import { useState, useEffect } from 'react';
import { getPsicologosList } from '../services/psicologosService';


@returns {{psicologos: Array, isLoading: boolean, error: string | null, refetch: Function}}

export const usePsicologos = () => {

    const [psicologos, setPsicologos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    const fetchPsicologos = async () => {
        setIsLoading(true);
        setError(null);
        try {
            
            const data = await getPsicologosList();
            setPsicologos(data);
        } catch (err) {
            console.error("Error en usePsicologos:", err);
            setError("No se pudo cargar la lista de profesionales. Verifique la conexión.");
            setPsicologos([]); 
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchPsicologos();
    }, []); 


    return { psicologos, isLoading, error, refetch: fetchPsicologos };
};



const { psicologos, isLoading, error } = usePsicologos();  */

// 🚨 Cambiamos la importación estándar para obligar a usar el módulo principal
// Utilizamos la ruta absoluta que ya definimos en vite.config.js
import { useState, useEffect } from 'react'; 
// DEBE QUEDAR ASÍ:
// import { useState, useEffect } from 'react';

// Si lo anterior sigue fallando, vamos a usar una solución de "importar de un punto central"
// Para la prueba, usa la importación estándar primero. Si falla, el problema es global.

import { getPsicologosList } from '../services/psicologosService';

/**
 * Hook personalizado para obtener la lista de psicólogos.
 * Gestiona el estado de carga y errores de la llamada al backend.
 * @returns {{psicologos: Array, isLoading: boolean, error: string | null, refetch: Function}}
 */
export const usePsicologos = () => {
    // 1. Estados de la Data y UI
    const [psicologos, setPsicologos] = useState([]);
    // ... el resto del archivo es el mismo
    // [resto del código sin cambios]
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. Función de Fetch
    const fetchPsicologos = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Llama al servicio que hace el fetch a la API
            const data = await getPsicologosList();
            setPsicologos(data);
        } catch (err) {
            console.error("Error en usePsicologos:", err);
            setError("No se pudo cargar la lista de profesionales. Verifique la conexión.");
            setPsicologos([]); 
        } finally {
            setIsLoading(false);
        }
    };

    // 3. Ejecutar el fetch al montar el componente
    useEffect(() => {
        fetchPsicologos();
    }, []); 

    // 4. Retornar los datos y funciones para el componente
    return { psicologos, isLoading, error, refetch: fetchPsicologos };
};