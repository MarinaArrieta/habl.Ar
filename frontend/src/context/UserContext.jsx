import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  // Cargar usuario desde localStorage de manera segura
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("usuario");
      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        setUsuario(JSON.parse(storedUser));
      } else {
        localStorage.removeItem("usuario"); // limpia valores inválidos
      }
    } catch (err) {
      console.error("Error leyendo usuario desde localStorage:", err);
      localStorage.removeItem("usuario"); // limpia si JSON.parse falla
    }
  }, []);

  // Guardar usuario en localStorage cuando cambie
  useEffect(() => {
    if (usuario) {
      localStorage.setItem("usuario", JSON.stringify(usuario));
    } else {
      localStorage.removeItem("usuario");
    }
  }, [usuario]);

  return (
    <UserContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UserContext.Provider>
  );
}