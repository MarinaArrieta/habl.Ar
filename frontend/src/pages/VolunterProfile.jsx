import { useState, useEffect, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Stack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Checkbox,
} from "@chakra-ui/react";
import { getUsuario, updateUsuario, deleteUsuario } from "../services/api";
import { UserContext } from "../context/UserContext";

export default function VolunterProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { usuario: loggedInUser, setUsuario } = useContext(UserContext);

  const [voluntario, setVoluntario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const fetchVoluntario = useCallback(async () => {
    setLoading(true);

    try {
      const res = await getUsuario(id);
      const fetchedData = res.data;
      const profileIdFromUrl = id.toString();
      const loggedInId = loggedInUser?.id?.toString();

      if (loggedInUser && loggedInId !== profileIdFromUrl && loggedInUser.tipo !== 'admin') {
        toast({ title: "Acceso Denegado", description: "No tienes permiso para ver este perfil.", status: "error" });
        navigate('/');
        setError("Acceso no autorizado.");
        setVoluntario(null);
        return;
      }

      setVoluntario(fetchedData);
      setFormData({
        nombre: fetchedData.nombre || "",
        apellido: fetchedData.apellido || "",
        email: fetchedData.email || "",
        // Formato YYYY-MM-DD
        fecha_nacimiento: fetchedData.fecha_nacimiento ? fetchedData.fecha_nacimiento.split('T')[0] : "",
        contrasena: "",
      });
      setError(null);
    } catch (err) {
      console.error("Error al obtener datos del voluntario:", err);
      setError("No se pudo cargar el perfil o no tienes permiso para acceder a él.");
    } finally {
      setLoading(false);
    }
  }, [id, loggedInUser, navigate, toast]);


  useEffect(() => {
    fetchVoluntario();
  }, [id, fetchVoluntario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = { ...formData };

    if (!dataToSend.contrasena) {
      delete dataToSend.contrasena;
    }

    delete dataToSend.curso_aprobado;

    try {
      await updateUsuario(id, dataToSend);
      toast({ title: "Perfil actualizado", status: "success" });
      setIsEditing(false);
      fetchVoluntario();
    } catch (err) {
      toast({
        title: "Error al actualizar",
        description: err.response?.data?.error || "Intenta de nuevo.",
        status: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    onClose(); // Cerrar modal

    if (loggedInUser.id.toString() !== id) {
      return toast({ title: "Acceso denegado", description: "Solo puedes eliminar tu propia cuenta.", status: "error" });
    }

    try {
      await deleteUsuario(id);

      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      setUsuario(null);

      toast({ title: "Cuenta eliminada", description: "Tu cuenta de voluntario ha sido dada de baja con éxito.", status: "info" });
      navigate("/");
    } catch (err) {
      toast({
        title: "Error al dar de baja",
        description: err.response?.data?.error || "Intenta de nuevo.",
        status: "error"
      });
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
        <Text mt={4}>Cargando perfil...</Text>
      </Box>
    );
  }

  if (error || !voluntario) {
    return (
      <Alert status="error" maxW="400px" mx="auto" mt={10}>
        <AlertIcon />
        {error || "Perfil no encontrado o no tienes acceso."}
      </Alert>
    );
  }

  const profileId = id.toString();
  const loggedInId = loggedInUser?.id?.toString();

  const canEditOrView = loggedInUser && (loggedInId === profileId || loggedInUser.tipo === 'admin');

  return (
    <Box maxW="600px" mx="auto" p={6}>
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        Perfil de Voluntario
      </Heading>
      <Box p={6} borderWidth={1} borderRadius="lg" bg="white">
        {!isEditing ? (
          <Stack spacing={4}>
            <Text>
              **Nombre Completo:** {voluntario.nombre} {voluntario.apellido}
            </Text>
            <Text>
              **Email:** {voluntario.email}
            </Text>
            <Text>
              **Nacimiento:** {voluntario.fecha_nacimiento}
            </Text>
            <Text>
              **Curso Aprobado:** {voluntario.curso_aprobado ? "Sí ✅" : "No ❌"}
            </Text>
            <Text fontSize="sm" color="gray.500">
              *Tipo de cuenta: {voluntario.tipo}*
            </Text>

            <Button colorScheme="blue" onClick={() => setIsEditing(true)} mt={4}>
              Editar Datos
            </Button>
            <Button colorScheme="red" variant="outline" onClick={onOpen}>
              Darse de Baja (Eliminar Cuenta)
            </Button>
          </Stack>
        ) : (
          <form onSubmit={handleUpdate}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nombre</FormLabel>
                <Input name="nombre" value={formData.nombre} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Apellido</FormLabel>
                <Input name="apellido" value={formData.apellido} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Fecha de Nacimiento</FormLabel>
                <Input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} isReadOnly />
                <Text fontSize="sm" color="gray.500">
                  *Este campo no se puede modificar.*
                </Text>
              </FormControl>
              <FormControl>
                <FormLabel>Nueva Contraseña (Dejar vacío para no cambiar)</FormLabel>
                <Input type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} placeholder="******" />
              </FormControl>
              <Checkbox isChecked={voluntario.curso_aprobado} isReadOnly colorScheme="green">
                Curso de Capacitación Aprobado
              </Checkbox>
              <Button type="submit" colorScheme="green" isLoading={loading}>
                Guardar Cambios
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
            </Stack>
          </form>
        )}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar Eliminación de Cuenta</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              ¿Estás seguro de que quieres **dar de baja** tu cuenta de voluntario? Esta acción es irreversible.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={handleDelete} ml={3}>
              Sí, Eliminar Mi Cuenta
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}