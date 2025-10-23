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

    const fetchUserData = useCallback(async () => {
        setLoading(true);
        const userIdFromUrl = parseInt(id, 10);

        try {
            const res = await getUsuario(id);
            const fetchedData = res.data;

            if (usuarioContext && usuarioContext.id !== fetchedData.id) {
                toast({ title: "Acceso Denegado", description: "No tienes permiso para ver este perfil.", status: "error" });
                navigate('/');
                setUsuarioData(null);
                return;
            }

            setUsuarioData(fetchedData);
            const { contrasena, ...editableData } = fetchedData;
            setFormData({ ...editableData, contrasena: "" });

        } catch (err) {
            console.error("Error al cargar datos:", err);
            toast({
                title: "Error",
                description: err.response?.data?.error || "No se pudo cargar el perfil o acceso no autorizado.",
                status: "error",
            });
            setUsuarioData(null);
        } finally {
            setLoading(false);
        }
    }, [id, usuarioContext, navigate, toast]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

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

        const dataToUpdate = {};
        let hasChanges = false;

        for (const key in formData) {
            if (key === 'id' || key === 'tipo' || key === 'email') continue;

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

    const handleDelete = async () => {
        onClose();

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
    };

    if (loading) {
        return (
            <Center h="60vh">
                <Spinner size="xl" color="teal.500" />
            </Center>
        );
    }

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

            <VStack spacing={3} align="flex-start" mb={6}>
                <Button
                    onClick={() => setIsEditing(!isEditing)}
                    colorScheme={isEditing ? "gray" : "teal"}
                    isLoading={saving}
                    width="200px"
                >
                    {isEditing ? "Cancelar Edición" : "Editar Perfil"}
                </Button>

                {!isEditing && (
                    <Button
                        colorScheme="red"
                        onClick={onOpen}
                        isLoading={saving}
                        width="200px"
                    >
                        Darse de Baja
                    </Button>
                )}
            </VStack>
            
            {isEditing ? (
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