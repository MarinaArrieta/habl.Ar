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
  ModalCloseButton,
  useDisclosure,
  Checkbox,
  Image,
  Icon,
  ModalBody,
} from "@chakra-ui/react";
import { FaUserCircle } from 'react-icons/fa';

import { getUsuario, updateUsuario, deleteUsuario } from "../services/api";
import { UserContext } from "../context/UserContext";

export default function VolunterProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { usuario: loggedInUser, setUsuario } = useContext(UserContext);

  const [voluntario, setVoluntario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  const [profileImageFile, setProfileImageFile] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const BASE_UPLOAD_URL = "http://localhost:3000/uploads/";

  const getFotoUrl = (fotoFilename) => {
    if (!fotoFilename) return null;
    return `${BASE_UPLOAD_URL}${fotoFilename}`;
  }

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

  const handleFileChange = (e) => {
    setProfileImageFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    let payload = {};
    let hasChanges = false;

    const fieldsToUpdate = ['nombre', 'apellido', 'contrasena'];

    for (const key of fieldsToUpdate) {
      const currentValue = formData[key] || "";
      const originalValue = voluntario[key] || "";

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

    if (profileImageFile) {
      hasChanges = true;
    }

    if (!hasChanges) {
      toast({ title: "Sin cambios", description: "No has modificado ningún campo ni subido una nueva foto.", status: "info" });
      setIsEditing(false);
      setLoading(false);
      return;
    }

    let requestData;
    if (profileImageFile) {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('foto_perfil', profileImageFile);

      for (const key in payload) {
        formDataToSubmit.append(key, payload[key]);
      }

      requestData = formDataToSubmit;
    } else {
      requestData = payload;
    }


    try {
      const res = await updateUsuario(id, requestData);

      if (loggedInUser?.id?.toString() === id) {
        setUsuario(prev => ({
          ...prev,
          nombre: res.data.nombre,
          apellido: res.data.apellido,
          fotoUrl: res.data.fotoUrl || prev.fotoUrl
        }));
      }

      toast({ title: "Perfil actualizado 🎉", status: "success" });
      setIsEditing(false);
      setProfileImageFile(null);
      fetchVoluntario();

    } catch (err) {
      console.error("Error de actualización:", err);
      toast({
        title: "Error al actualizar",
        description: err.response?.data?.error || "Intenta de nuevo. Verifica el formato de datos.",
        status: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  /* const handleDelete = async () => {
    onClose();

    if (loggedInUser?.id?.toString() !== id) {
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
  }; */
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
  const isProfileOwner = loggedInId === profileId;

  const currentFotoUrl = getFotoUrl(voluntario.fotoUrl);

  return (
    <Box maxW="600px" mx="auto" p={6}>
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        Perfil de Voluntario
      </Heading>
      <Box p={6} borderWidth={1} borderRadius="lg" bg="white">
        <Stack align="center" mb={6}>
          <Box
            w="150px"
            h="150px"
            borderRadius="full"
            overflow="hidden"
            borderWidth="4px"
            borderColor="blue.400"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="gray.100"
          >
            {voluntario.fotoUrl ? (
              <Image
                src={currentFotoUrl}
                alt={`Foto de ${voluntario.nombre}`}
                objectFit="cover"
                w="full"
                h="full"
                fallbackSrc='https://placehold.co/150x150/EEEEEE/555555?text=Sin+Foto'
              />
            ) : (
              <Icon as={FaUserCircle} w={20} h={20} color="gray.500" />
            )}
          </Box>

          {/* {isProfileOwner && isEditing && ( */}
          {isEditing && (
            <Text mt={2} fontSize="sm" color="gray.500">Selecciona una nueva foto abajo para reemplazar la actual</Text>
          )}

        </Stack>

        {!isEditing ? (
          <Stack spacing={4}>
            <Text><Text as="b">Nombre Completo:</Text> {voluntario.nombre} {voluntario.apellido}</Text>
            <Text><Text as="b">Email:</Text> {voluntario.email}</Text>
            <Text><Text as="b">Nacimiento:</Text> {voluntario.fecha_nacimiento}</Text>
            <Text><Text as="b">Curso Aprobado:</Text> {voluntario.curso_aprobado ? "Sí ✅" : "No ❌"}</Text>
            <Text fontSize="sm" color="gray.500">
              *Tipo de cuenta: {voluntario.tipo}*
            </Text>

            {/* 🔑 CORRECCIÓN: Los botones solo se muestran si el usuario logeado es el dueño del perfil. */}
            {/* {isProfileOwner && ( */}
            <>
              <Button colorScheme="blue" onClick={() => setIsEditing(true)} mt={4}>
                Editar Datos
              </Button>
              <Button colorScheme="red" variant="outline" onClick={onOpen}>
                Darse de Baja (Eliminar Cuenta)
              </Button>
            </>
            {/* )} */}
          </Stack>
        ) : (
          <form onSubmit={handleUpdate}>
            <Stack spacing={4}>

              {/* El campo de la foto solo es visible si es el dueño */}
              {/* {isProfileOwner && ( */}
              <FormControl>
                <FormLabel>Foto de Perfil **(Opcional)**</FormLabel>
                <Input
                  type="file"
                  name="foto_perfil"
                  accept="image/*"
                  onChange={handleFileChange}
                  p={1}
                />
                {/* {profileImageFile && <Text color="teal.500" fontSize="sm" mt={1}>Archivo seleccionado: {profileImageFile.name}</Text>} */}
                {/* <Text color="teal.500" fontSize="sm" mt={1}>Archivo seleccionado: {profileImageFile.name}</Text> */}
                {profileImageFile && <Text color="teal.500" fontSize="sm" mt={1}>Archivo seleccionado: {profileImageFile.name}</Text>}
              </FormControl>
              {/* )} */}

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
                <Input type="email" name="email" value={formData.email} isReadOnly placeholder="El email no es editable." />
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
              <Button variant="outline" onClick={() => { setIsEditing(false); setProfileImageFile(null); }}>
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