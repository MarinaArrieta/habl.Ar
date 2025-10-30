import { useUser } from '../context/UserContext';
import { useState, useEffect, useCallback } from "react";
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
    VStack, // Importamos VStack para organizar los botones
} from "@chakra-ui/react";
import axios from "axios";
import { FaUserPlus, FaCheckCircle, FaTrashAlt } from "react-icons/fa"; // Importamos FaTrashAlt

// ==========================================================
// FUNCIONES DE API INTEGRADAS
// ==========================================================

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
        const response = await axios.get("https://habl-ar.onrender.com/api/usuarios", getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        throw error;
    }
};

// NUEVA FUNCIÓN: Eliminar un usuario (DELETE /api/usuarios/:id)
const deleteUsuario = async (id) => {
    try {
        // Usamos DELETE al endpoint con el ID en la URL.
        const response = await axios.delete(`https://habl-ar.onrender.com/api/usuarios/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        throw error;
    }
};

// Promover un usuario a administrador (POST /api/admin/register)
/* const promoteUserToAdmin = async (id) => {
    // ... (función comentada, se mantiene por contexto)
}; */

// NUEVA FUNCIÓN: Aprobar un psicólogo (PUT /api/usuarios/approve-psicologo/:id)
const aprobarPsicologo = async (id) => {
    try {
        const response = await axios.put(`https://habl-ar.onrender.com/api/usuarios/approve-psicologo/${id}`, {}, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error al aprobar psicólogo:", error);
        throw error;
    }
};

// ==========================================================
// COMPONENTE PRINCIPAL
// ==========================================================

export default function AdminUsersList() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const navigate = useNavigate();

    // Obtenemos el usuario actual
    const { usuarioActual } = useUser();
    const userFromStorage = JSON.parse(localStorage.getItem("usuario"));
    const finalUser = usuarioActual || userFromStorage;


    // Usamos useCallback para memoizar la función de carga
    const cargarUsuarios = useCallback(async () => {
        // Chequeo de seguridad: Redirigir si no es admin
        if (!finalUser || finalUser.tipo !== "admin") {
            navigate("/login");
            return;
        }

        try {
            setLoading(true);
            const data = await getUsuarios();

            if (Array.isArray(data)) {
                // FILTRO CLAVE: Mostrar solo usuarios que NO son 'admin'
                // Además, el admin NO puede eliminarse a sí mismo, por eso filtramos el ID.
                const noAdminUsuarios = data.filter(user =>
                    user.tipo !== 'admin' && user.id !== finalUser.id
                );
                setUsuarios(noAdminUsuarios);
            } else {
                setUsuarios([]);
            }
        } catch (error) {
            console.error("Error al obtener la lista de usuarios:", error);
            const message = error.response?.data?.error || "No se pudo cargar la lista de usuarios. Asegúrate de que el backend esté activo y el token sea válido.";
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
    }, [finalUser, navigate, toast]); // Dependencias para useCallback

    useEffect(() => {
        cargarUsuarios();
    }, [cargarUsuarios]); // Dependencia del callback para evitar errores de eslint

    // Manejador para aprobar a un psicólogo (Botón de "Alta")
    const handleApprove = async (id, nombre, apellido) => {
        if (!window.confirm(`¿Estás seguro de que deseas APROBAR al psicólogo ${nombre} ${apellido} y darlo de alta?`)) {
            return;
        }

        try {
            await aprobarPsicologo(id);
            toast({
                title: "Aprobación exitosa",
                description: `El psicólogo ${nombre} ${apellido} ha sido APROBADO y dado de alta.`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            cargarUsuarios(); // Recargar la lista
        } catch (error) {
            console.error("Error al aprobar psicólogo:", error);
            const message = error.response?.data?.error || "Ocurrió un error al intentar aprobar al psicólogo.";
            toast({
                title: "Error de Aprobación",
                description: message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    // Manejador CORREGIDO para ELIMINAR un usuario
    const handleDelete = async (id, nombre, apellido) => {
        if (!window.confirm(`¿Estás seguro de que quieres eliminar permanentemente al usuario ${nombre} ${apellido} (ID: ${id})? Esta acción es irreversible.`)) {
            return;
        }
        try {
            await deleteUsuario(id);
            toast({
                title: "Usuario Eliminado",
                description: `El usuario ${nombre} ${apellido} ha sido eliminado.`,
                status: "success",
                duration: 3000,
                isClosable: true
            });
            cargarUsuarios(); // Recargar la lista de usuarios
        } catch (error) {
            console.error("Error al eliminar usuario:", error);

            // Mensaje de error más detallado
            const message = error.response?.data?.error || "Ocurrió un error al intentar eliminar el usuario.";

            // Si el error es 403 (Forbidden), el token no tiene permisos de admin
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

    // Devuelve el esquema de color de Chakra para el tipo de usuario
    const getBadgeColor = (tipo) => {
        switch (tipo) {
            case 'admin': return 'purple';
            case 'psicologo': return 'blue';
            case 'voluntario': return 'teal';
            default: return 'gray';
        }
    };

    // Devuelve el esquema de color de Chakra para el estado de aprobación
    const getApprovalColor = (estado_aprobacion) => {
        switch (estado_aprobacion) {
            case 'aprobado': return 'green';
            case 'pendiente': return 'orange';
            case 'rechazado': return 'red';
            default: return 'gray';
        }
    };

    return (
        <VStack
            w="100%"
            display="flex"
            justifyContent="center"
            bg="#F0DCC9"
            paddingTop="0"
        >
            <Heading fontSize="1.3rem" color="violet.50" mb={3} textAlign="center">Aprobación de psicólogos y eliminación de usuarios no-administradores</Heading>
            {
                loading ? (
                    <HStack justifyContent="center" py={10}>
                        <Spinner size="xl" color="teal.500" />
                        <Text ml={3} fontSize="lg">Cargando lista de usuarios...</Text>
                    </HStack>
                ) : (
                    <Box overflowX="auto" shadow="lg" borderRadius="lg" w="100%">
                        <Table variant="simple" size="sm">
                            <Thead>
                                <Tr bg="violet.200" >
                                    <Th color="#F0DCC9">ID</Th>
                                    <Th color="#F0DCC9">Nombre</Th>
                                    <Th color="#F0DCC9">Email</Th>
                                    <Th color="#F0DCC9">Tipo</Th>
                                    <Th color="#F0DCC9">Aprobación</Th>
                                    <Th color="#F0DCC9">Acciones</Th>
                                </Tr>
                            </Thead>
                            <Tbody bg="violet.100">
                                {usuarios.length > 0 ? (
                                    usuarios.map((user) => (
                                        <Tr key={user.id} _hover={{ bg: "gray.50" }}>
                                            {/* ID y detalles del usuario */}
                                            <Td maxW="150px" overflow="hidden" textOverflow="ellipsis" color="violet.200">{user.id}</Td>
                                            <Td color="violet.200">{user.nombre} {user.apellido}</Td>
                                            <Td color="violet.200">{user.email}</Td>
                                            <Td color="violet.200">
                                                <Badge colorScheme={getBadgeColor(user.tipo)}>
                                                    {user.tipo}
                                                </Badge>
                                            </Td>
                                            <Td color="violet.200">
                                                <Badge colorScheme={getApprovalColor(user.estado_aprobacion)}>
                                                    {user.estado_aprobacion || "n/a"}
                                                </Badge>
                                            </Td>
                                            <Td color="violet.200">
                                                <VStack spacing={2} align="start">

                                                    {/* 1. Botón de APROBACIÓN (SOLO PSICÓLOGOS PENDIENTES) */}
                                                    {user.tipo === 'psicologo' && user.estado_aprobacion === 'pendiente' && (
                                                        <Button
                                                            size="sm"
                                                            colorScheme="green"
                                                            leftIcon={<FaCheckCircle />}
                                                            onClick={() => handleApprove(user.id, user.nombre, user.apellido)}
                                                        >
                                                            Aprobar
                                                        </Button>
                                                    )}

                                                    {/* 2. Botón de ELIMINAR (Para todos los usuarios mostrados, excepto el propio admin) */}
                                                    <Button
                                                        size="sm"
                                                        colorScheme="red"
                                                        leftIcon={<FaTrashAlt />}
                                                        onClick={() => handleDelete(user.id, user.nombre, user.apellido)}
                                                    >
                                                        Eliminar
                                                    </Button>

                                                    {/* Botón de PROMOCIÓN (Comentado, se mantiene por contexto) */}
                                                    {/* <Button
                                                    size="sm"
                                                    colorScheme="purple"
                                                    leftIcon={<FaUserPlus />}
                                                    onClick={() => handlePromote(user.id, user.nombre, user.apellido)}
                                                >
                                                    Promover a Admin
                                                </Button> */}
                                                </VStack>
                                            </Td>
                                        </Tr>
                                    ))
                                ) : (
                                    <Tr>
                                        <Td colSpan={6} textAlign="center" py={10}>
                                            No hay usuarios no-administradores para gestionar.
                                        </Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                    </Box>
                )
            }
        </VStack >
    );
}
