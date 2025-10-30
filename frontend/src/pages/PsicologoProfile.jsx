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
    Image,
    HStack,
    Link as ChakraLink,
} from "@chakra-ui/react";
import { getUsuario, updateUsuario, deleteUsuario } from "../services/api";
import { UserContext } from "../context/UserContext";

const API_BASE_URL = "https://habl-ar.onrender.com";
const DOCUMENTS_BASE_URL = `${API_BASE_URL}/uploads/`;

export default function PsicologoProfile() {
    const { id } = useParams();
    const { usuario: usuarioContext, setUsuario } = useContext(UserContext);
    const navigate = useNavigate();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure(); // Controla el modal de eliminación

    const [usuarioData, setUsuarioData] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [fotoFile, setFotoFile] = useState(null);

    // Función auxiliar para construir la URL de la foto de perfil
    const getFotoUrl = (fotoFilename) => {
        if (!fotoFilename) return null;
        return `${DOCUMENTS_BASE_URL}${fotoFilename}`;
    }

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

    const handleFileChange = (e) => {
        // Maneja la selección del archivo de la foto de perfil
        setFotoFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        let payload = {}; // Objeto JSON para campos de texto
        let hasChanges = false;

        // 1. Recolectar campos de texto modificados
        for (const key in formData) {
            if (key === 'id' || key === 'tipo' || key === 'email' || key === 'fotoUrl' || key === 'foto_titulo' || key === 'certificado') continue;

            const currentValue = formData[key] || "";
            const originalValue = usuarioData[key] || "";

            if (key === 'contrasena') {
                if (currentValue !== "") {
                    payload[key] = currentValue;
                    hasChanges = true;
                }
            } else if (currentValue !== originalValue) {
                payload[key] = currentValue;
                hasChanges = true;
            }
        }

        // 2. Verificar si hay cambios en el archivo de la foto
        if (fotoFile) {
            hasChanges = true;
        }

        // 3. CASO BASE: Sin cambios
        if (!hasChanges) {
            toast({ title: "Sin cambios", description: "No has modificado ningún campo ni subido una nueva foto.", status: "info" });
            setIsEditing(false);
            setSaving(false);
            return;
        }

        // 4. ESTRATEGIA DE ENVÍO: Usar FormData si hay archivo
        let requestData;
        if (fotoFile) {
            // **CLAVE:** Crear FormData para enviar el archivo
            const formDataToSubmit = new FormData();

            // Adjuntar el archivo. 'foto_perfil' debe ser el nombre que tu backend espera.
            formDataToSubmit.append('foto_perfil', fotoFile);

            // Adjuntar los campos de texto modificados al FormData también
            for (const key in payload) {
                formDataToSubmit.append(key, payload[key]);
            }

            requestData = formDataToSubmit; // Enviamos FormData
        } else {
            requestData = payload; // Enviamos el objeto JSON simple
        }

        try {
            // updateUsuario debe poder recibir tanto FormData como un objeto JSON
            const res = await updateUsuario(id, requestData);

            // Actualizar el contexto del usuario con la nueva información
            setUsuario(prev => ({
                ...prev,
                nombre: res.data.nombre,
                apellido: res.data.apellido,
                fotoUrl: res.data.fotoUrl // Asegúrate de que el backend devuelve la nueva URL de la foto
            }));

            toast({ title: "Perfil actualizado 🎉", status: "success" });
            setIsEditing(false);
            setFotoFile(null); // Limpiar el estado del archivo

        } catch (error) {
            toast({
                title: "Error al guardar",
                description: error.response?.data?.error || "Error al actualizar. Verifica el formato de datos.",
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
            // Llamada al servicio DELETE
            await deleteUsuario(id);

            // Limpieza de sesión
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

    const currentFotoUrl = getFotoUrl(usuarioData.fotoUrl);

    return (
        <Box maxW="800px" mx="auto" mt={10} p={5} borderWidth={1} borderRadius="lg" shadow="md">
            <HStack justifyContent="space-between" alignItems="flex-start" mb={4}>
                <VStack align="flex-start" spacing={1}>
                    <Heading size="xl" color="teal.600">
                        {usuarioData.nombre} {usuarioData.apellido}
                    </Heading>
                    <Text color="gray.500">ID: {usuarioData.id} | Tipo: {usuarioData.tipo}</Text>
                    <Text color="gray.600" fontSize="lg">{usuarioData.email}</Text>
                </VStack>

                <Box textAlign="center">
                    <Image
                        borderRadius="full"
                        boxSize="150px"
                        objectFit="cover"
                        src={currentFotoUrl || 'https://placehold.co/150x150/EEEEEE/555555?text=Sin+Foto'}
                        alt={`Foto de perfil de ${usuarioData.nombre}`}
                        fallbackSrc='https://placehold.co/150x150/EEEEEE/555555?text=Sin+Foto'
                        shadow="lg"
                    />
                    {isEditing && <Text mt={2} fontSize="sm" color="gray.500">Subir nueva foto abajo</Text>}
                </Box>
            </HStack>

            <HStack spacing={4} pt={2}>
                <Button
                    onClick={() => setIsEditing(!isEditing)}
                    colorScheme={isEditing ? "gray" : "teal"}
                    isLoading={saving}
                    width="180px"
                >
                    {isEditing ? "Cancelar Edición" : "Editar Perfil"}
                </Button>

                {/* --- NUEVO BOTÓN PARA DARSE DE BAJA --- */}
                <Button
                    onClick={onOpen} // Llama a la función para abrir el modal de confirmación
                    colorScheme="red"
                    isLoading={saving}
                    variant="outline"
                    leftIcon={<Box as='span' children='🗑️' />} // Ícono de basura
                >
                    Darse de Baja
                </Button>

            </HStack>

            {isEditing ? (
                <VStack as="form" onSubmit={handleSubmit} spacing={4} align="stretch">
                    <Divider />
                    <Heading size="md" pt={4}>Formulario de Edición</Heading>

                    {/* NUEVO CAMPO DE FOTO DE PERFIL */}
                    <FormControl>
                        <FormLabel>Foto de Perfil</FormLabel>
                        <Input
                            type="file"
                            name="foto_perfil"
                            accept="image/*"
                            onChange={handleFileChange}
                            p={1}
                        />
                        {fotoFile && <Text color="teal.500" fontSize="sm" mt={1}>Archivo seleccionado: {fotoFile.name}</Text>}
                    </FormControl>

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
                <VStack spacing={3} align="flex-start" divider={<Divider />} mt={6}>
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

            {/* Modal de confirmación (Ya estaba en el código, se usa con onOpen/onClose/handleDelete) */}
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
