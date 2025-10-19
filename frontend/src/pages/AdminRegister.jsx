import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useToast,
  Stack,
  Divider,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { 
  registerAdmin, 
  getUsuarios,
  updateUsuario,  
  deleteUsuario   
} from "../services/api"; 

export default function AdminRegister() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contrasena: "",
    tipo: "admin",
  });
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [adminToEdit, setAdminToEdit] = useState(null);
  const [listLoading, setListLoading] = useState(true);

  const toast = useToast();
  const navigate = useNavigate();

  // Función para obtener la lista de administradores
  const fetchAdmins = useCallback(async () => {
    setListLoading(true);
    try {
      const res = await getUsuarios();
      // Filtramos la lista para mostrar SOLO los admins
      const adminList = res.data.filter(user => user.tipo === 'admin');
      setAdmins(adminList);
    } catch (error) {
      console.error("Error al obtener la lista de admins:", error);
      toast({ 
        title: "Error", 
        description: "No se pudo cargar la lista de administradores.", 
        status: "error", 
        duration: 3000, 
        isClosable: true 
      });
    } finally {
      setListLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
    
  // Reinicia el formulario y sale del modo edición
  const resetForm = () => {
    setForm({ nombre: "", apellido: "", email: "", contrasena: "", tipo: "admin" });
    setAdminToEdit(null);
  }
  
  // Función para cargar el administrador en el formulario
  const handleEditClick = (admin) => {
    setAdminToEdit(admin);
    setForm({
      nombre: admin.nombre,
      apellido: admin.apellido,
      email: admin.email,
      contrasena: "", // Siempre dejar vacía por seguridad al editar
      tipo: admin.tipo,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
    
  // Lógica para registrar un nuevo admin o actualizar uno existente
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (adminToEdit) {
      await handleUpdate();
      setLoading(false);
      return;
    }

    // Lógica de REGISTRO (si no hay adminToEdit)
    try {
      await registerAdmin(form);
      toast({
        title: "Admin Creado",
        description: `El administrador ${form.email} fue registrado con éxito.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      resetForm();
      fetchAdmins(); // Recargar la lista
    } catch (error) {
      console.error("Error al registrar admin:", error);
      const errorMessage = error.response?.data?.error || "Error de red/servidor.";
      toast({ title: "Error", description: errorMessage, status: "error", duration: 3000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  // Lógica para actualizar el admin
  const handleUpdate = async () => {
    const dataToSend = {};
    const currentId = adminToEdit.id;
    
    // Solo enviamos los campos que tienen valor
    for (const key in form) {
        // Excluir 'tipo' y solo enviar 'contrasena' si tiene valor (no es vacía)
        if (key !== "tipo" && (key !== "contrasena" || form[key] !== "")) {
            dataToSend[key] = form[key];
        }
    }
    
    if (Object.keys(dataToSend).length === 0) {
        toast({ title: "Advertencia", description: "No hay campos para actualizar.", status: "warning", duration: 2000 });
        return;
    }

    try {
        await updateUsuario(currentId, dataToSend);
        toast({ title: "Admin Actualizado", status: "success", duration: 3000, isClosable: true });
        resetForm();
        fetchAdmins(); // Recargar la lista
    } catch (error) {
        console.error("Error al actualizar admin:", error);
        toast({ title: "Error", description: error.response?.data?.error || "Error al actualizar.", status: "error", duration: 3000, isClosable: true });
    }
  };
    
  // Lógica para eliminar el admin
  const handleDelete = async (adminId) => {
    if (window.confirm(`¿Estás seguro de eliminar el administrador con ID ${adminId}? Esta acción es irreversible.`)) {
      setLoading(true);
      try {
        await deleteUsuario(adminId);
        toast({ title: "Admin Eliminado", description: `El admin ID ${adminId} fue eliminado.`, status: "info", duration: 3000, isClosable: true });
        // Si eliminamos el que estábamos editando, salimos del modo edición
        if (adminToEdit && adminToEdit.id === adminId) {
            resetForm();
        }
        fetchAdmins(); // Recargar la lista
      } catch (error) {
        console.error("Error al eliminar admin:", error);
        toast({ title: "Error", description: error.response?.data?.error || "Error al eliminar admin.", status: "error", duration: 3000 });
      } finally {
        setLoading(false);
      }
    }
  };

  // Lógica para volver al panel
  const handleGoBack = () => {
    navigate("/admin-techniques"); 
  };

  return (
    <Box maxW="900px" mx="auto" mt="50px" p="6" borderWidth="1px" borderRadius="lg" boxShadow="lg">
      
      {/* FORMULARIO */}
      <Box maxW="400px" mx="auto">
        <Heading mb="6" size="lg" textAlign="center" color={adminToEdit ? "orange.500" : "green.600"}>
          {adminToEdit ? `Editar Admin (ID: ${adminToEdit.id})` : "Registrar Nuevo Admin"}
        </Heading>
        <Text fontSize="sm" mb={4} textAlign="center" color="gray.500">
          {adminToEdit 
            ? "Modo Edición. Ingresa nuevos datos para actualizar los campos deseados." 
            : "Modo Registro."}
        </Text>
        
        <form onSubmit={handleSubmit}>
          <FormControl mb="4">
            <FormLabel>Nombre</FormLabel>
            <Input name="nombre" value={form.nombre} onChange={handleChange} required />
          </FormControl>

          <FormControl mb="4">
            <FormLabel>Apellido</FormLabel>
            <Input name="apellido" value={form.apellido} onChange={handleChange} required />
          </FormControl>

          <FormControl mb="4">
            <FormLabel>Email</FormLabel>
            <Input type="email" name="email" value={form.email} onChange={handleChange} required />
          </FormControl>

          <FormControl mb="6">
            <FormLabel>Contraseña {adminToEdit && "(Deja vacío para no cambiar)"}</FormLabel>
            <Input
              type="password"
              name="contrasena"
              value={form.contrasena}
              onChange={handleChange}
              required={!adminToEdit} // Solo requerido en modo registro
            />
          </FormControl>
          <Stack direction="column" spacing={3}>
            <Button type="submit" colorScheme={adminToEdit ? "orange" : "green"} width="full" isLoading={loading} isDisabled={listLoading}>
              {adminToEdit ? "Guardar Cambios del Admin" : "Registrar Nuevo Admin"}
            </Button>

            {adminToEdit && (
                <Button colorScheme="red" width="full" onClick={() => handleDelete(adminToEdit.id)} isLoading={loading} isDisabled={listLoading}>
                    Eliminar Administrador (ID: {adminToEdit.id})
                </Button>
            )}
            
            {adminToEdit && (
                <Button colorScheme="blue" width="full" onClick={resetForm} isDisabled={loading || listLoading}>
                    Cancelar Edición y Registrar Nuevo
                </Button>
            )}
            
            <Divider mt={3} />
            
            <Button 
                colorScheme="gray" 
                width="full" 
                onClick={handleGoBack}
                isDisabled={loading || listLoading}
            >
              Volver al Panel de Técnicas
            </Button>
          </Stack>
        </form>
      </Box>

      <Divider my={10} />
      
      {/* LISTADO DE ADMINS */}
      <Heading size="md" mb="4" textAlign="center">
        Lista de Administradores ({admins.length})
      </Heading>

      <Box overflowX="auto">
        {listLoading ? (
            <HStack justify="center" p={5}>
                <Spinner size="lg" />
                <Text>Cargando administradores...</Text>
            </HStack>
        ) : (
            <Table variant="simple" size="sm">
            <Thead>
                <Tr>
                <Th>ID</Th>
                <Th>Nombre</Th>
                <Th>Email</Th>
                <Th textAlign="center">Acciones</Th>
                </Tr>
            </Thead>
            <Tbody>
                {admins.map((admin) => (
                <Tr key={admin.id} bg={adminToEdit && adminToEdit.id === admin.id ? "yellow.50" : "white"}>
                    <Td fontWeight="bold">{admin.id}</Td>
                    <Td>{admin.nombre} {admin.apellido}</Td>
                    <Td>{admin.email}</Td>
                    <Td>
                    <HStack spacing={2} justify="center">
                        <Button 
                            size="xs" 
                            colorScheme="orange" 
                            onClick={() => handleEditClick(admin)}
                            isDisabled={loading}
                        >
                            Editar
                        </Button>
                        <Button 
                            size="xs" 
                            colorScheme="red" 
                            onClick={() => handleDelete(admin.id)}
                            isDisabled={loading}
                        >
                            Eliminar
                        </Button>
                    </HStack>
                    </Td>
                </Tr>
                ))}
            </Tbody>
            </Table>
        )}
      </Box>
    </Box>
  );
}