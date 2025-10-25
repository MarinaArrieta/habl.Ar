import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    Stack,
    Image,
    Center,
    Divider,
} from "@chakra-ui/react";
import {
    fetchTecnicas,
    createTecnica,
    updateTecnica,
    deleteTecnica,
} from "../services/techniques";
import AdminMenu from "../components/MenuAdmin";

export default function AdminTechniques() {
    const [tecnicas, setTecnicas] = useState([]);
    const [titulo, setTitulo] = useState("");
    const [tipo, setTipo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [url, setUrl] = useState("");

    const [editId, setEditId] = useState(null);

    const toast = useToast();
    const navigate = useNavigate();
    // Usar el Contexto sería mejor, pero por ahora mantendremos el localStorage para el chequeo de acceso.
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    const cargarTecnicas = async () => {
        if (!usuario || usuario.tipo !== "admin") {
            navigate("/login");
            return;
        }
        try {
            const res = await fetchTecnicas();
            let dataArray = [];

            if (res && Array.isArray(res.data)) {
                dataArray = res.data;
            } else if (res && res.data && Array.isArray(res.data.data)) {
                dataArray = res.data.data;
            } else {
                console.error("La API de técnicas no devolvió el array en la estructura esperada (res.data o res.data.data):", res);
                setTecnicas([]);
                return;
            }

            setTecnicas(dataArray);

        } catch (error) {
            /* console.error("Error al cargar técnicas:", error); */
            toast({ title: "Error al cargar técnicas", description: error.message, status: "error", duration: 3000 });
        }
    };

    useEffect(() => {
        cargarTecnicas();
    }, []);

    // Crear o actualizar técnica
    const handleSubmit = async () => {
        if (!titulo || !tipo || !descripcion) {
            toast({ title: "Completa todos los campos", status: "warning", duration: 2000 });
            return;
        }

        try {
            const data = { titulo, tipo, descripcion, url_multimedia: url };

            if (editId) {
                const updated = await updateTecnica(editId, data);
                if (updated) toast({ title: "Técnica actualizada", status: "success", duration: 2000 });
                setEditId(null);
            } else {
                const created = await createTecnica(data);
                if (created) toast({ title: "Técnica creada", status: "success", duration: 2000 });
            }
        } catch (error) {
            console.error("Error en submit:", error);
            toast({ title: "Error al guardar técnica", description: error.message, status: "error", duration: 3000 });
        }


        setTitulo("");
        setTipo("");
        setDescripcion("");
        setUrl("");
        cargarTecnicas();
    };

    // Editar técnica
    const handleEdit = (tecnica) => {
        setEditId(tecnica.id);
        setTitulo(tecnica.titulo);
        setTipo(tecnica.tipo);
        setDescripcion(tecnica.descripcion);
        setUrl(tecnica.url_multimedia || "");
    };

    // Eliminar técnica
    const handleDelete = async (id) => {
        if (!window.confirm(`¿Estás seguro de que quieres eliminar la técnica con ID ${id}?`)) {
            return;
        }
        try {
            const deleted = await deleteTecnica(id);
            if (deleted) toast({ title: "Técnica eliminada", status: "info", duration: 2000 });
            cargarTecnicas();
        } catch (error) {
            console.error("Error al eliminar:", error);
            // Si el error es 403 (Forbidden), el token no tiene permisos de admin
            if (error.response && error.response.status === 403) {
                toast({ title: "Acceso denegado", description: "Tu sesión no tiene permisos de administrador para esta acción.", status: "error", duration: 5000 });
            } else {
                toast({ title: "Error de eliminación", description: error.message, status: "error", duration: 3000 });
            }
        }
    };

    return (
        <VStack w={{ base: '80%', xl: '60%' }} paddingTop="0">
            <VStack spacing={3} mb={5} align="start">
                <Input placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
                <Select placeholder="Tipo de técnica" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                    <option>Respiración Consciente</option>
                    <option>Relajación Muscular Progresiva (RMP)</option>
                    <option>Meditación y Mindfulness</option>
                </Select>
                <Textarea placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                <Input placeholder="URL multimedia (opcional)" value={url} onChange={(e) => setUrl(e.target.value)} />
                <Button colorScheme="teal" onClick={handleSubmit}>
                    {editId ? "Actualizar Técnica" : "Crear Técnica"}
                </Button>
            </VStack>
            {/* Listado de Técnicas */}
            <VStack spacing={3} align="stretch">
                {tecnicas.map((t) => (
                    <Box key={t.id} p={3} borderWidth={1} borderRadius="md">
                        <Stack direction="row">
                            {t.url_multimedia && (
                                <Image boxSize="100px" objectFit="cover" src={t.url_multimedia} alt={t.titulo} />
                            )}
                        </Stack>
                        <p>ID: {t.id}</p>
                        <Heading size="sm">{t.titulo}</Heading>
                        <p><strong>Tipo:</strong> {t.tipo}</p>
                        <p>{t.descripcion}</p>
                        {t.url_multimedia && (
                            <p>
                                <a href={t.url_multimedia} target="_blank" rel="noreferrer">Ver multimedia</a>
                            </p>
                        )}
                        <HStack mt={2} spacing={2}>
                            <Button size="sm" colorScheme="yellow" onClick={() => handleEdit(t)}>Editar</Button>
                            <Button size="sm" colorScheme="red" onClick={() => handleDelete(t.id)}>Eliminar</Button>
                        </HStack>
                    </Box>
                ))}
            </VStack>
        </VStack>
    );
}
