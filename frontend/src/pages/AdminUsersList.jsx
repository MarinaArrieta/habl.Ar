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
import { FaUserPlus, FaCheckCircle } from "react-icons/fa"; // FaCheckCircle para el botón de aprobación

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

// NUEVA FUNCIÓN: Aprobar un psicólogo (PUT /api/usuarios/approve-psicologo/:id)
const aprobarPsicologo = async (id) => {
    try {
        // Usamos PUT al endpoint con el ID en la URL. Asume este endpoint.
        const response = await axios.put(`/api/usuarios/approve-psicologo/${id}`, {}, getAuthHeaders());
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
    // Usamos el hook useUser para obtener el usuario actual de manera más robusta
    const { usuarioActual } = useUser();
    // Fallback si useUser no está listo o no existe
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
                const noAdminUsuarios = data.filter(user => user.tipo !== 'admin');
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

    // Manejador para promover a Admin
    const handlePromote = async (id, nombre, apellido) => {
        if (!window.confirm(`¿Estás seguro de que quieres promover a ${nombre} ${apellido} a Administrador?`)) {
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
            cargarUsuarios(); // Recargar la lista
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

    // NUEVO MANEJADOR: Aprobar a un psicólogo (Botón de "Alta")
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

    // Devuelve el esquema de color de Chakra para el tipo de usuario
    const getBadgeColor = (tipo) => {
        switch (tipo) {
            case 'admin': return 'purple';
            case 'psicologo': return 'blue';
            case 'voluntario': return 'teal';
            default: return 'gray';
        }
    };

    // NUEVO: Devuelve el esquema de color de Chakra para el estado de aprobación
    const getApprovalColor = (estado_aprobacion) => {
        switch (estado_aprobacion) {
            case 'aprobado': return 'green';
            case 'pendiente': return 'orange';
            case 'rechazado': return 'red';
            default: return 'gray';
        }
    };

    return (
        <Box bg="gray.50" minH="100vh">
            <Heading size="xl" mb={6} color="teal.700">Gestión de Usuarios</Heading>
            <Text mb={6} color="gray.600">Lista de usuarios registrados que requieren gestión (Aprobación de psicólogos o promoción a administrador).</Text>

            {loading ? (
                <HStack justifyContent="center" py={10}>
                    <Spinner size="xl" color="teal.500" />
                    <Text ml={3} fontSize="lg">Cargando lista de usuarios...</Text>
                </HStack>
            ) : (
                <Box overflowX="auto" bg="white" shadow="lg" borderRadius="lg">
                    <Table variant="simple" size="md">
                        <Thead>
                            <Tr bg="teal.50">
                                <Th>ID</Th>
                                <Th>Nombre</Th>
                                <Th>Email</Th>
                                <Th>Tipo</Th>
                                <Th>Aprobación</Th>
                                <Th>Acciones</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {usuarios.length > 0 ? (
                                usuarios.map((user) => (
                                    <Tr key={user.id} _hover={{ bg: "gray.50" }}>
                                        <Td maxW="150px" overflow="hidden" textOverflow="ellipsis">{user.id}</Td>
                                        <Td>{user.nombre} {user.apellido}</Td>
                                        <Td>{user.email}</Td>
                                        <Td>
                                            <Badge colorScheme={getBadgeColor(user.tipo)}>
                                                {user.tipo}
                                            </Badge>
                                        </Td>
                                        <Td>
                                            {user.estado_aprobacion === 'aprobado' && (
                                                <Badge colorScheme={getApprovalColor(user.estado_aprobacion)}>
                                                    {user.estado_aprobacion}
                                                </Badge>
                                            )}
                                        </Td>
                                        <Td>
                                            {/* Usamos VStack para apilar los botones si es necesario */}
                                            <VStack spacing={2} align="start">

                                                {/* 1. Botón de APROBACIÓN (SOLO PSICÓLOGOS PENDIENTES) */}
                                                {user.tipo === 'psicologo' && user.estado_aprobacion === 'pendiente' && (
                                                    <Button
                                                        size="sm"
                                                        colorScheme="green"
                                                        leftIcon={<FaCheckCircle />}
                                                        onClick={() => handleApprove(user.id, user.nombre, user.apellido)}
                                                    >
                                                        Aprobar Psicólogo
                                                    </Button>
                                                )}

                                                {/* 2. Botón de PROMOCIÓN (Siempre disponible para usuarios no-admin) */}
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
            )}
        </Box>
    );
}
