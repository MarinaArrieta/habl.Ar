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
    Heading,
    HStack,
    Divider,
} from "@chakra-ui/react";
import { FaQuestionCircle } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";

export default function Footer() {

    return (
        <HStack
            display="flex"
            justifyContent="space-around"
            alignItems="center"
            // p='18px'
            w={{base: '80%', md: '350px'}}
            m='20px 0'
        >
            <Box
                boxSize='sm'
                display='flex'
                alignItems='center'
                flexDirection='column'
                h='none'
                w='unset'
            >
                <NavLink as={Link} to="/">
                    <Image
                        w={{ base: '60px', md: '55px' }}
                        src='/logo-hablar.png'
                        alt='Logo Hablar'
                    />
                </NavLink>
                <NavLink as={Link} to="/">
                    <Heading
                        fontSize={{ base: '1.2rem', md: '1rem' }}
                        color="primary.500"
                    >
                        Habl.Ar
                    </Heading>
                </NavLink>
            </Box>
            <VStack>
                <Divider
                    orientation="vertical"
                    borderColor="primary.200"
                    borderWidth="1px"
                    height="100px"
                />
            </VStack>
            <VStack
                // display="flex"
                // flexDirection='column'
                alignItems='flex-start'
                gap={2}
                fontSize='15px'
            >
                <NavLink as={Link} to="techniques">
                    <Text color="primary.500">
                        Técnicas
                    </Text>
                </NavLink>
                <NavLink to="login">
                    <Text color="primary.500">
                        Login
                    </Text>
                </NavLink>
                <NavLink to="register">
                    <Text color="primary.500">
                        Registrate
                    </Text>
                </NavLink>
                <NavLink to="faq" w="100%">
                    <Text color="primary.500" >
                        <FaQuestionCircle />
                    </Text>
                </NavLink>
            </VStack>
        </HStack>
    )
}
