import { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  HStack,
  Heading,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Obtener todos los usuarios (GET /api/usuarios)
const getUsuarios = async () => {
  try {
    /* const response = await axios.get("/api", getAuthHeaders()); */
    const response = await axios.get("/api/usuarios", getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

// Promover un usuario a administrador (POST /api/admin/register)
const promoteUserToAdmin = async (id) => {
  try {
    const response = await axios.post("/api/admin/register", { id }, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error al promover a administrador:", error);
    throw error;
  }
};

export default function AdminRegister() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();
  const usuarioActual = JSON.parse(localStorage.getItem("usuario"));

  const cargarUsuarios = async () => {
    if (!usuarioActual || usuarioActual.tipo !== "admin") {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const data = await getUsuarios();

      if (Array.isArray(data)) {

        const administradores = data.filter(user => user.tipo === 'admin');
        setUsuarios(administradores);

      } else {
        setUsuarios([]);
      }
    } catch (error) {
      console.error("Error al obtener la lista de usuarios:", error);
      const message = error.response?.data?.error || "No se pudo cargar la lista de usuarios. Asegúrate que el backend esté funcionando y la ruta /api/usuarios esté implementada.";
      toast({
        title: "Error de carga",
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handlePromote = async (id, nombre) => {

    if (!window.confirm(`¿Estás seguro de que quieres promover a ${nombre} (ID: ${id}) a Administrador?`)) {
      return;
    }

    try {
      await promoteUserToAdmin(id);
      toast({
        title: "Promoción exitosa",
        description: `${nombre} es ahora administrador.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      cargarUsuarios();
    } catch (error) {
      console.error("Error al promover a admin:", error);
      const message = error.response?.data?.error || "Ocurrió un error al intentar promover al usuario.";
      toast({
        title: "Error de promoción",
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getBadgeColor = (tipo) => {
    switch (tipo) {
      case 'admin': return 'purple';
      case 'psicologo': return 'blue';
      case 'voluntario': return 'teal';
      default: return 'gray';
    }
  };

  return (
    <Box paddingTop="0">
      <Heading mb={5}>Registro y Promoción de Administradores</Heading>
      <Text mb={4}>Aquí puedes ver **solo** los usuarios que actualmente tienen el rol de **administrador**.</Text>

      {loading ? (
        <HStack justifyContent="center" py={10}>
          <Spinner size="xl" />
          <Text ml={3}>Cargando lista de usuarios...</Text>
        </HStack>
      ) : (
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Nombre</Th>
              <Th>Email</Th>
              <Th>Tipo</Th>
              {/* <Th>Estado Aprobación</Th> */}
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {usuarios.map((user) => (
              <Tr key={user.id}>
                <Td>{user.id}</Td>
                <Td>{user.nombre} {user.apellido}</Td>
                <Td>{user.email}</Td>
                <Td>
                  <Badge colorScheme={getBadgeColor(user.tipo)}>
                    {user.tipo}
                  </Badge>
                </Td>
                {/* <Td>{user.estado_aprobacion}</Td> */}
                <Td>
                  {user.tipo !== 'admin' ? (
                    <Button
                      size="sm"
                      colorScheme="purple"
                      onClick={() => handlePromote(user.id, user.nombre)}
                    >
                      Promover a Admin
                    </Button>
                  ) : (
                    <Text color="purple.500" fontWeight="bold">Admin</Text>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}