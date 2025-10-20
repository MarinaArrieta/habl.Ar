import {
    Box,
    Text,
    VStack,
    Image,
    HStack,
    Divider,
    Link,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { IoLogoTiktok } from "react-icons/io5";

export default function Footer() {

    const email = "arrietamarina12@gmail.com";
    const asunto = "Consulta desde el sitio web Habl.Ar";
    const cuerpo = "Hola, estoy escribiendo con una consulta sobre...";
    const fullMailtoLink = `mailto:${email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;

    return (
        <HStack
            display="flex"
            justifyContent="space-around"
            alignItems="center"
            w={{ base: '90%', md: '350px' }}
            m='47px 0'
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
                        w={{ base: '60px', md: '66px' }}
                        src='/logo.png'
                        alt='Logo Hablar'
                    />
                </NavLink>
            </Box>
            <VStack>
                <Divider
                    orientation="vertical"
                    borderColor="primary.200"
                    borderWidth="1px"
                    height="130px"
                />
            </VStack>
            <VStack
                alignItems='center'
                gap={2}
                fontSize='15px'
            >
                <NavLink as={Link} to="techniques">
                    <Text color="primary.500" _hover={{ color: "blue.50" }}>
                        Técnicas
                    </Text>
                </NavLink>
                <NavLink to="login">
                    <Text color="primary.500" _hover={{ color: "blue.50" }}>
                        Acceder
                    </Text>
                </NavLink>
                <NavLink to="faq" w="100%">
                    <Text color="primary.500" textAlign={"center"} _hover={{ color: "blue.50" }}>
                        Dudas Comunes
                    </Text>
                </NavLink>
                <Link
                    href={fullMailtoLink}
                    color="primary.500"
                    textAlign={"center"}
                    _hover={{ color: "blue.50" }}
                    isExternal
                >
                    Contáctanos
                </Link>
            </VStack>
            <VStack>
                <Divider
                    orientation="vertical"
                    borderColor="primary.200"
                    borderWidth="1px"
                    height="130px"
                />
            </VStack>
            <VStack
                alignItems='end'
                gap={2}
                fontSize='1.5em'
                color="primary.700"
            >
                <Text _hover={{ color: "blue.50" }}> <FaInstagram /></Text>
                <Text _hover={{ color: "blue.50" }}> <FaFacebookF /></Text>
                <Text _hover={{ color: "blue.50" }}> <IoLogoTiktok /></Text>
                <Text _hover={{ color: "blue.50" }}> <FaXTwitter /></Text>
            </VStack>
        </HStack>
    )
}
