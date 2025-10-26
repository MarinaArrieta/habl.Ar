import { Link } from "react-router-dom";
import { HStack, Button, Center, Divider } from "@chakra-ui/react";
import { FaUserShield } from "react-icons/fa";

export default function AdminMenu() {
    return (
        <HStack
            w={{ base: '95%', md: '80%', xl: '60%' }}
            mb={3}
            mt={4}
            justify="center"
            spacing={{ base: 0, md: 3 }}
            flexDirection={{ base: "column", md: "row" }}
            p={0}
            borderBottom="1px solid #353887"
        >
            <Link to="/admin-register">
                <Button
                    colorScheme="none"
                    variant="none"
                    leftIcon={<FaUserShield />}
                    fontSize="0.8rem"
                    color="orange.50"
                    _hover={{ color: "red.50" }}
                >
                    Administradores
                </Button>
            </Link>
            <Center height='30px' display={{ base: 'none', md: 'block' }}>
                <Divider orientation='vertical' border="1px solid #353887" />
            </Center>
            <Link to="/admin/users">
                <Button
                    colorScheme="none"
                    variant="none"
                    leftIcon={<FaUserShield />}
                    fontSize="0.8rem"
                    color="violet.50"
                    _hover={{ color: "blue.50" }}
                >
                    Gestión de Usuarios
                </Button>
            </Link>
            <Center height='30px' display={{ base: 'none', md: 'block' }}>
                <Divider orientation='vertical' border="1px solid #353887" />
            </Center>
            <Link to="/admin-techniques">
                <Button
                    colorScheme="none"
                    variant="none"
                    leftIcon={<FaUserShield />}
                    fontSize="0.8rem"
                    color="blue.50"
                    _hover={{ color: "orange.50" }}
                >
                    Gestión de Técnicas
                </Button>
            </Link>
        </HStack>
    );
}