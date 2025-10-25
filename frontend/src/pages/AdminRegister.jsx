/* import { useState, useEffect } from "react";
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
import { FaTrashAlt } from "react-icons/fa";

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
      <Heading fontSize="1.3rem" color="orange.50" mb={3} textAlign="center">Registro de Administradores</Heading>

      {loading ? (
        <HStack justifyContent="center" py={10}>
          <Spinner size="xl" />
          <Text ml={3}>Cargando lista de usuarios...</Text>
        </HStack>
      ) : (
        <Table variant="simple" size="sm">
          <Thead bg="orange.200">
            <Tr>
              <Th color="#F0DCC9">ID</Th>
              <Th color="#F0DCC9">Nombre</Th>
              <Th color="#F0DCC9">Email</Th>
              <Th color="#F0DCC9">Tipo</Th>
              <Th color="#F0DCC9">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody bg="orange.100">
            {usuarios.map((user) => (
              <Tr key={user.id}>
                <Td color="orange.200">{user.id}</Td>
                <Td color="orange.200">{user.nombre} {user.apellido}</Td>
                <Td color="orange.200">{user.email}</Td>
                <Td color="orange.200">
                  <Badge colorScheme={getBadgeColor(user.tipo)}>
                    {user.tipo}
                  </Badge>
                </Td>
                <Button
                  size="sm"
                  colorScheme="red"
                  leftIcon={<FaTrashAlt />}
                  onClick={() => handleDelete(user.id, user.nombre, user.apellido)}
                >
                  Eliminar
                </Button>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
} */


import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, Link as RouterLink, Navigate } from "react-router-dom";
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
  VStack,
  // Se elimina Toast de las importaciones de Chakra, ya que no es un componente de UI directo
} from "@chakra-ui/react";
import axios from "axios";
// Se eliminó la importación de "react-icons/fa" para evitar errores de compilación

// ==========================================================
// CONSTANTES Y FUNCIONES DE API
// ==========================================================

const ADMIN_PROTEGIDO_EMAIL = "admin@ejemplo.com";

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
    const response = await axios.get("/api/usuarios", getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

// FUNCIÓN: Eliminar un usuario (DELETE /api/usuarios/:id)
const deleteUsuario = async (id) => {
  try {
    // Usamos DELETE al endpoint con el ID en la URL.
    const response = await axios.delete(`/api/usuarios/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
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

// ==========================================================
// COMPONENTE PRINCIPAL
// ==========================================================

export default function AdminRegister() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  // *** CORRECCIÓN CLAVE: Estabilizar la referencia de usuarioActual con useMemo ***
  const usuarioActual = useMemo(() => {
    // Leemos de localStorage y parseamos solo una vez
    return JSON.parse(localStorage.getItem("usuario") || "null");
  }, []); // Dependencia vacía para que solo se calcule al montar el componente

  // CORRECCIÓN CLAVE: Envolver cargarUsuarios en useCallback
  const cargarUsuarios = useCallback(async () => {
    // usuarioActual ahora tiene una referencia estable
    if (!usuarioActual || usuarioActual.tipo !== "admin") {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const data = await getUsuarios();

      if (Array.isArray(data)) {
        // Filtramos solo a los administradores
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
  }, [usuarioActual, navigate, toast]); // Dependencias estables

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]); // Ahora useEffect tiene una dependencia estable (cargarUsuarios)

  // MANEJADOR DE ELIMINACIÓN
  const handleDelete = async (id, nombre, apellido) => {
    // Se usa window.confirm para simular una alerta modal
    if (typeof window !== 'undefined' && !window.confirm(`¿Estás seguro de que quieres ELIMINAR permanentemente al administrador ${nombre} ${apellido} (ID: ${id})? Esta acción es irreversible.`)) {
      return;
    }

    try {
      await deleteUsuario(id);
      toast({
        title: "Administrador Eliminado",
        description: `El administrador ${nombre} ${apellido} ha sido eliminado.`,
        status: "success",
        duration: 3000,
        isClosable: true
      });
      cargarUsuarios(); // Recargar la lista
    } catch (error) {
      console.error("Error al eliminar administrador:", error);
      const message = error.response?.data?.error || "Ocurrió un error al intentar eliminar al administrador.";

      if (error.response && error.response.status === 403) {
        toast({
          title: "Acceso denegado",
          description: "Tu sesión no tiene permisos de administrador para esta acción.",
          status: "error",
          duration: 5000
        });
      } else {
        toast({
          title: "Error de eliminación",
          description: message,
          status: "error",
          duration: 5000
        });
      }
    }
  };

  const handlePromote = async (id, nombre) => {
    // ... (Tu lógica de promoción)
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
    <Box paddingTop="0" p={4}>
      <Heading fontSize="1.3rem" color="primary.700" mb={3} textAlign="center">Gestión de Administradores</Heading>
      <Text mb={4} textAlign="center" color="gray.600">
        Solo el administrador con el email **{ADMIN_PROTEGIDO_EMAIL}** no puede ser eliminado.
      </Text>

      {loading ? (
        <HStack justifyContent="center" py={10}>
          <Spinner size="xl" color="teal.500" />
          <Text ml={3}>Cargando lista de administradores...</Text>
        </HStack>
      ) : (
        <Box overflowX="auto" shadow="md" borderRadius="lg">
          <Table variant="simple" size="sm">
            <Thead bg="primary.700">
              <Tr>
                <Th color="#F0DCC9">ID</Th>
                <Th color="#F0DCC9">Nombre</Th>
                <Th color="#F0DCC9">Email</Th>
                <Th color="#F0DCC9">Tipo</Th>
                <Th color="#F0DCC9">Acciones</Th>
              </Tr>
            </Thead>
            <Tbody bg="yellow.50">
              {usuarios.map((user) => (
                <Tr key={user.id} _hover={{ bg: "gray.50" }}>
                  <Td maxW="120px" overflow="hidden" textOverflow="ellipsis">{user.id}</Td>
                  <Td>{user.nombre} {user.apellido}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <Badge colorScheme={getBadgeColor(user.tipo)}>
                      {user.tipo}
                    </Badge>
                  </Td>
                  {/* CORRECCIÓN: Asegurar que el botón está dentro de un Td */}
                  <Td>
                    {/* Lógica de Exclusión: Solo muestra el botón si el email NO es el protegido */}
                    {user.email !== ADMIN_PROTEGIDO_EMAIL ? (
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDelete(user.id, user.nombre, user.apellido)}
                      >
                        Eliminar
                      </Button>
                    ) : (
                      <Badge colorScheme="orange">
                        Protegido
                      </Badge>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
}


