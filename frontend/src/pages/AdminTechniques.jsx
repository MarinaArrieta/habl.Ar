import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Input,
  Textarea,
  VStack,
  HStack, // 🚨 Importado para la nueva estructura de botones
  Heading,
  useToast,
  Select,
  Stack,
  Image,
} from "@chakra-ui/react";
import {
  fetchTecnicas,
  createTecnica,
  updateTecnica,
  deleteTecnica,
} from "../services/techniques";

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

  // Cargar técnicas (solo si hay admin)
  const cargarTecnicas = async () => {
    if (!usuario || usuario.tipo !== "admin") {
      navigate("/login");
      return;
    }
    // Tu API service para técnicas probablemente usa el token del interceptor,
    // por eso no necesitas pasarlo aquí.
    const data = await fetchTecnicas();
    setTecnicas(data);
  };

  useEffect(() => {
    cargarTecnicas();
  }, [usuario, navigate]); // Añadimos navigate como dependencia

  // Crear o actualizar técnica
  const handleSubmit = async () => {
    if (!titulo || !tipo || !descripcion) {
      toast({ title: "Completa todos los campos", status: "warning", duration: 2000 });
      return;
    }

    if (editId) {
      const updated = await updateTecnica(editId, { titulo, tipo, descripcion, url_multimedia: url });
      if (updated) toast({ title: "Técnica actualizada", status: "success", duration: 2000 });
      setEditId(null);
    } else {
      const created = await createTecnica({ titulo, tipo, descripcion, url_multimedia: url });
      if (created) toast({ title: "Técnica creada", status: "success", duration: 2000 });
    }

    setTitulo("");
    setTipo("");
    setDescripcion("");
    setUrl("");
    cargarTecnicas();
  };

  // Editar técnica
  const handleEdit = (tecnica) => {
    setEditId(tecnica.pk);
    setTitulo(tecnica.titulo);
    setTipo(tecnica.tipo);
    setDescripcion(tecnica.descripcion);
    setUrl(tecnica.url_multimedia || "");
  };

  // Eliminar técnica
  const handleDelete = async (id) => {
    const deleted = await deleteTecnica(id);
    if (deleted) toast({ title: "Técnica eliminada", status: "info", duration: 2000 });
    cargarTecnicas();
  };

  return (
    <Box p={5}>
        <HStack mb={5} justify="space-between">
            <Heading>Administrar Técnicas</Heading>
            <Button colorScheme="green" onClick={() => navigate("/admin-register")}>
                Registrar Admin
            </Button>
        </HStack>
      {/* Formulario Crear/Editar */}
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
          <Box key={t.pk} p={3} borderWidth={1} borderRadius="md">
            <Stack direction="row">
              {t.url_multimedia && (
                <Image boxSize="100px" objectFit="cover" src={t.url_multimedia} alt={t.titulo} />
              )}
            </Stack>
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
              <Button size="sm" colorScheme="red" onClick={() => handleDelete(t.pk)}>Eliminar</Button>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}