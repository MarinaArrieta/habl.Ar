/* import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Image,
    Input,
    Text,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { login } from "../services/api";
import { UserContext } from "../context/UserContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const { setUsuario } = useContext(UserContext);

    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !contrasena) {
            return toast({
                title: "Campos requeridos",
                description: "Por favor completa todos los campos",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
        }

        setLoading(true);
        try {
            const res = await login({ email, contrasena });

            // Guardar token y usuario
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("usuario", JSON.stringify(res.data.usuario));

            // Actualizar contexto
            setUsuario(res.data.usuario);

            toast({
                title: "Login exitoso 🎉",
                description: `Bienvenido ${res.data.usuario.nombre}`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            // Lógica de redirección con todos los tipos de usuario
            const usuario = res.data.usuario;
            let redirectPath = "/";

            if (usuario.tipo === "admin") {
                redirectPath = "/admin-techniques";
            } else if (usuario.tipo === "psicologo") {
                // 🔑 RUTA DEL PSICÓLOGO
                redirectPath = `/psicologo/${usuario.id}`;
            } else if (usuario.tipo === "voluntario") {
                redirectPath = `/voluntario/${usuario.id}`;
            }

            // 🚀 SOLUCIÓN: Forzar un reinicio (hard reload) del frontend.
            // Esto garantiza que el UserContext se inicie de nuevo y vea el localStorage actualizado.
            window.location.replace(redirectPath);

            // Reset campos
            setEmail("");
            setContrasena("");
        } catch (error) {
            toast({
                title: "Error",
                description: error.response?.data?.error || "Error en login",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <VStack
            mt={10}
            w={{ base: '80%', xl: '60%' }}
            h="83vh"
            marginTop="0"
            alignItems={{ base: 'center', lg: 'center' }}
            justifyContent={{ base: 'center', lg: 'none' }}
            flexDirection={{ base: "column", md: "row" }}
            gap={{ base: 0, md: "50px" }}
        >
            <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                py={{ base: 4, lg: 0 }}
            >
                <Image
                    objectFit='cover'
                    maxW={{ base: "80px", md: '147px' }}
                    src='/saludo.png'
                    alt='Saludo'
                    filter="drop-shadow(-2px 7px 6px #2d2d2d)"
                />
            </Box>
            <VStack>
                <FormControl mb={3}>
                    <FormLabel color="violet.50">Email</FormLabel>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <FormControl mb={3}>
                    <FormLabel color="violet.50">Contraseña</FormLabel>
                    <Input
                        type="password"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
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
                <Button
                    variant='solid3D'
                    colorScheme='primary'
                    onClick={handleLogin}
                    isLoading={loading}
                    width="100%"
                >
                    Iniciar sesión
                </Button>
                <Link to="/register" >
                    <Text color="primary.700" marginTop="15px">
                        ¿No tienes cuenta? Regístrate aquí.
                    </Text>
                </Link>
            </VStack>
        </VStack>
    );
} */

import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom"; // 👈 Descomentamos useNavigate

import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Image,
    Input,
    Text,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { login } from "../services/api";
import { UserContext } from "../context/UserContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const { setUsuario } = useContext(UserContext);

    // 🔑 Ahora sí, descomentamos y usamos `useNavigate` para evitar el hard reload
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !contrasena) {
            return toast({
                title: "Campos requeridos",
                description: "Por favor completa todos los campos",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
        }

        setLoading(true);
        try {
            const res = await login({ email, contrasena });

            // Guardar token y usuario
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("usuario", JSON.stringify(res.data.usuario));

            // Actualizar contexto
            setUsuario(res.data.usuario);

            toast({
                title: "Login exitoso 🎉",
                description: `Bienvenido ${res.data.usuario.nombre}`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            const usuario = res.data.usuario;
            let redirectPath = "/";

            if (usuario.tipo === "admin") {
                redirectPath = "/admin-techniques";
            } else if (usuario.tipo === "psicologo") {
                redirectPath = `/psicologo/${usuario.id}`;
            } else if (usuario.tipo === "voluntario") {
                // ✅ CORRECCIÓN: Cambiamos a la ruta consistente: /voluntario/:id
                redirectPath = `/voluntario/${usuario.id}`;
            }

            // 💡 Usamos navigate, que es el método estándar de React Router
            navigate(redirectPath);

            // Si el contexto (UserContext) no se actualiza a tiempo para cambiar el Header/Navbar,
            // descomenta `window.location.replace(redirectPath);` y comenta `Maps(redirectPath);`

            // Reset campos
            setEmail("");
            setContrasena("");
        } catch (error) {
            toast({
                title: "Error",
                description: error.response?.data?.error || "Error en login",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <VStack
            mt={10}
            w={{ base: '80%', xl: '60%' }}
            h="83vh"
            marginTop="0"
            alignItems={{ base: 'center', lg: 'center' }}
            justifyContent={{ base: 'center', lg: 'none' }}
            flexDirection={{ base: "column", md: "row" }}
            gap={{ base: 0, md: "50px" }}
        >
            <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                py={{ base: 4, lg: 0 }}
            >
                <Image
                    objectFit='cover'
                    maxW={{ base: "80px", md: '147px' }}
                    src='/saludo.png'
                    alt='Saludo'
                    filter="drop-shadow(-2px 7px 6px #2d2d2d)"
                />
            </Box>
            <VStack>
                <FormControl mb={3}>
                    <FormLabel color="violet.50">Email</FormLabel>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <FormControl mb={3}>
                    <FormLabel color="violet.50">Contraseña</FormLabel>
                    <Input
                        type="password"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
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
                <Button
                    variant='solid3D'
                    colorScheme='primary'
                    onClick={handleLogin}
                    isLoading={loading}
                    width="100%"
                >
                    Iniciar sesión
                </Button>
                <Link to="/register" >
                    <Text color="primary.700" marginTop="15px">
                        ¿No tienes cuenta? Regístrate aquí.
                    </Text>
                </Link>
            </VStack>
        </VStack>
    );
}