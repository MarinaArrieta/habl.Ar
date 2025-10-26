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
            <Heading fontSize="1.3rem" color="blue.50" mb={6} textAlign="center">Gestión de Técnicas de Ayuda</Heading>

            {/* 1. Formulario de Registro (Solo Crear) */}
            <Card mb={8} p={4} borderRadius="xl" shadow="lg" bg="formu.100">
                <CardHeader pb={2}>
                    <Heading size="md" color="blue.50">
                        Registrar Nueva Técnica
                    </Heading>
                </CardHeader>
                <CardBody>
                    <VStack spacing={4} align="stretch">
                        <HStack spacing={4} align="stretch">
                            <Input
                                borderColor="blue.50 "
                                color="blue.5"
                                placeholder="Título"
                                value={newTitulo}
                                onChange={(e) => setNewTitulo(e.target.value)}
                                _hover={{
                                    boxShadow: "0 0 0 1px #a0a4ffff",
                                }}
                                _focusVisible={{
                                    boxShadow: "0 0 0 1px #353887",
                                    borderColor: "blue.50"
                                }}
                            />
                            <Select
                                /* placeholder="Selecciona el Tipo de Técnica" */
                                borderColor="blue.50 "
                                value={newTipo}
                                onChange={(e) => setNewTipo(e.target.value)}
                                _hover={{
                                    boxShadow: "0 0 0 1px #a0a4ffff",
                                }}
                                _focusVisible={{
                                    boxShadow: "0 0 0 1px #353887",
                                    borderColor: "blue.50"
                                }}
                            >
                                {TIPOS_TECNICA.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </Select>
                        </HStack>
                        <Textarea
                            placeholder="Descripción"
                            borderColor="blue.50 "
                            color="blue.5"
                            value={newDescripcion}
                            onChange={(e) => setNewDescripcion(e.target.value)}
                            _hover={{
                                boxShadow: "0 0 0 1px #a0a4ffff",
                            }}
                            _focusVisible={{
                                boxShadow: "0 0 0 1px #353887",
                                borderColor: "blue.50"
                            }}
                        />
                        <Input
                            placeholder="URL multimedia (opcional: Youtube, etc.)"
                            borderColor="blue.50 "
                            color="blue.5"
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            _hover={{
                                boxShadow: "0 0 0 1px #a0a4ffff",
                            }}
                            _focusVisible={{
                                boxShadow: "0 0 0 1px #353887",
                                borderColor: "blue.50"
                            }}
                        />
                    </VStack>
                    <Box display="flex" justifyContent="end">
                        <Button
                            variant='solid3D'
                            colorScheme='primary'
                            mt="25px"
                            onClick={handleRegister}
                        >
                            Crear Técnica
                        </Button>
                    </Box>
                </CardBody>
            </Card>

            {/* 2. Listado de Técnicas (Tabla con Edición en Línea) */}
            <Heading size="md" mb={4} mt={8} color="blue.50">Lista de Técnicas Registradas</Heading>

            {loading ? (
                <HStack justifyContent="center" py={10}>
                    <Spinner size="lg" color="teal.500" />
                    <Text ml={3}>Cargando técnicas...</Text>
                </HStack>
            ) : (
                <Box overflowX="auto" shadow="md" borderRadius="lg">
                    <Table variant="simple" size="sm">
                        <Thead bg="blue.50">
                            <Tr>
                                <Th color="#F0DCC9" w="50px">ID</Th>
                                <Th color="#F0DCC9" w="180px">Título</Th>
                                <Th color="#F0DCC9" w="150px">Tipo</Th>
                                <Th color="#F0DCC9" w="300px">Descripción</Th>
                                <Th color="#F0DCC9" w="120px">Multimedia</Th>
                                <Th color="#F0DCC9" w="180px" textAlign="center">Acciones</Th>
                            </Tr>
                        </Thead>
                        <Tbody bg="blue.100">
                            {tecnicas.length === 0 ? (
                                <Tr><Td colSpan={6} textAlign="center">No hay técnicas registradas.</Td></Tr>
                            ) : (
                                tecnicas.map((t) => (
                                    <Tr key={t.id} _hover={{ bg: editingId !== t.id ? "gray.50" : "yellow.50" }}>
                                        {/* Modo Edición */}
                                        {editingId === t.id ? (
                                            <>
                                                <Td >{t.id}</Td>
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
                                                        <a href={t.url_multimedia} target="_blank" rel="noreferrer" style={{ color: '#014126', fontSize: '12px' }}>Ver Link</a>
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