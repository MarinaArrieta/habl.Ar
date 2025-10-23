import { createContext, useState, useEffect, useContext, useCallback } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [usuario, setUsuarioState] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const setUsuario = useCallback((newUsuario) => {
    if (newUsuario) {
      localStorage.setItem("usuario", JSON.stringify(newUsuario));
    } else {
      localStorage.removeItem("usuario");
    }
    setUsuarioState(newUsuario);
  }, []);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("usuario");

      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        setUsuarioState(JSON.parse(storedUser));
      } else {
        localStorage.removeItem("usuario");
        setUsuarioState(null);
      }
    } catch (err) {
      console.error("Error leyendo usuario desde localStorage:", err);
      localStorage.removeItem("usuario");
      setUsuarioState(null);
    } finally {
      setAuthReady(true);
    }
  }, [setUsuario]);

  const contextValue = {
    usuarioActual: usuario,
    setUsuario,
    authReady,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe ser usado dentro de un UserProvider");
  }
  return context;
}
