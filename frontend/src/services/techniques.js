const API_URL = "http://localhost:3000/tecnicas";
// ⚠️ Nota: Asegúrate de que tu backend esté configurado para responder en el puerto 3000

/**
 * Trae todas las técnicas desde la API (público)
 */
export const fetchTecnicas = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error fetching tecnicas");
    return await response.json();
  } catch (error) {
    console.error("Error fetching tecnicas:", error);
    return [];
  }
};

/**
 * ✅ NUEVA FUNCIÓN: Trae técnicas filtradas por el slug de categoría (público)
 */
export const getTecnicasPorTipo = async (slug) => {
  try {
    // La URL de la API debe incluir el slug para que el backend filtre:
    // Ejemplo: http://localhost:3000/tecnicas/tipo/respiracion-consciente
    const response = await fetch(`${API_URL}/tipo/${slug}`);
    
    if (!response.ok) throw new Error(`Error fetching técnicas de la categoría ${slug}`);
    
    // Asumimos que el backend devuelve un objeto que contiene los datos: { ok: true, data: [...] }
    return await response.json(); 
  } catch (error) {
    console.error("Error fetching tecnicas por tipo:", error);
    // Devolvemos una estructura consistente en caso de error
    return { data: [] }; 
  }
};


/**
 * Trae una técnica por su ID (público)
 */
export const fetchTecnicaById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Error fetching tecnica");
    return await response.json();
  } catch (error) {
    console.error("Error fetching tecnica:", error);
    return null;
  }
};

/**
 * Crear técnica (solo admin)
 */
export const createTecnica = async (data) => {
  try {
    // ⚠️ Mejor práctica: Evitar localStorage. Utiliza tu UserContext para obtener el token.
    const token = localStorage.getItem("token"); 
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error creando técnica");
    return await response.json();
  } catch (error) {
    console.error("Error creando técnica:", error);
    return null;
  }
};

/**
 * Actualizar técnica (solo admin)
 */
export const updateTecnica = async (id, data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error actualizando técnica");
    return await response.json();
  } catch (error) {
    console.error("Error actualizando técnica:", error);
    return null;
  }
};

/**
 * Eliminar técnica (solo admin)
 */
export const deleteTecnica = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Error eliminando técnica");
    return await response.json();
  } catch (error) {
    console.error("Error eliminando técnica:", error);
    return null;
  }
};