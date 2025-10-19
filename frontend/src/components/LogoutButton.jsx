import { Button } from "@chakra-ui/react";
import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../context/UserContext";

export default function LogoutButton() {
  const { setUsuario } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Limpiar storage (token y usuario)
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    // 2. Resetear el contexto
    setUsuario(null);

    // 3. Redirigir al login
    navigate("/login");
  };

  return (
    <Button
      onClick={handleLogout}
      colorScheme="red"
      size="sm"
      variant="outline"
    >
      Cerrar sesión
    </Button>
  );
}