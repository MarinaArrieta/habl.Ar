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
import { FaUserPlus } from "react-icons/fa"; // Usamos un icono relevante

// ==========================================================
// FUNCIONES DE API INTEGRADAS (Reutilizando lógica anterior)
// ==========================================================

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// Obtener todos los usuarios (GET /api)
const getUsuarios = async () => {
    try {
        // La llamada usa la ruta base /api, gracias a la configuración del proxy de Vite
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
        // Envía la ID del usuario a promover
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

export default function AdminUsersList() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const navigate = useNavigate();
    const usuarioActual = JSON.parse(localStorage.getItem("usuario"));

    const cargarUsuarios = async () => {
        // Chequeo de seguridad: Redirigir si no es admin
        if (!usuarioActual || usuarioActual.tipo !== "admin") {
            navigate("/login");
            return;
        }

        try {
            setLoading(true);
            const data = await getUsuarios();

            if (Array.isArray(data)) {
                // 💡 FILTRO CLAVE: Mostrar solo usuarios que NO son 'admin'
                const noAdminUsuarios = data.filter(user => user.tipo !== 'admin');
                setUsuarios(noAdminUsuarios);
            } else {
                setUsuarios([]);
            }
        } catch (error) {
            console.error("Error al obtener la lista de usuarios:", error);
            const message = error.response?.data?.error || "No se pudo cargar la lista de usuarios.";
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
        if (!window.confirm(`¿Estás seguro de que quieres promover a ${nombre} a Administrador?`)) {
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
            // Recargar la lista: el usuario promovido desaparecerá de esta vista
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
        <Box p={0}>
            <Heading size="lg" mb={4}>Usuarios No Administradores</Heading>
            <Text mb={4}>Lista de usuarios registrados (**Psicólogos, Voluntarios, Comunes**) que pueden ser ascendidos a administrador.</Text>

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
                            <Th>Aprobación</Th>
                            <Th>Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {usuarios.length > 0 ? (
                            usuarios.map((user) => (
                                <Tr key={user.id}>
                                    <Td>{user.id}</Td>
                                    <Td>{user.nombre} {user.apellido}</Td>
                                    <Td>{user.email}</Td>
                                    <Td>
                                        <Badge colorScheme={getBadgeColor(user.tipo)}>
                                            {user.tipo}
                                        </Badge>
                                    </Td>
                                    <Td>{user.estado_aprobacion}</Td>
                                    <Td>
                                        <Button
                                            size="sm"
                                            colorScheme="purple"
                                            leftIcon={<FaUserPlus />}
                                            onClick={() => handlePromote(user.id, user.nombre)}
                                        >
                                            Promover a Admin
                                        </Button>
                                    </Td>
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td colSpan={6} textAlign="center">
                                    No hay usuarios no-administradores para gestionar.
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            )}
        </Box>
    );
}