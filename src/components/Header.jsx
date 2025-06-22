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
} from "@chakra-ui/react";
import { IoMenu } from "react-icons/io5";
import { NavLink } from "react-router-dom";

export default function Navbar() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Container display="flex" justifyContent="space-between" alignItems="center" py={4}>
            <Box
                boxSize='sm'
                display='flex'
                alignItems='center'
                h='none'
            >
                <Image
                    w={{ base: '60px', md: '100px' }}
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
                icon={<IoMenu />}
                aria-label="Menú"
                display={{ base: "block", sm: "none" }}
                variant="ghost"
                fontSize="24px"
                onClick={onOpen}
                color="primary.500"
            />

            {/* Links visibles SOLO en sm hacia arriba */}
            <Box display={{ base: "none", sm: "flex" }} gap={6}>
                <NavLink to="/login">
                    <Text fontSize={{ base: "18px", md: "25px", lg: "29px" }}>Login</Text>
                </NavLink>
                <NavLink to="/register">
                    <Text fontSize={{ base: "18px", md: "25px", lg: "29px" }}>Registrate</Text>
                </NavLink>
                <NavLink to="/faq">
                    <Text fontSize={{ base: "18px", md: "25px", lg: "29px" }}>Preguntas Frecuentes</Text>
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
                            <NavLink to="/login" onClick={onClose}>
                                <Text fontSize="20px">Login</Text>
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
        </Container>
    );
}
