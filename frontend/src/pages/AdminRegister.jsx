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
  FormControl,
  FormLabel,
  Input,
  Card,
  CardBody,
  CardHeader
} from "@chakra-ui/react";
import axios from "axios";

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
    const response = await axios.delete(`/api/usuarios/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
};

// FUNCIÓN: Registrar nuevo administrador (POST /api/usuarios/register-admin)
const registerAdminUser = async (adminData) => {
  try {
    const registrationUrl = `/api/usuarios/register-admin`;
    const response = await axios.post(registrationUrl, adminData, getAuthHeaders());

    return response.data;
  } catch (error) {
    console.error("Error al registrar administrador:", error);
    throw error;
  }
};

function AdminRegistrationForm({ cargarUsuarios }) {
  const toast = useToast();
  const [formState, setFormState] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formState.nombre || !formState.email || !formState.password) {
        throw new Error("Por favor, completa todos los campos requeridos (Nombre, Email, Contraseña).");
      }

      await registerAdminUser(formState);

      toast({
        title: "Administrador Registrado",
        description: `El nuevo administrador ${formState.email} ha sido creado exitosamente.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setFormState({ nombre: "", apellido: "", email: "", password: "" });
      cargarUsuarios();
    } catch (error) {
      console.error("Error en el registro:", error);
      const message = error.message || error.response?.data?.error || "Ocurrió un error al intentar registrar al nuevo administrador.";

      toast({
        title: "Error de Registro",
        description: message,
        status: "error",
        duration: 7000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card mb={8} p={4} borderRadius="xl" shadow="lg" bg="formu.50" className="admin-form-card">
      <CardHeader pb={2}>
        <Heading size="md" color="orange.200">Registrar Nuevo Administrador</Heading>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <HStack spacing={4} mb={4}>
            <FormControl id="nombre" isRequired>
              <FormLabel fontSize="sm" color="orange.200">Nombre</FormLabel>
              <Input
                name="nombre"
                value={formState.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                size="sm"
                borderColor="orange.50"
                _hover={{
                  boxShadow: "0 0 0 1px #f9a66f",
                }}
                _focusVisible={{
                  boxShadow: "0 0 0 1px #DA5700",
                  borderColor: "#DA5700"
                }}
              />
            </FormControl>
            <FormControl id="apellido">
              <FormLabel fontSize="sm" color="orange.200">Apellido</FormLabel>
              <Input
                name="apellido"
                value={formState.apellido}
                onChange={handleChange}
                placeholder="Apellido (opcional)"
                size="sm"
                borderColor="orange.50"
                _hover={{
                  boxShadow: "0 0 0 1px #f9a66f",
                }}
                _focusVisible={{
                  boxShadow: "0 0 0 1px #DA5700",
                  borderColor: "#DA5700"
                }}
              />
            </FormControl>
          </HStack>
          <FormControl id="email" isRequired mb={4}>
            <FormLabel fontSize="sm" color="orange.200">Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              size="sm"
              borderColor="orange.50"
              _hover={{
                boxShadow: "0 0 0 1px #f9a66f",
              }}
              _focusVisible={{
                boxShadow: "0 0 0 1px #DA5700",
                borderColor: "#DA5700"
              }}
            />
          </FormControl>
          <FormControl id="password" isRequired mb={6}>
            <FormLabel fontSize="sm" color="orange.200">Contraseña</FormLabel>
            <Input
              name="password"
              type="password"
              value={formState.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              size="sm"
              borderColor="orange.50"
              _hover={{
                boxShadow: "0 0 0 1px #f9a66f",
              }}
              _focusVisible={{
                boxShadow: "0 0 0 1px #DA5700",
                borderColor: "#DA5700"
              }}
            />
          </FormControl>
          <Box display="flex" justifyContent="end">
            <Button
              type="submit"
              variant='solid3D'
              colorScheme='primary'
              isLoading={isSubmitting}
              loadingText="Registrando..."
            >
              Registrar Administrador
            </Button>
          </Box>
        </form>
      </CardBody>
    </Card>
  );
}

export default function AdminRegister() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  const usuarioActual = useMemo(() => {
    return JSON.parse(localStorage.getItem("usuario") || "null");
  }, []);

  const cargarUsuarios = useCallback(async () => {
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
  }, [usuarioActual, navigate, toast]);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  // MANEJADOR DE ELIMINACIÓN
  const handleDelete = async (id, nombre, apellido) => {
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
      cargarUsuarios();
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

  const getBadgeColor = (tipo) => {
    switch (tipo) {
      case 'admin': return 'purple';
      case 'psicologo': return 'blue';
      case 'voluntario': return 'teal';
      default: return 'gray';
    }
  };

  return (
    <Box paddingTop="0" p={4} maxW="container.xl" mx="auto">
      <Heading fontSize="1.3rem" color="orange.50" mb={6} textAlign="center">Gestión de Administradores</Heading>
      <AdminRegistrationForm cargarUsuarios={cargarUsuarios} />
      <Text fontSize="1.3rem" fontWeight="700" mb={4} mt={8} color="orange.200">Lista de Técnicas Registradas</Text>

      {loading ? (
        <HStack justifyContent="center" py={10}>
          <Spinner size="xl" color="teal.500" />
          <Text ml={3}>Cargando lista de administradores...</Text>
        </HStack>
      ) : (
        <Box overflowX="auto" shadow="md" borderRadius="lg">
          <Table variant="simple" size="sm">
            <Thead bg="orange.50">
              <Tr>
                <Th color="#F0DCC9">ID</Th>
                <Th color="#F0DCC9">Nombre</Th>
                <Th color="#F0DCC9">Email</Th>
                <Th color="#F0DCC9">Tipo</Th>
                <Th color="#F0DCC9">Acciones</Th>
              </Tr>
            </Thead>
            <Tbody bg="orange.300">
              {usuarios.map((user) => (
                <Tr key={user.id} _hover={{ bg: "gray.50" }}>
                  <Td maxW="120px" overflow="hidden" textOverflow="ellipsis" color="orange.200">{user.id}</Td>
                  <Td color="orange.200">{user.nombre} {user.apellido}</Td>
                  <Td color="orange.200">{user.email}</Td>
                  <Td color="orange.200">
                    <Badge colorScheme={getBadgeColor(user.tipo)}>
                      {user.tipo}
                    </Badge>
                  </Td>
                  <Td color="orange.200">
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
                      <Badge colorScheme="green">
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



