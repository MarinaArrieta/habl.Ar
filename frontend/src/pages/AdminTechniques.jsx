import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Input,
    Textarea,
    VStack,
    HStack,
    Heading,
    useToast,
    Select,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    Spinner,
    Card,
    CardBody,
    CardHeader,
    Tooltip,
} from "@chakra-ui/react";
import {
    fetchTecnicas,
    createTecnica,
    updateTecnica,
    deleteTecnica,
} from "../services/techniques";

const TIPOS_TECNICA = [
    "Respiración Consciente",
    "Relajación Muscular Progresiva (RMP)",
    "Meditación y Mindfulness",
    "Otros",
];

export default function AdminTechniques() {
    const [tecnicas, setTecnicas] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estado para el formulario de REGISTRO
    const [newTitulo, setNewTitulo] = useState("");
    const [newTipo, setNewTipo] = useState("");
    const [newDescripcion, setNewDescripcion] = useState("");
    const [newUrl, setNewUrl] = useState("");

    // Estado para gestionar la EDICIÓN EN LÍNEA
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    const toast = useToast();
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // --- Lógica de Carga ---
    const cargarTecnicas = async () => {
        if (!usuario || usuario.tipo !== "admin") {
            navigate("/login");
            return;
        }
        setLoading(true);
        try {
            const res = await fetchTecnicas();
            let dataArray = Array.isArray(res?.data) ? res.data : Array.isArray(res?.data?.data) ? res.data.data : [];
            setTecnicas(dataArray);
        } catch (error) {
            toast({ title: "Error al cargar técnicas", description: error.message, status: "error", duration: 3000 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarTecnicas();
    }, []);

    // --- Lógica de Registro (Formulario Superior) ---
    const handleRegister = async () => {
        if (!newTitulo || !newTipo || !newDescripcion) {
            toast({ title: "Completa los campos obligatorios", status: "warning", duration: 2000 });
            return;
        }

        try {
            const data = { titulo: newTitulo, tipo: newTipo, descripcion: newDescripcion, url_multimedia: newUrl };
            await createTecnica(data);
            toast({ title: "Técnica creada", status: "success", duration: 2000 });

            // Limpiar formulario
            setNewTitulo("");
            setNewTipo("");
            setNewDescripcion("");
            setNewUrl("");

        } catch (error) {
            toast({ title: "Error al crear técnica", description: error.message || "Error desconocido", status: "error", duration: 3000 });
        }
        cargarTecnicas();
    };

    // --- Lógica de Edición en Línea ---
    const startEdit = (tecnica) => {
        // Establecer el ID de la fila a editar
        setEditingId(tecnica.id);
        // Inicializar el estado del formulario de edición con los datos de la fila
        setEditForm({
            titulo: tecnica.titulo,
            tipo: tecnica.tipo,
            descripcion: tecnica.descripcion,
            url_multimedia: tecnica.url_multimedia || "",
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (id) => {
        if (!editForm.titulo || !editForm.tipo || !editForm.descripcion) {
            toast({ title: "Completa los campos obligatorios", status: "warning", duration: 2000 });
            return;
        }

        try {
            await updateTecnica(id, editForm);
            toast({ title: "Técnica actualizada", status: "success", duration: 2000 });
            setEditingId(null); // Salir del modo edición
            cargarTecnicas(); // Recargar la lista
        } catch (error) {
            toast({ title: "Error al actualizar", description: error.message || "Error desconocido", status: "error", duration: 3000 });
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    // --- Lógica de Eliminación ---
    const handleDelete = async (id) => {
        if (!window.confirm(`¿Estás seguro de que quieres eliminar la técnica con ID ${id}?`)) {
            return;
        }
        try {
            await deleteTecnica(id);
            toast({ title: "Técnica eliminada", status: "info", duration: 2000 });
        } catch (error) {
            const message = error.response?.data?.error || error.message || "Error desconocido al eliminar.";
            toast({ title: "Error de eliminación", description: message, status: "error", duration: 3000 });
        }
        cargarTecnicas();
    };

    return (
        <Box p={4} maxW="container.xl" mx="auto">
            <Heading size="lg" mb={6} textAlign="center">Gestión de Técnicas de Ayuda</Heading>

            {/* 1. Formulario de Registro (Solo Crear) */}
            <Card mb={8} p={4} borderRadius="xl" shadow="lg">
                <CardHeader pb={2}>
                    <Heading size="md" color="teal.600">
                        ➕ Registrar Nueva Técnica
                    </Heading>
                </CardHeader>
                <CardBody>
                    <VStack spacing={4} align="stretch">
                        <HStack spacing={4} align="stretch">
                            <Input
                                placeholder="Título"
                                value={newTitulo}
                                onChange={(e) => setNewTitulo(e.target.value)}
                                focusBorderColor="teal.500"
                            />
                            <Select
                                placeholder="Selecciona el Tipo de Técnica"
                                value={newTipo}
                                onChange={(e) => setNewTipo(e.target.value)}
                                focusBorderColor="teal.500"
                            >
                                {TIPOS_TECNICA.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </Select>
                        </HStack>
                        <Textarea
                            placeholder="Descripción"
                            value={newDescripcion}
                            onChange={(e) => setNewDescripcion(e.target.value)}
                            focusBorderColor="teal.500"
                        />
                        <Input
                            placeholder="URL multimedia (opcional: Youtube, etc.)"
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            focusBorderColor="teal.500"
                        />
                        <Button colorScheme="teal" onClick={handleRegister}>
                            Crear Técnica
                        </Button>
                    </VStack>
                </CardBody>
            </Card>

            {/* 2. Listado de Técnicas (Tabla con Edición en Línea) */}
            <Heading size="md" mb={4} mt={8}>Lista de Técnicas Registradas</Heading>

            {loading ? (
                <HStack justifyContent="center" py={10}>
                    <Spinner size="lg" color="teal.500" />
                    <Text ml={3}>Cargando técnicas...</Text>
                </HStack>
            ) : (
                <Box overflowX="auto" shadow="md" borderRadius="lg">
                    <Table variant="simple" size="sm">
                        <Thead bg="teal.600">
                            <Tr>
                                <Th color="white" w="50px">ID</Th>
                                <Th color="white" w="180px">Título</Th>
                                <Th color="white" w="150px">Tipo</Th>
                                <Th color="white" w="300px">Descripción</Th>
                                <Th color="white" w="120px">URL Multimedia</Th>
                                <Th color="white" w="180px" textAlign="center">Acciones</Th>
                            </Tr>
                        </Thead>
                        <Tbody bg="white">
                            {tecnicas.length === 0 ? (
                                <Tr><Td colSpan={6} textAlign="center">No hay técnicas registradas.</Td></Tr>
                            ) : (
                                tecnicas.map((t) => (
                                    <Tr key={t.id} _hover={{ bg: editingId !== t.id ? "gray.50" : "yellow.50" }}>
                                        {/* Modo Edición */}
                                        {editingId === t.id ? (
                                            <>
                                                <Td>{t.id}</Td>
                                                <Td><Input name="titulo" value={editForm.titulo} onChange={handleEditChange} size="sm" /></Td>
                                                <Td>
                                                    <Select name="tipo" value={editForm.tipo} onChange={handleEditChange} size="sm">
                                                        {TIPOS_TECNICA.map(type => (<option key={type} value={type}>{type}</option>))}
                                                    </Select>
                                                </Td>
                                                <Td>
                                                    <Textarea name="descripcion" value={editForm.descripcion} onChange={handleEditChange} size="sm" rows={2} />
                                                </Td>
                                                <Td>
                                                    <Input name="url_multimedia" value={editForm.url_multimedia} onChange={handleEditChange} size="sm" placeholder="URL" />
                                                </Td>
                                                <Td textAlign="center">
                                                    <VStack spacing={1}>
                                                        <Button size="xs" colorScheme="teal" onClick={() => handleUpdate(t.id)} >Guardar</Button>
                                                        <Button size="xs" colorScheme="gray" onClick={cancelEdit} >Cancelar</Button>
                                                    </VStack>
                                                </Td>
                                            </>
                                        ) : (
                                            /* Modo Lectura */
                                            <>
                                                <Td>{t.id}</Td>
                                                <Td><Text noOfLines={1} title={t.titulo}>{t.titulo}</Text></Td>
                                                <Td>{t.tipo}</Td>
                                                <Td>
                                                    <Tooltip label={t.descripcion} placement="top" openDelay={500}>
                                                        <Text noOfLines={2} fontSize="sm">{t.descripcion}</Text>
                                                    </Tooltip>
                                                </Td>
                                                <Td>
                                                    {t.url_multimedia ? (
                                                        <a href={t.url_multimedia} target="_blank" rel="noreferrer" style={{ color: 'teal', fontSize: '12px' }}>Ver Link</a>
                                                    ) : (
                                                        <Text fontSize="xs" color="gray.500">N/A</Text>
                                                    )}
                                                </Td>
                                                <Td textAlign="center">
                                                    <HStack spacing={2} justifyContent="center">
                                                        <Button size="xs" colorScheme="yellow" onClick={() => startEdit(t)}>
                                                            Editar
                                                        </Button>
                                                        <Button size="xs" colorScheme="red" onClick={() => handleDelete(t.id)}>
                                                            Eliminar
                                                        </Button>
                                                    </HStack>
                                                </Td>
                                            </>
                                        )}
                                    </Tr>
                                ))
                            )}
                        </Tbody>
                    </Table>
                </Box>
            )}
        </Box>
    );
}