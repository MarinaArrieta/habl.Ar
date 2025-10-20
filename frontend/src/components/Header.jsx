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
    const { usuario } = useContext(UserContext);

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

                {usuario?.tipo === "admin" && (
                    <NavLink to="admin-techniques">
                        <Text _hover={{ color: "blue.50" }}>Panel Admin</Text>
                    </NavLink>
                )}
                {usuario?.tipo === "psicologo" && (
                    <NavLink to={`/psicologo/${usuario.id}`}>
                        <Text
                            fontSize="18px"
                            color="primary.500"
                            _hover={{ color: "blue.50" }}
                        >
                            Mi Perfil
                        </Text>
                    </NavLink>
                )}

                {!usuario ? (
                    <>
                        <NavLink to="login">
                            <Text fontSize="18px" color="primary.500" _hover={{color: "blue.50"}}>
                                Acceder
                            </Text>
                        </NavLink>
                    </>
                ) : (
                    <LogoutButton />
                )}
                <NavLink to="sobre-nosotros" onClick={onClose}>
                    <Text fontSize="18px" color="primary.500" _hover={{color: "blue.50"}}>Sobre Nosotros</Text>
                </NavLink>
                <NavLink to="faq">
                    <Text fontSize="18px" color="primary.500" _hover={{color: "blue.50"}}>
                        Dudas Comunes
                    </Text>
                </NavLink>
                <NavLink to="psicologos">
                    <Text fontSize="18px" color="primary.500" _hover={{color: "blue.50"}}>
                        Psicólogos
                    </Text>
                </NavLink>
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
                            <NavLink to="techniques" onClick={onClose}>
                                <Text fontSize="20px" _hover={{color: "blue.50"}}transition="color 0.2s">
                                    Técnicas
                                </Text>
                            </NavLink>
                            {usuario?.tipo === "admin" && (
                                <NavLink to="admin-techniques" onClick={onClose}>
                                    <Text fontSize="20px" _hover={{color: "blue.50"}}transition="color 0.2s">
                                        Panel Admin
                                    </Text>
                                </NavLink>
                            )}
                            {usuario?.tipo === "psicologo" && (
                                <NavLink to={`/psicologo/${usuario.id}`} onClick={onClose}>
                                    <Text fontSize="20px" _hover={{color: "blue.50"}}transition="color 0.2s">
                                        Mi Perfil
                                    </Text>
                                </NavLink>
                            )}
                            {!usuario ? (
                                <>
                                    <NavLink to="login" onClick={onClose}>
                                        <Text fontSize="20px" _hover={{color: "blue.50"}}>
                                            Login
                                        </Text>
                                    </NavLink>
                                </>
                            ) : (
                                <LogoutButton />
                            )}
                            <NavLink to="sobre-nosotros" onClick={onClose}>
                                <Text fontSize="20px" _hover={{color: "blue.50"}}>Sobre Nosotros</Text>
                            </NavLink>
                            <NavLink to="faq" onClick={onClose}>
                                <Text fontSize="20px" _hover={{color: "blue.50"}}>Dudas Comunes</Text>
                            </NavLink>
                            <NavLink to="psicologos" onClick={onClose}>
                                <Text fontSize="20px" _hover={{color: "blue.50"}}>Psicólogos</Text>
                            </NavLink>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </HStack>
    );
}