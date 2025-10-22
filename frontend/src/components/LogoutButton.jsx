import { Button } from "@chakra-ui/react";
import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../context/UserContext";

export default function LogoutButton() {
  const { setUsuario } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    setUsuario(null);

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