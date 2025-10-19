import { useState, useEffect } from "react";
import {
    // AÑADE 'Link' DE CHAKRA UI AQUÍ
    FormControl,
    FormLabel,
    Input,
    Button,
    Select,
    FormHelperText,
    Box,
    useToast,
    Divider,
    VStack,
    Image,
    Link, // <-- Importado desde Chakra UI
    Center
} from "@chakra-ui/react";
// RENOMBRA EL LINK DE REACT-ROUTER-DOM A 'RouterLink'
import { useLocation, useNavigate, Link as RouterLink } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function Register() {

    const toast = useToast();
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [cursoAprobadoKey, setCursoAprobadoKey] = useState(null);

    const [formData, setFormData] = useState({
        nombre: "", apellido: "", email: "", contrasena: "",
        tipo: "comun",
        matricula: "", universidad: "", titulo: "",
        foto_titulo: null, certificado: null,
        fecha_nacimiento: "",
        clave_aprobacion: "",
    });

    useEffect(() => {

        if (location.state && location.state.cursoAprobadoKey) {
            setCursoAprobadoKey(location.state.cursoAprobadoKey);

            toast({
                title: "Clave de Curso Recibida",
                description: `¡Felicidades! Usa la clave ${location.state.cursoAprobadoKey} para registrarte como voluntario.`,
                status: "info",
                duration: 8000,
                isClosable: true
            });

            setFormData(prev => ({ ...prev, tipo: 'voluntario' }));
        }
    }, [location.state, toast]);

    const handleChange = (e) => {
        const { name, value, files, type } = e.target;


        if (files) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
            return;
        }

        if (name === 'tipo') {

            let newFormData = { ...formData, [name]: value };

            if (value !== 'psicologo') {
                newFormData = {
                    ...newFormData,
                    matricula: "", universidad: "", titulo: "",
                    foto_titulo: null, certificado: null,
                };
            }
            if (value !== 'voluntario') {
                newFormData = {
                    ...newFormData,
                    fecha_nacimiento: "",
                    clave_aprobacion: "",
                };
            }
            setFormData(newFormData);
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.tipo === 'voluntario') {
            if (!cursoAprobadoKey || formData.clave_aprobacion !== cursoAprobadoKey) {
                toast({
                    title: "Clave Inválida",
                    description: "La clave de aprobación no es correcta. Asegúrate de haber aprobado el curso.",
                    status: "error",
                    duration: 6000,
                    isClosable: true
                });
                setLoading(false);
                return;
            }
        }

        try {
            const data = new FormData();

            Object.keys(formData).forEach(key => {
                const value = formData[key];

                if (value === null || value === "") {
                    return;
                }
                if (formData.tipo !== 'psicologo' && ['matricula', 'universidad', 'titulo', 'foto_titulo', 'certificado'].includes(key)) {
                    return;
                }
                if (formData.tipo !== 'voluntario' && ['fecha_nacimiento', 'clave_aprobacion'].includes(key)) {
                    return;
                }

                data.append(key, value);
            });

            await registerPublic(data);

            toast({
                title: "Registro Exitoso",
                description: "Tu cuenta ha sido creada. Por favor, inicia sesión.",
                status: "success",
                duration: 5000,
                isClosable: true
            });

            navigate('/login');

        } catch (err) {
            const errorMessage = err.response?.data?.error || "Error de red/servidor. Inténtalo de nuevo.";
            toast({
                title: "Error al registrar",
                description: errorMessage,
                status: "error",
                duration: 5000,
                isClosable: true
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <VStack w={{ base: '80%', xl: '60%' }}>
            <VStack alignItems="flex-start" w="100%">
                {/* Usa RouterLink para la navegación interna */}
                <RouterLink to="/login">
                    <Button
                        variant="solid3D"
                        colorScheme='primary'
                        alignSelf="flex-start"
                        m={4}
                        borderRadius="full"
                        marginLeft="15px"
                        marginBottom="27px"
                        p="15px"
                    >
                        <FaArrowLeft />
                    </Button>
                </RouterLink>
            </VStack>
            <VStack
                mt={10}
                w="100%"
                marginTop="0"
                alignItems={{ base: 'center', lg: 'center' }}
                justifyContent={{ base: 'center', lg: 'none' }}
                flexDirection={{ base: "column" }}
                gap={{ base: 0, md: "6px" }}
            >
                <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    py={{ base: 4, lg: 0 }}
                    paddingBottom="0px"
                >
                    <Image
                        objectFit='cover'
                        maxW={{ base: "163px", md: '177px' }}
                        src='/registrate.png'
                        alt='Registro'
                        /* filter="drop-shadow(-2px 7px 6px #2d2d2d)" */
                    />
                </Box>
                <FormControl onSubmit={handleSubmit} width="100%">
                    <FormLabel mt={4} color="violet.50">Tipo de Usuario</FormLabel>
                    <Select name="tipo" value={formData.tipo} onChange={handleChange} border="1px solid #353887"
                        _focusVisible={{
                            zIndex: 1,
                            borderColor: 'blue.50',
                            boxShadow: '0 0 0 1px #353887',
                        }}
                        _hover={{
                            borderColor: "violet.50"
                        }}>
                        <option value="comun">Usuario común</option>
                        <option value="psicologo">Psicólogo</option>
                        <option value="voluntario">Voluntario</option>
                    </Select>
                    <FormControl isRequired mb={4}>
                        <FormLabel color="violet.50">Nombre</FormLabel>
                        <Input name="nombre" value={formData.nombre} onChange={handleChange} border="1px solid #353887"
                            _focusVisible={{
                                zIndex: 1,
                                borderColor: 'blue.50',
                                boxShadow: '0 0 0 1px #353887',
                            }}
                            _hover={{
                                borderColor: "violet.50"
                            }} />
                        <FormLabel color="violet.50">Apellido</FormLabel>
                        <Input name="apellido" value={formData.apellido} onChange={handleChange} border="1px solid #353887"
                            _focusVisible={{
                                zIndex: 1,
                                borderColor: 'blue.50',
                                boxShadow: '0 0 0 1px #353887',
                            }}
                            _hover={{
                                borderColor: "violet.50"
                            }} />
                        <FormLabel color="violet.50">Email</FormLabel>
                        <Input type="email" name="email" value={formData.email} onChange={handleChange} border="1px solid #353887"
                            _focusVisible={{
                                zIndex: 1,
                                borderColor: 'blue.50',
                                boxShadow: '0 0 0 1px #353887',
                            }}
                            _hover={{
                                borderColor: "violet.50"
                            }} />
                        <FormLabel color="violet.50">Contraseña</FormLabel>
                        <Input type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} border="1px solid #353887"
                            _focusVisible={{
                                zIndex: 1,
                                borderColor: 'blue.50',
                                boxShadow: '0 0 0 1px #353887',
                            }}
                            _hover={{
                                borderColor: "violet.50"
                            }} />
                    </FormControl>
                    {/* PSICÓLOGO */}
                    {formData.tipo === "psicologo" && (
                        <Box mt={4} border="1px solid primary.900" borderRadius="lg">
                            <Divider orientation='horizontal' border="1px solid #DA5700" m="30px 0px 30px" />
                            <FormLabel fontWeight="bold" color="blue.50" marginBottom="20px">🧑🏻‍🦰Datos de Psicólogo</FormLabel>
                            <FormControl isRequired mb={2}>
                                <FormLabel color="violet.50">Matrícula</FormLabel>
                                <Input name="matricula" value={formData.matricula} onChange={handleChange} border="1px solid #353887"
                                    _focusVisible={{
                                        zIndex: 1,
                                        borderColor: 'blue.50',
                                        boxShadow: '0 0 0 1px #353887',
                                    }}
                                    _hover={{
                                        borderColor: "violet.50"
                                    }} />
                            </FormControl>
                            <FormControl isRequired mb={2}>
                                <FormLabel color="violet.50">Universidad</FormLabel>
                                <Input name="universidad" value={formData.universidad} onChange={handleChange} border="1px solid #353887"
                                    _focusVisible={{
                                        zIndex: 1,
                                        borderColor: 'blue.50',
                                        boxShadow: '0 0 0 1px #353887',
                                    }}
                                    _hover={{
                                        borderColor: "violet.50"
                                    }} />
                            </FormControl>
                            <FormControl isRequired mb={2}>
                                <FormLabel color="violet.50">Título</FormLabel>
                                <Input name="titulo" value={formData.titulo} onChange={handleChange} border="1px solid #353887"
                                    _focusVisible={{
                                        zIndex: 1,
                                        borderColor: 'blue.50',
                                        boxShadow: '0 0 0 1px #353887',
                                    }}
                                    _hover={{
                                        borderColor: "violet.50"
                                    }} />
                            </FormControl>
                            <FormControl isRequired mb={2}>
                                <FormLabel color="violet.50">Foto Título</FormLabel>
                                <Input type="file" name="foto_titulo" onChange={handleChange} border="none" p="0"
                                    _focusVisible={{
                                        zIndex: 1,
                                        borderColor: 'blue.50',
                                        boxShadow: '0 0 0 1px #353887',
                                    }}
                                    _hover={{
                                        borderColor: "violet.50"
                                    }} />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel color="violet.50">Certificado</FormLabel>
                                <Input type="file" name="certificado" onChange={handleChange} border="none" p="0"
                                    _focusVisible={{
                                        zIndex: 1,
                                        borderColor: 'blue.50',
                                        boxShadow: '0 0 0 1px #353887',
                                    }}
                                    _hover={{
                                        borderColor: "violet.50"
                                    }} />
                            </FormControl>
                        </Box>
                    )}
                    {/* VOLUNTARIOS */}
                    {formData.tipo === "voluntario" && (
                        <Box mt={4}>
                            <Divider orientation='horizontal' border="1px solid #DA5700" m="30px 0px 30px" />
                            <FormLabel fontWeight="bold" color="blue.50" marginBottom="20px">🧑🏻‍🦰 Datos de Voluntario</FormLabel>
                            <FormControl isRequired mb={4}>
                                <FormLabel color="violet.50">Fecha de Nacimiento</FormLabel>
                                <Input
                                    type="date"
                                    name="fecha_nacimiento"
                                    value={formData.fecha_nacimiento}
                                    onChange={handleChange}
                                    max={new Date().toISOString().split('T')[0]}
                                    border="1px solid #353887"
                                    _focusVisible={{
                                        zIndex: 1,
                                        borderColor: 'blue.50',
                                        boxShadow: '0 0 0 1px #353887',
                                    }}
                                    _hover={{
                                        borderColor: "violet.50"
                                    }}
                                />
                                <FormHelperText color="orange.50" fontWeight="bold">⚠️ Debes ser mayor de 18 años.</FormHelperText>
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel color="violet.50">Clave de Aprobación del Curso</FormLabel>
                                <Input
                                    name="clave_aprobacion"
                                    value={formData.clave_aprobacion}
                                    onChange={handleChange}
                                    placeholder="Introduce tu clave de 4 dígitos"
                                    maxLength={4}
                                    border="1px solid #353887"
                                    _focusVisible={{
                                        zIndex: 1,
                                        borderColor: 'blue.50',
                                        boxShadow: '0 0 0 1px #353887',
                                    }}
                                    _hover={{
                                        borderColor: "violet.50"
                                    }}
                                />
                                <FormHelperText marginTop="20px" display={{ base: "column", lg: "flex" }} justifyContent="space-between">
                                    <Link href="/capacitacion-voluntarios.pdf" color="blue.500" isExternal>
                                        👉🏽 Descargar Material de estudio para aprobar el exámen.
                                    </Link>
                                    <Divider
                                        orientation={{ base: 'horizontal', lg: 'vertical' }}
                                        border="1px solid #353887"
                                        h={{lg: "21px"}}
                                        m={{base: "10px 0", lg: "0"}}
                                        opacity="unset"
                                        _focusVisible={{
                                            zIndex: 1,
                                            borderColor: 'blue.50',
                                            boxShadow: '0 0 0 1px #353887',
                                        }}
                                        _hover={{
                                            borderColor: "violet.50"
                                        }} 
                                    />
                                    <Link href="/curso-voluntario" color="blue.500">
                                        👉🏽 Obtén la clave aprobando el mini curso de capacitación.
                                    </Link>
                                </FormHelperText>
                                {cursoAprobadoKey && (
                                    <FormHelperText color="green.500" fontWeight="bold">
                                        Clave actual: {cursoAprobadoKey} (¡Cópiala y úsala!)
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Box>
                    )}
                    <Button
                        type="submit"
                        variant='solid3D'
                        colorScheme='primary'
                        width="full"
                        isLoading={loading}
                        m="45px 0px"
                    >
                        Registrarse
                    </Button>
                </FormControl>
            </VStack>
        </VStack>
    );
}