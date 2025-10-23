import { useState, useEffect, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Heading,
    useToast,
    Spinner,
    Text,
    Divider,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    useDisclosure,
    Center,
    Link as ChakraLink,
} from "@chakra-ui/react";
import { getUsuario, updateUsuario, deleteUsuario } from "../services/api";
import { UserContext } from "../context/UserContext";

const DOCUMENTS_BASE_URL = "http://localhost:3000/uploads/";

export default function PsicologoProfile() {
    const { id } = useParams();
    const { usuario: usuarioContext, setUsuario } = useContext(UserContext);
    const navigate = useNavigate();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [usuarioData, setUsuarioData] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    /* const fetchUserData = useCallback(async () => {

        if (usuarioContext === null || usuarioContext === undefined) {
            setLoading(false);
            return;
        }
        if (usuarioContext.id !== parseInt(id)) {
            setLoading(false);
            toast({ title: "Acceso Denegado", description: "No puedes ver este perfil.", status: "error" });
            navigate('/');
            return;
        }

        setLoading(true);

        try {
            const res = await getUsuario(id);
            setUsuarioData(res.data);
            const { contrasena, ...editableData } = res.data;
            setFormData({ ...editableData, contrasena: "" });

        } catch (err) {
            toast({
                title: "Error",
                description: "No se pudo cargar el perfil.",
                status: "error",
            });
        } finally {
            setLoading(false);
        }
    }, [id, usuarioContext, navigate, toast]); */
    /* const fetchUserData = useCallback(async () => {
        setLoading(true);
        const userIdFromUrl = parseInt(id, 10);

        // USANDO usuarioContext
        if (!usuarioContext || usuarioContext.id !== userIdFromUrl) {
            // USANDO usuarioContext
            if (usuarioContext && usuarioContext.id !== userIdFromUrl) {
                toast({ title: "Acceso Denegado", description: "No puedes ver este perfil.", status: "error" });
                navigate('/');
            }
            // Aseguramos que loading termine antes de retornar.
            setLoading(false);
            setUsuarioData(null);
            return;
        }

        try {
            const res = await getUsuario(id);
            setUsuarioData(res.data);
            const { contrasena, ...editableData } = res.data;
            setFormData({ ...editableData, contrasena: "" });
        } catch (err) {
            console.error("Error al cargar datos:", err);
            toast({
                title: "Error",
                description: "No se pudo cargar el perfil.",
                status: "error",
            });
            setUsuarioData(null);
        } finally {
            // Aseguramos que el estado de carga siempre termine después del intento de fetch.
            setLoading(false);
        }
        // USANDO usuarioContext EN DEPENDENCIAS
    }, [id, usuarioContext, navigate, toast]); */
    const fetchUserData = useCallback(async () => {
        setLoading(true);
        const userIdFromUrl = parseInt(id, 10);

        // 🛑 QUITAR ESTE BLOQUE:
        /*
        if (!usuarioContext || usuarioContext.id !== userIdFromUrl) {
            // ... (Lógica de Acceso Denegado / Redirección)
            setLoading(false);
            setUsuarioData(null); 
            return;
        }
        */

        try {
            // 🔑 PRIMERO: Intenta obtener los datos del usuario.
            // Asumimos que getUsuario usa el token para verificar la identidad/autorización.
            const res = await getUsuario(id);
            const fetchedData = res.data;

            // 🔑 SEGUNDO: Validar si el perfil cargado coincide con el usuario logueado.
            // Si el usuario logueado no es el dueño del perfil, redirigir.
            if (usuarioContext && usuarioContext.id !== fetchedData.id) {
                toast({ title: "Acceso Denegado", description: "No tienes permiso para ver este perfil.", status: "error" });
                navigate('/');
                setUsuarioData(null); // No mostrar datos
                return; // Termina la función aquí
            }

            // 💡 Si llegamos aquí, el usuario logueado es el dueño del perfil.
            setUsuarioData(fetchedData);
            const { contrasena, ...editableData } = fetchedData;
            setFormData({ ...editableData, contrasena: "" });

        } catch (err) {
            console.error("Error al cargar datos:", err);
            // Si el backend devuelve 404/401/403, caemos aquí.
            toast({
                title: "Error",
                description: err.response?.data?.error || "No se pudo cargar el perfil o acceso no autorizado.",
                status: "error",
            });
            setUsuarioData(null); // Esto dispara el mensaje "Perfil no encontrado..."
        } finally {
            setLoading(false); // Siempre termina la carga
        }
    }, [id, usuarioContext, navigate, toast]);


    /* useEffect(() => {
        fetchUserData();
    }, [fetchUserData]); */
    useEffect(() => {
        // 🚀 SOLUCIÓN: Llama a fetchUserData directamente.
        // La lógica de `usuarioContext` para permitir o denegar el acceso ya está dentro de fetchUserData.
        fetchUserData();
    }, [fetchUserData]);

    // Manejador de cambios del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        // Crear un objeto que solo contenga los campos con cambios para enviar
        const dataToUpdate = {};
        let hasChanges = false;

        for (const key in formData) {
            if (key === 'id' || key === 'tipo' || key === 'email') continue; // Campos no editables aquí

            const currentValue = formData[key] || "";
            const originalValue = usuarioData[key] || "";

            if (key === 'contrasena') {
                if (currentValue !== "") {
                    dataToUpdate[key] = currentValue;
                    hasChanges = true;
                }
            } else if (currentValue !== originalValue) {
                dataToUpdate[key] = currentValue;
                hasChanges = true;
            }
        }

        if (!hasChanges) {
            toast({ title: "Sin cambios", description: "No has modificado ningún campo.", status: "info" });
            setIsEditing(false);
            setSaving(false);
            return;
        }

        try {
            const res = await updateUsuario(id, dataToUpdate);
            setUsuario(prev => ({ ...prev, nombre: res.data.nombre, apellido: res.data.apellido }));

            toast({ title: "Perfil actualizado 🎉", status: "success" });
            setIsEditing(false);

        } catch (error) {
            toast({
                title: "Error al guardar",
                description: error.response?.data?.error || "Error al actualizar.",
                status: "error",
            });
        } finally {
            setSaving(false);
            fetchUserData();
        }
    };

    // FUNCIÓN Darse de Baja
    /* const handleDelete = async () => {
        if (window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.")) {
            setSaving(true);
            try {
                await deleteUsuario(id);
                localStorage.removeItem("token");
                localStorage.removeItem("usuario");
                setUsuario(null);

                toast({ title: "Cuenta Eliminada", description: "Tu cuenta ha sido eliminada con éxito.", status: "info" });
                navigate('/');

            } catch (error) {
                toast({
                    title: "Error",
                    description: error.response?.data?.error || "Error al eliminar la cuenta.",
                    status: "error",
                });
                setSaving(false);
            }
        }
    }; */
    const handleDelete = async () => {
        onClose(); // Cerrar el modal antes de proceder

        setSaving(true);
        try {
            await deleteUsuario(id);
            // Limpieza de almacenamiento y contexto
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            setUsuario(null);

            toast({ title: "Cuenta Eliminada", description: "Tu cuenta ha sido eliminada con éxito.", status: "info" });
            navigate('/');

        } catch (error) {
            toast({
                title: "Error",
                description: error.response?.data?.error || "Error al eliminar la cuenta.",
                status: "error",
            });
            setSaving(false);
        }
    };

    /* if (loading || usuarioContext === undefined) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" h="60vh">
                <Spinner size="xl" />
            </Box>
        );
    }

    if (!usuarioData) return <Heading size="lg" p={5}>Perfil no encontrado</Heading>; */
    // Renderizado de carga
    if (loading) {
        return (
            <Center h="60vh">
                <Spinner size="xl" color="teal.500" />
            </Center>
        );
    }

    // Si loading es false y no hay datos, mostramos el error (incluye no autorizado por la lógica de fetchUserData)
    if (!usuarioData) return (
        <Center h="60vh">
            <Heading size="lg" p={5} color="red.500">
                Perfil no encontrado o acceso no autorizado.
            </Heading>
        </Center>
    );

    return (
        <Box maxW="800px" mx="auto" mt={10} p={5} borderWidth={1} borderRadius="lg" shadow="md">
            <Heading mb={4} size="xl">
                Perfil de Psicólogo: {usuarioData.nombre} {usuarioData.apellido}
            </Heading>
            <Text color="gray.500" mb={6}>ID: {usuarioData.id} | Tipo: {usuarioData.tipo}</Text>

            {/* Botones de acción principal */}
            <VStack spacing={3} align="flex-start" mb={6}>
                <Button
                    onClick={() => setIsEditing(!isEditing)}
                    colorScheme={isEditing ? "gray" : "teal"}
                    isLoading={saving}
                    width="200px"
                >
                    {isEditing ? "Cancelar Edición" : "Editar Perfil"}
                </Button>

                {/* {!isEditing && (
                    <Button
                        colorScheme="red"
                        onClick={handleDelete}
                        isLoading={saving}
                        width="200px"
                    >
                        Darse de Baja
                    </Button>
                )} */}
                {!isEditing && (
                    <Button
                        colorScheme="red"
                        onClick={onOpen} // Abre el modal en lugar de window.confirm
                        isLoading={saving}
                        width="200px"
                    >
                        Darse de Baja
                    </Button>
                )}
            </VStack>
            {/* ESTADO DE APROBACIÓN - Muestra el estado actual del proceso de validación */}
            {/* <Box
                mb={6}
                p={4}
                borderRadius="lg"
                shadow="sm"
                // Lógica para asignar colores según el estado
                bg={usuarioData.estado_aprobacion === 'aprobado' ? 'green.50' : usuarioData.estado_aprobacion === 'rechazado' ? 'red.50' : 'yellow.50'}
                borderWidth={1}
                borderColor={usuarioData.estado_aprobacion === 'aprobado' ? 'green.200' : usuarioData.estado_aprobacion === 'rechazado' ? 'red.200' : 'yellow.200'}
            >
                <Text as="b" color="gray.700" fontSize="lg">
                    Estado de Aprobación:
                </Text>
                <Text
                    display="inline"
                    ml={2}
                    color={usuarioData.estado_aprobacion === 'aprobado' ? 'green.900' : usuarioData.estado_aprobacion === 'rechazado' ? 'red.900' : 'yellow.900'}
                    fontWeight="bold"
                    textTransform="uppercase"
                >
                    {usuarioData.estado_aprobacion || "PENDIENTE"}
                </Text>
            </Box> */}
            {isEditing ? (
                // EDICIÓN (FORMULARIO)
                <VStack as="form" onSubmit={handleSubmit} spacing={4} align="stretch">
                    <Divider />
                    <Heading size="md" pt={4}>Formulario de Edición</Heading>

                    <FormControl>
                        <FormLabel>Nombre</FormLabel>
                        <Input name="nombre" value={formData.nombre || ''} onChange={handleChange} />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Apellido</FormLabel>
                        <Input name="apellido" value={formData.apellido || ''} onChange={handleChange} />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Matrícula</FormLabel>
                        <Input name="matricula" value={formData.matricula || ''} onChange={handleChange} />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Universidad</FormLabel>
                        <Input name="universidad" value={formData.universidad || ''} onChange={handleChange} />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Título</FormLabel>
                        <Input name="titulo" value={formData.titulo || ''} onChange={handleChange} />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Foto del Título (Archivo actual)</FormLabel>
                        <Input name="foto_titulo" value={formData.foto_titulo || ''} isReadOnly placeholder="No se puede editar directamente aquí." />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Certificado de Matrícula (Archivo actual)</FormLabel>
                        <Input name="certificado" value={formData.certificado || ''} isReadOnly placeholder="No se puede editar directamente aquí." />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Nueva Contraseña (dejar vacío para no cambiar)</FormLabel>
                        <Input
                            type="password"
                            name="contrasena"
                            value={formData.contrasena || ''}
                            onChange={handleChange}
                            placeholder="Ingresa nueva contraseña"
                        />
                    </FormControl>

                    <Button
                        colorScheme="blue"
                        type="submit"
                        isLoading={saving}
                    >
                        Guardar Cambios
                    </Button>
                </VStack>
            ) : (
                // MODO VISUALIZACIÓN
                <VStack spacing={3} align="flex-start" divider={<Divider />}>
                    <Text>
                        <Text as="b">Email:</Text> {usuarioData.email}
                    </Text>
                    <Text>
                        <Text as="b">Matrícula:</Text> {usuarioData.matricula || "N/A"}
                    </Text>
                    <Text>
                        <Text as="b">Universidad:</Text> {usuarioData.universidad || "N/A"}
                    </Text>
                    <Text>
                        <Text as="b">Título:</Text> {usuarioData.titulo || "N/A"}
                    </Text>

                    {/* CAMPOS DE DOCUMENTOS */}
                    <Text>
                        <Text as="b">Foto del Título:</Text>
                        {usuarioData.foto_titulo ? (
                            <ChakraLink href={`${DOCUMENTS_BASE_URL}${usuarioData.foto_titulo}`} isExternal color="blue.500" ml={2}>
                                Ver Archivo ({usuarioData.foto_titulo})
                            </ChakraLink>
                        ) : "Pendiente de subir"}
                    </Text>
                    <Text>
                        <Text as="b">Certificado de Matrícula:</Text>
                        {usuarioData.certificado ? (
                            <ChakraLink href={`${DOCUMENTS_BASE_URL}${usuarioData.certificado}`} isExternal color="blue.500" ml={2}>
                                Ver Archivo ({usuarioData.certificado})
                            </ChakraLink>
                        ) : "Pendiente de subir"}
                    </Text>
                </VStack>
            )}
            {/* Modal de Confirmación (Reemplazo de window.confirm) */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirmar Eliminación de Cuenta</ModalHeader>
                    <ModalBody>
                        <Text>
                            ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible y perderás todos tus datos.
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" onClick={onClose} mr={3}>
                            Cancelar
                        </Button>
                        <Button colorScheme="red" onClick={handleDelete} isLoading={saving}>
                            Sí, Eliminar Cuenta
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}