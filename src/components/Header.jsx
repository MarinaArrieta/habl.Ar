import {
    Container,
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
    Heading,
    HStack,
} from "@chakra-ui/react";
import { IoMenu } from "react-icons/io5";
import { NavLink } from "react-router-dom";

export default function Navbar() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <HStack
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p='18px'
            w='100%'
            m={0}
        >
            <Box
                boxSize='sm'
                display='flex'
                alignItems='center'
                h='none'
                w='unset'
            >
                <Image
                    w={{ base: '60px', md: '75px' }}
                    src='/logo-hablar.png'
                    alt='Logo Hablar'
                />
                <Heading
                    fontSize={{ base: '1.8rem' }}
                    color="primary.500"
                >
                    Habl.Ar
                </Heading>
            </Box>
            {/* Menú hamburguesa SOLO en mobile */}
            <IconButton
                icon={<IoMenu fontSize="30px" />}
                aria-label="Menú"
                display={{ base: "block", lg: "none" }}
                variant="ghost"
                onClick={onOpen}
                color="primary.500"
            />

            {/* Links visibles SOLO en sm hacia arriba */}
            <Box
                display={{ base: "none", lg: "flex" }}
                gap={6}
            >
                <NavLink to="/techniques">
                    <Text fontSize="18px" color="primary.500">
                        Técnicas
                    </Text>
                </NavLink>
                <NavLink to="/login">
                    <Text fontSize="18px" color="primary.500">
                        Login
                    </Text>
                </NavLink>
                <NavLink to="/register">
                    <Text fontSize="18px" color="primary.500">
                        Registrate
                    </Text>
                </NavLink>
                <NavLink to="/faq">
                    <Text fontSize="18px" color="primary.500">
                        Preguntas Frecuentes
                    </Text>
                </NavLink>
            </Box>
            <Drawer
                size="full"
                placement="right"
                onClose={onClose}
                isOpen={isOpen}
                backgroundColor=''
            >
                <DrawerOverlay />
                <DrawerContent bg="secondary.500" color="primary.500">
                    <DrawerCloseButton />
                    <DrawerHeader>
                        <Image
                            w='80px'
                            src='/logo-hablar.png'
                            alt='Logo Hablar'
                        />
                    </DrawerHeader>
                    <DrawerBody >
                        <VStack align="start" spacing={4}>
                            <NavLink to="/techniques" onClick={onClose}>
                                <Text
                                    fontSize="20px"
                                    color="primary.500"
                                    _hover={{ color: "primary.300" }}
                                    transition="color 0.2s"
                                >
                                    Técnicas
                                </Text>
                            </NavLink>
                            <NavLink to="/login" onClick={onClose}>
                                <Text
                                    fontSize="20px"
                                    color="primary.500"
                                    _hover={{ color: "primary.300" }}
                                    transition="color 0.2s"
                                >
                                    Login
                                </Text>
                            </NavLink>
                            <NavLink to="/register" onClick={onClose}>
                                <Text fontSize="20px">Registrate</Text>
                            </NavLink>
                            <NavLink to="/faq" onClick={onClose}>
                                <Text fontSize="20px">Preguntas Frecuentes</Text>
                            </NavLink>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </HStack>
    );
}
