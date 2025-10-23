import { useState, useEffect } from 'react'; 
import { getPsicologosList } from '../services/psicologosService';

/**
 * Hook personalizado para obtener la lista de psicólogos.
 * Gestiona el estado de carga y errores de la llamada al backend.
 * @returns {{psicologos: Array, isLoading: boolean, error: string | null, refetch: Function}}
 */
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