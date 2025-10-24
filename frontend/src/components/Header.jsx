/* import {
    IconButton,
    Box,
    Text,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    useDisclosure,
    VStack,
    Image,
    HStack,
} from "@chakra-ui/react";
import { IoMenu } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Navbar() {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { usuarioActual } = useContext(UserContext);

    return (
        <HStack
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            w={{ base: '80%', xl: '60%' }}
            h="15vh"
            m={0}
        >
            <Box
                boxSize='sm'
                display='flex'
                alignItems='center'
                h='none'
                w='unset'
            >
                <NavLink as={Link} to="/">
                    <Box
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                        py={{ base: 4, lg: 0 }}
                    >
                        <Image
                            objectFit='cover'
                            maxW={{ base: "66px", md: '87px' }}
                            src='/logo-nombre.png'
                            alt='Personas hablando'
                        />
                    </Box>
                </NavLink>
            </Box>
            <IconButton
                icon={<IoMenu fontSize="30px" />}
                aria-label="Menú"
                display={{ base: "block", lg: "none" }}
                variant="ghost"
                onClick={onOpen}
                color="primary.500"
            />
            <Box display={{ base: "none", lg: "flex" }} gap={6}>
                <NavLink as={Link} to="techniques">
                    <Text
                        fontSize="18px"
                        color="primary.500"
                        fontFamily="fonts.body"
                        _hover={{ color: "blue.50" }}
                    >
                        Técnicas
                    </Text>
                </NavLink>
                <NavLink to="sobre-nosotros" onClick={onClose}>
                    <Text fontSize="18px" color="primary.500" _hover={{ color: "blue.50" }}>Sobre Nosotros</Text>
                </NavLink>
                <NavLink to="faq">
                    <Text fontSize="18px" color="primary.500" _hover={{ color: "blue.50" }}>
                        Dudas Comunes
                    </Text>
                </NavLink>
                <NavLink to="psicologos">
                    <Text fontSize="18px" color="primary.500" _hover={{ color: "blue.50" }}>
                        Psicólogos
                    </Text>
                </NavLink>
                {usuarioActual?.tipo === "admin" && (
                    <NavLink to="admin-techniques">
                        <Text fontSize="18px" color="primary.500" _hover={{ color: "blue.50" }} fontWeight="bold">Panel</Text>
                    </NavLink>
                )}
                {usuarioActual?.tipo === "psicologo" && (
                    <NavLink to={`/psicologo/${usuarioActual.id}`}>
                        <Text
                            fontSize="18px"
                            color="primary.500"
                            _hover={{ color: "blue.50" }}
                        >
                            Mi Perfil
                        </Text>
                    </NavLink>
                )}
                {!usuarioActual ? (
                    <>
                        <NavLink to="login">
                            <Text fontSize="18px" color="primary.500" _hover={{ color: "blue.50" }}>
                                Acceder
                            </Text>
                        </NavLink>
                    </>
                ) : (
                    <LogoutButton />
                )}
            </Box>
            <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent
                    bg="#F0DCC9"
                    color="primary.500"
                    width="200px"
                >
                    <DrawerCloseButton color="red.700" />
                    <DrawerHeader>
                        <Image w='80px' src='/logo-hablar.png' alt='Logo Hablar' />
                    </DrawerHeader>
                    <DrawerBody>
                        <VStack align="start" spacing={4}>
                            {usuarioActual?.tipo === "admin" && (
                                <NavLink to="admin-techniques" onClick={onClose}>
                                    <Text fontSize="20px" _hover={{ color: "blue.50" }} transition="color 0.2s">
                                        Panel Admin
                                    </Text>
                                </NavLink>
                            )}
                            <NavLink to="techniques" onClick={onClose}>
                                <Text fontSize="20px" _hover={{ color: "blue.50" }} transition="color 0.2s">
                                    Técnicas
                                </Text>
                            </NavLink>
                            {usuarioActual?.tipo === "psicologo" && (
                                <NavLink to={`/psicologo/${usuarioActual.id}`} onClick={onClose}>
                                    <Text fontSize="20px" _hover={{ color: "blue.50" }} transition="color 0.2s">
                                        Mi Perfil
                                    </Text>
                                </NavLink>
                            )}
                            {!usuarioActual ? (
                                <>
                                    <NavLink to="login" onClick={onClose}>
                                        <Text fontSize="20px" _hover={{ color: "blue.50" }}>
                                            Login
                                        </Text>
                                    </NavLink>
                                </>
                            ) : (
                                <LogoutButton />
                            )}
                            <NavLink to="sobre-nosotros" onClick={onClose}>
                                <Text fontSize="20px" _hover={{ color: "blue.50" }}>Sobre Nosotros</Text>
                            </NavLink>
                            <NavLink to="faq" onClick={onClose}>
                                <Text fontSize="20px" _hover={{ color: "blue.50" }}>Dudas Comunes</Text>
                            </NavLink>
                            <NavLink to="psicologos" onClick={onClose}>
                                <Text fontSize="20px" _hover={{ color: "blue.50" }}>Psicólogos</Text>
                            </NavLink>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </HStack>
    );
}
 */

import {
    IconButton,
    Box,
    Text,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    useDisclosure,
    VStack,
    Image,
    HStack,
} from "@chakra-ui/react";
import { IoMenu } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Navbar() {

    const { isOpen, onOpen, onClose } = useDisclosure();
    // NOTA: Asumiremos que el contexto provee 'usuarioActual' que contiene 'id' y 'tipo'.
    const { usuarioActual } = useContext(UserContext);

    const PerfilLink = ({ type, onClose }) => {
        if (!usuarioActual || usuarioActual.tipo !== type) return null;

        let path;
        let text;

        // Define la ruta y el texto según el tipo de usuario
        if (type === "psicologo") {
            path = `/psicologo/${usuarioActual.id}`;
            text = "Mi Perfil (Psicólogo)";
        } else if (type === "voluntario") {
            path = `/voluntario/${usuarioActual.id}`;
            text = "Mi Perfil";
        } else {
            return null;
        }

        return (
            <NavLink to={path} onClick={onClose}>
                <Text
                    fontSize={onClose ? "20px" : "18px"} // 20px para Drawer, 18px para desktop
                    color="primary.500"
                    _hover={{ color: "blue.50" }}
                    transition="color 0.2s"
                >
                    {text}
                </Text>
            </NavLink>
        );
    };


    return (
        <HStack
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            w={{ base: '80%', xl: '60%' }}
            h="15vh"
            m={0}
        >
            <Box
                boxSize='sm'
                display='flex'
                alignItems='center'
                h='none'
                w='unset'
            >
                <NavLink as={Link} to="/">
                    <Box
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                        py={{ base: 4, lg: 0 }}
                    >
                        <Image
                            objectFit='cover'
                            maxW={{ base: "66px", md: '87px' }}
                            src='/logo-nombre.png'
                            alt='Personas hablando'
                        />
                    </Box>
                </NavLink>
            </Box>
            <IconButton
                icon={<IoMenu fontSize="30px" />}
                aria-label="Menú"
                display={{ base: "block", lg: "none" }}
                variant="ghost"
                onClick={onOpen}
                color="primary.500"
            />
            <Box display={{ base: "none", lg: "flex" }} gap={6}>
                <NavLink as={Link} to="techniques">
                    <Text
                        fontSize="18px"
                        color="primary.500"
                        fontFamily="fonts.body"
                        _hover={{ color: "blue.50" }}
                    >
                        Técnicas
                    </Text>
                </NavLink>
                <NavLink to="sobre-nosotros" onClick={onClose}>
                    <Text fontSize="18px" color="primary.500" _hover={{ color: "blue.50" }}>Sobre Nosotros</Text>
                </NavLink>
                <NavLink to="faq">
                    <Text fontSize="18px" color="primary.500" _hover={{ color: "blue.50" }}>
                        Dudas Comunes
                    </Text>
                </NavLink>
                <NavLink to="psicologos">
                    <Text fontSize="18px" color="primary.500" _hover={{ color: "blue.50" }}>
                        Psicólogos
                    </Text>
                </NavLink>

                {/* 1. Mi Perfil - VOLUNTARIO (Desktop) */}
                <PerfilLink type="voluntario" onClose={null} />

                {/* 2. Mi Perfil - PSICÓLOGO (Desktop) */}
                <PerfilLink type="psicologo" onClose={null} />

                {/* 3. Panel Admin (Desktop) */}
                {usuarioActual?.tipo === "admin" && (
                    <NavLink to="admin-techniques">
                        <Text fontSize="18px" color="primary.500" _hover={{ color: "blue.50" }} fontWeight="bold">Panel</Text>
                    </NavLink>
                )}

                {!usuarioActual ? (
                    <>
                        <NavLink to="login">
                            <Text fontSize="18px" color="primary.500" _hover={{ color: "blue.50" }}>
                                Acceder
                            </Text>
                        </NavLink>
                    </>
                ) : (
                    <LogoutButton />
                )}
            </Box>
            <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent
                    bg="#F0DCC9"
                    color="primary.500"
                    width="200px"
                >
                    <DrawerCloseButton color="red.700" />
                    <DrawerHeader>
                        <Image w='80px' src='/logo-hablar.png' alt='Logo Hablar' />
                    </DrawerHeader>
                    <DrawerBody>
                        <VStack align="start" spacing={4}>

                            {/* 4. Panel Admin (Drawer) */}
                            {usuarioActual?.tipo === "admin" && (
                                <NavLink to="admin-techniques" onClick={onClose}>
                                    <Text fontSize="20px" _hover={{ color: "blue.50" }} transition="color 0.2s" fontWeight="bold">
                                        Panel Admin
                                    </Text>
                                </NavLink>
                            )}

                            {/* 5. Mi Perfil - VOLUNTARIO (Drawer) */}
                            <PerfilLink type="voluntario" onClose={onClose} />

                            {/* 6. Mi Perfil - PSICÓLOGO (Drawer) */}
                            <PerfilLink type="psicologo" onClose={onClose} />

                            <NavLink to="techniques" onClick={onClose}>
                                <Text fontSize="20px" _hover={{ color: "blue.50" }} transition="color 0.2s">
                                    Técnicas
                                </Text>
                            </NavLink>
                            <NavLink to="sobre-nosotros" onClick={onClose}>
                                <Text fontSize="20px" _hover={{ color: "blue.50" }}>Sobre Nosotros</Text>
                            </NavLink>
                            <NavLink to="faq" onClick={onClose}>
                                <Text fontSize="20px" _hover={{ color: "blue.50" }}>Dudas Comunes</Text>
                            </NavLink>
                            <NavLink to="psicologos" onClick={onClose}>
                                <Text fontSize="20px" _hover={{ color: "blue.50" }}>Psicólogos</Text>
                            </NavLink>

                            {!usuarioActual ? (
                                <>
                                    <NavLink to="login" onClick={onClose}>
                                        <Text fontSize="20px" _hover={{ color: "blue.50" }}>
                                            Login
                                        </Text>
                                    </NavLink>
                                </>
                            ) : (
                                <LogoutButton />
                            )}
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </HStack>
    );
}