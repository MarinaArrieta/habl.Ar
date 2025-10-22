import { Outlet } from "react-router-dom";
import { VStack, Heading, Box, Container } from "@chakra-ui/react";
import AdminMenu from "../components/MenuAdmin";

export default function AdminLayout() {
    return (
        <Container maxW="container.xl" p={0}>
            <VStack w="full" spacing={5} align="center">
                <Box mt={8}>
                    <Heading mb={1} color="primary.700">
                        Gestión de Usuarios y Contenido
                    </Heading>
                </Box>
                <AdminMenu />
                <Box w={{ base: '95%', md: '80%', xl: '60%' }} p={0} pt={4}>
                    <Outlet />
                </Box>
            </VStack>
        </Container>
    );
}