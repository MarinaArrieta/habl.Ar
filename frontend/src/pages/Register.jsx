import { useState, useEffect, useMemo } from "react";
import {
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
    Link,
    Text,
    Alert,
    AlertIcon,
} from "@chakra-ui/react";
import { useLocation, useNavigate, Link as RouterLink } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { registerPublic } from "../services/psicologosService";
import { CheckCircleIcon } from "@chakra-ui/icons";

const LOCAL_STORAGE_KEY = "registerFormData";
/**
 * @param {string} inputString
 * @returns {string}
 */
const formatNameInput = (inputString) => {

    const onlyLetters = inputString.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");

    if (onlyLetters === "") return "";

    return onlyLetters.charAt(0).toUpperCase() + onlyLetters.slice(1).toLowerCase();
};

/**
 * Valida si un archivo tiene una extensión permitida.
 * @param {File | null} file
 * @param {string[]} allowedExtensions
 * @returns {boolean}
 */
const isFileExtensionValid = (file, allowedExtensions) => {
    if (!file) return true;
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    return allowedExtensions.includes(fileExtension);
};

const calculateAge = (dateString) => {
    if (!dateString) return 0;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};


export default function Register() {

    const toast = useToast();
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [cursoAprobadoKey, setCursoAprobadoKey] = useState(null);

    const [passwordValidations, setPasswordValidations] = useState({
        minLength: false,
        hasLetter: false,
        hasSpecialChar: false,
    });

    const profilePicExtensions = useMemo(() => ['png', 'jpg', 'jpeg'], []);
    const docExtensions = useMemo(() => ['png', 'jpg', 'jpeg', 'pdf'], []);
    const getInitialFormData = () => {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);

                return {
                    ...parsedData,
                    foto_titulo: null,
                    certificado: null,
                    foto_perfil: null,
                };
            } catch (e) {
                console.error("Error parsing localStorage data:", e);
                localStorage.removeItem(LOCAL_STORAGE_KEY);
            }
        }
        return {
            nombre: "", apellido: "", email: "", contrasena: "",
            tipo: "comun",
            matricula: "", universidad: "", titulo: "",
            foto_titulo: null, certificado: null,
            fecha_nacimiento: "",
            clave_aprobacion: "",
            foto_perfil: null,
        };
    };

    const [formData, setFormData] = useState(getInitialFormData);

    useEffect(() => {
        const dataToStore = { ...formData };
        delete dataToStore.foto_titulo;
        delete dataToStore.certificado;
        delete dataToStore.foto_perfil;

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToStore));
    }, [formData]);


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

            setFormData(prev => ({
                ...prev,
                tipo: 'voluntario',
                clave_aprobacion: location.state.cursoAprobadoKey || prev.clave_aprobacion
            }));
        }
    }, [location.state, toast]);

    const handlePasswordChange = (value) => {
        const minLength = value.length >= 6;
        const hasLetter = /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(value);
        const hasSpecialChar = /[-_.,]/.test(value);

        setPasswordValidations({
            minLength,
            hasLetter,
            hasSpecialChar,
        });

        setFormData(prev => ({ ...prev, contrasena: value }));
    }

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            const file = files[0];
            const allowedExtensions = name === 'foto_perfil' ? profilePicExtensions : docExtensions;

            if (file && !isFileExtensionValid(file, allowedExtensions)) {
                toast({
                    title: "Extensión de archivo no permitida",
                    description: `Para ${name.replace('_', ' ')}, solo se permiten: ${allowedExtensions.join(', ').toUpperCase()}.`,
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
                e.target.value = null;
                setFormData(prev => ({ ...prev, [name]: null }));
                return;
            }

            setFormData(prev => ({ ...prev, [name]: file }));
            return;
        }

        if (name === 'nombre' || name === 'apellido') {
            const formattedValue = formatNameInput(value);
            setFormData(prev => ({ ...prev, [name]: formattedValue }));
            return;
        }
        if (name === 'contrasena') {
            handlePasswordChange(value);
            return;
        }
        if (name === 'tipo') {
            let newFormData = { ...formData, [name]: value };

            if (value !== 'psicologo') {
                newFormData = {
                    ...newFormData,
                    matricula: "", universidad: "", titulo: "",
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

        // Manejo específico para Fecha de Nacimiento para guardar solo la fecha (aunque el input[type="date"] ya lo hace)
        if (name === 'fecha_nacimiento') {
            // Asegurarse de que el formato es YYYY-MM-DD
            setFormData(prev => ({ ...prev, [name]: value.split('T')[0] }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Validación de edad
    const isOver18 = useMemo(() => {
        if (formData.tipo === 'voluntario' && formData.fecha_nacimiento) {
            return calculateAge(formData.fecha_nacimiento) >= 18;
        }
        // No aplica la validación si no es voluntario o si falta la fecha.
        return true;
    }, [formData.tipo, formData.fecha_nacimiento]);


    // Validación general para el botón de submit (además de los 'required' del formulario)
    const isFormValid = useMemo(() => {
        const isBaseValid =
            formData.nombre.length > 0 &&
            formData.apellido.length > 0 &&
            formData.email.length > 0 &&
            passwordValidations.minLength &&
            passwordValidations.hasLetter &&
            passwordValidations.hasSpecialChar;

        if (!isBaseValid) return false;

        // Validaciones de archivos: aunque se valida en handleChange, comprobamos que si hay archivo, la extensión es correcta.
        if (formData.foto_perfil && !isFileExtensionValid(formData.foto_perfil, profilePicExtensions)) return false;

        if (formData.tipo === 'psicologo') {
            // Matrícula no es requerida
            const isPsychoDataValid =
                formData.universidad.length > 0 &&
                formData.titulo.length > 0 &&
                formData.foto_titulo !== null && // Requerido
                isFileExtensionValid(formData.foto_titulo, docExtensions) &&
                formData.certificado !== null && // Requerido
                isFileExtensionValid(formData.certificado, docExtensions);
            return isPsychoDataValid;
        }

        if (formData.tipo === 'voluntario') {
            const isVolunteerDataValid =
                formData.fecha_nacimiento.length > 0 &&
                isOver18 && // Agregamos la validación de edad
                formData.clave_aprobacion.length > 0;
            return isVolunteerDataValid;
        }

        return true;
    }, [formData, passwordValidations, profilePicExtensions, docExtensions, isOver18]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid) {
            toast({
                title: "Datos incompletos o incorrectos",
                description: "Por favor, completa todos los campos requeridos y verifica la validez de los datos (nombre, contraseña, edad, clave de voluntario, archivos, etc.).",
                status: "warning",
                duration: 5000,
                isClosable: true
            });
            return;
        }

        setLoading(true);

        // 🔑 Validación de clave antes de enviar (Mejorada para usar la clave en el estado)
        if (formData.tipo === 'voluntario') {
            // Si la clave viene del curso, la usamos para la validación interna
            const claveAUsar = location.state?.cursoAprobadoKey || formData.clave_aprobacion;

            if (!claveAUsar || formData.clave_aprobacion !== claveAUsar) {
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

                if (key !== 'foto_perfil' && (value === null || value === "")) {
                    if (key === 'matricula' && formData.tipo === 'psicologo') {
                        data.append(key, value);
                        return;
                    }
                    return;
                }
                if (formData.tipo !== 'psicologo' && ['matricula', 'universidad', 'titulo', 'foto_titulo', 'certificado'].includes(key)) {
                    return;
                }
                if (formData.tipo !== 'voluntario' && ['fecha_nacimiento', 'clave_aprobacion'].includes(key)) {
                    return;
                }
                if (key === 'foto_perfil' && value === null) {
                    return;
                }

                data.append(key, value);
            });

            await registerPublic(data);

            localStorage.removeItem(LOCAL_STORAGE_KEY);

            if (formData.tipo === 'psicologo') {
                toast({
                    title: "Registro exitoso, ¡pero tu cuenta está Pendiente! ⏳",
                    description: (
                        <>
                            Tu cuenta como **Psicólogo** ha sido creada, pero requiere **aprobación manual**.
                            Revisaremos la documentación y te **avisaremos por email** cuando puedas iniciar sesión. ¡Gracias por tu paciencia!
                        </>
                    ),
                    status: "info",
                    duration: 10000,
                    isClosable: true
                });
            } else {
                toast({
                    title: "Registro Exitoso",
                    description: "Tu cuenta ha sido creada. Por favor, inicia sesión.",
                    status: "success",
                    duration: 5000,
                    isClosable: true
                });
            }
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
                    />
                </Box>
                <form onSubmit={handleSubmit} style={{ width: "100%" }}>

                    <FormControl isRequired mb={4}>
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
                    </FormControl>
                    {formData.tipo === "voluntario" && (
                        <Box p={4} mb={4} borderWidth="1px" borderColor="primary.50" borderRadius="md" bg="formu.50">
                            <Text fontWeight="bold" mb={2} color="violet.200">Pasos para ser Voluntario:</Text>
                            <VStack align="start" spacing={2}>
                                <Link href="/capacitacion-voluntarios.pdf" color="blue.200" isExternal>
                                    👉🏽 Descargar Material de estudio para aprobar el exámen.
                                </Link>
                                <Link href="/curso-voluntario" color="blue.200" >
                                    👉🏽 Obtén la clave aprobando el mini curso de capacitación.
                                </Link>
                            </VStack>
                            {cursoAprobadoKey && (
                                <Alert status='info' mt={3} fontSize="sm" borderRadius="md">
                                    <AlertIcon />
                                    <Text fontWeight="bold">Clave recibida:</Text> {cursoAprobadoKey} (Úsala abajo)
                                </Alert>
                            )}
                        </Box>
                    )}
                    <FormControl isRequired mb={4}>
                        <FormLabel color="violet.50">Nombre</FormLabel>
                        <Input name="nombre" value={formData.nombre} onChange={handleChange} border="1px solid #353887"
                            isInvalid={formData.nombre.length > 0 && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombre)}
                            _focusVisible={{
                                zIndex: 1,
                                borderColor: 'blue.50',
                                boxShadow: '0 0 0 1px #353887',
                            }}
                            _hover={{
                                borderColor: "violet.50"
                            }} />
                        <FormHelperText color="orange.50" visibility={formData.nombre.length > 0 && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombre) ? 'visible' : 'hidden'}>
                            Solo se permiten letras.
                        </FormHelperText>
                        <FormLabel color="violet.50">Apellido</FormLabel>
                        <Input name="apellido" value={formData.apellido} onChange={handleChange} border="1px solid #353887"
                            isInvalid={formData.apellido.length > 0 && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.apellido)}
                            _focusVisible={{
                                zIndex: 1,
                                borderColor: 'blue.50',
                                boxShadow: '0 0 0 1px #353887',
                            }}
                            _hover={{
                                borderColor: "violet.50"
                            }} />
                        <FormHelperText color="orange.50" visibility={formData.apellido.length > 0 && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.apellido) ? 'visible' : 'hidden'}>
                            Solo se permiten letras.
                        </FormHelperText>
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
                            isInvalid={formData.contrasena.length > 0 && !passwordValidations.minLength}
                            _focusVisible={{
                                zIndex: 1,
                                borderColor: 'blue.50',
                                boxShadow: '0 0 0 1px #353887',
                            }}
                            _hover={{
                                borderColor: "violet.50"
                            }} />
                        <VStack align="start" mt={2} spacing={1}>
                            <Text fontSize="sm" color={passwordValidations.minLength ? "green.500" : "orange.500"} fontWeight={passwordValidations.minLength ? "bold" : "normal"}>
                                {passwordValidations.minLength && <CheckCircleIcon mr={1} />} Mínimo 6 caracteres
                            </Text>
                            <Text fontSize="sm" color={passwordValidations.hasLetter ? "green.500" : "orange.500"} fontWeight={passwordValidations.hasLetter ? "bold" : "normal"}>
                                {passwordValidations.hasLetter && <CheckCircleIcon mr={1} />} Contiene al menos una letra
                            </Text>
                            <Text fontSize="sm" color={passwordValidations.hasSpecialChar ? "green.500" : "orange.500"} fontWeight={passwordValidations.hasSpecialChar ? "bold" : "normal"}>
                                {passwordValidations.hasSpecialChar && <CheckCircleIcon mr={1} />} Contiene carácter especial (-, _, ., o ,)
                            </Text>
                        </VStack>
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel color="violet.50">Foto de Perfil (Opcional)</FormLabel>
                        <Input type="file" name="foto_perfil" onChange={handleChange} border="none" p="0"
                            accept={profilePicExtensions.map(ext => `.${ext}`).join(',')}
                            _focusVisible={{
                                zIndex: 1,
                                borderColor: 'blue.50',
                                boxShadow: '0 0 0 1px #353887',
                            }}
                            _hover={{
                                borderColor: "violet.50"
                            }} />
                        <FormHelperText>
                            Sube una foto clara para tu perfil. Extensiones permitidas: **{profilePicExtensions.join(', ').toUpperCase()}**.
                        </FormHelperText>
                    </FormControl>
                    {formData.tipo === "psicologo" && (
                        <Box mt={4} border="1px solid primary.900" borderRadius="lg">
                            <Divider orientation='horizontal' border="1px solid #DA5700" m="30px 0px 30px" />
                            <FormLabel fontWeight="bold" color="blue.50" marginBottom="20px">🧑🏻‍🦰Datos de Psicólogo</FormLabel>
                            <FormControl mb={2}>
                                <FormLabel color="violet.50">Matrícula (Opcional)</FormLabel>
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
                                    accept={docExtensions.map(ext => `.${ext}`).join(',')}
                                    _focusVisible={{
                                        zIndex: 1,
                                        borderColor: 'blue.50',
                                        boxShadow: '0 0 0 1px #353887',
                                    }}
                                    _hover={{
                                        borderColor: "violet.50"
                                    }} />
                                <FormHelperText>
                                    Extensiones permitidas: **{docExtensions.join(', ').toUpperCase()}**.
                                </FormHelperText>
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel color="violet.50">Certificado</FormLabel>
                                <Input type="file" name="certificado" onChange={handleChange} border="none" p="0"
                                    accept={docExtensions.map(ext => `.${ext}`).join(',')}
                                    _focusVisible={{
                                        zIndex: 1,
                                        borderColor: 'blue.50',
                                        boxShadow: '0 0 0 1px #353887',
                                    }}
                                    _hover={{
                                        borderColor: "violet.50"
                                    }} />
                                <FormHelperText>
                                    Extensiones permitidas: **{docExtensions.join(', ').toUpperCase()}**.
                                </FormHelperText>
                            </FormControl>
                        </Box>
                    )}
                    {formData.tipo === "voluntario" && (
                        <Box mt={4}>
                            <Divider orientation='horizontal' border="1px solid #DA5700" m="30px 0px 30px" />
                            <FormLabel fontWeight="bold" color="blue.50" marginBottom="20px">🧑🏻‍🦰 Datos de Voluntario</FormLabel>
                            <FormControl isRequired mb={4} isInvalid={formData.fecha_nacimiento.length > 0 && !isOver18}>
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
                                <FormHelperText color={isOver18 ? "green.500" : "orange.500"} fontWeight="bold">
                                    {isOver18 ? "✅ Eres mayor de 18 años." : "⚠️ Debes ser mayor de 18 años."}
                                </FormHelperText>
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
                        isDisabled={!isFormValid}
                    >
                        Registrarse
                    </Button>
                </form>
            </VStack>
        </VStack>
    );
}