import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const navigate = useNavigate();

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
    } finally {
      // Marcamos que la autenticación inicial ya terminó
      setAuthReady(true);
    }
  }, []);

  // Guardar usuario en localStorage cuando cambie
  /* useEffect(() => {
    if (usuario) {
      localStorage.setItem("usuario", JSON.stringify(usuario));
    } else {
      localStorage.removeItem("usuario");
    }
  }, [usuario]); */
  // Cargar usuario desde localStorage de manera segura
  useEffect(() => {
    // ... [Tu código existente aquí] ...
    try {
      // ...
    } catch (err) {
      // ...
    } finally {
      setAuthReady(true);
    }
  }, []);

  // Guardar usuario en localStorage cuando cambie
  useEffect(() => {
    if (usuario) {
      localStorage.setItem("usuario", JSON.stringify(usuario));

      // 🛑 NUEVA LÓGICA DE REDIRECCIÓN AQUÍ 🛑
      if (usuario.tipo === "admin") {
        navigate("/admin-techniques");
      } else if (usuario.tipo === "psicologo") {
        navigate(`/psicologo/${usuario.id}`);
      } else if (usuario.tipo === "voluntario") {
        navigate(`/voluntario-perfil/${usuario.id}`);
      } else {
        navigate("/");
      }
    } else {
      localStorage.removeItem("usuario");
      // Si el usuario es null (ej. después de logout), lo enviamos a home o login
      navigate("/login");
    }
  }, [usuario, navigate]);

  // Objeto de valor del contexto
  const contextValue = {
    usuarioActual: usuario, // Renombrado para mayor claridad en el consumidor
    setUsuario,
    authReady, // Exportamos el estado de carga
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * Hook personalizado para consumir el contexto de usuario.
 * Esto soluciona el error "does not provide an export named 'useUser'".
 * En AdminUsersList.jsx ahora se importa: import { useUser } from '../../context/UserContext';
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe ser usado dentro de un UserProvider");
  }
  // NOTA: En AdminUsersList.jsx se desestructura como { usuarioActual }
  return context;
}
