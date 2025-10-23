import {
    Box,
    VStack,
    Heading,
    Text,
    Spinner,
    Alert,
    AlertIcon,
    SimpleGrid,
    Card,
    CardBody,
    CardFooter,
    Image,
    Button,
    Center,
    useBreakpointValue,
    Tag,
    HStack
} from '@chakra-ui/react';
import { usePsicologos } from '../hooks/usePsicologos';
import { FaUserGraduate, FaEnvelope, FaTag } from 'react-icons/fa';
import { StarIcon } from '@chakra-ui/icons';

export default function PsicologosList() {

    const { psicologos, isLoading, error } = usePsicologos();
    const columns = useBreakpointValue({ base: 1, sm: 2, lg: 3 });

    if (isLoading) {
        return (
            <Center h="80vh">
                <VStack spacing={4}>
                    <Spinner size="xl" color="primary.700" thickness="4px" />
                    <Text color="gray.600">Cargando lista de profesionales...</Text>
                </VStack>
            </Center>
        );
    }

    if (error) {
        return (
            <Box p={8} maxW="container.lg" mx="auto">
                <Alert status='error' borderRadius="lg" variant="left-accent">
                    <AlertIcon />
                    <Text fontWeight="bold">Error de Conexión:</Text> {error}
                </Alert>
                <Text mt={2} fontSize="sm" color="gray.500">
                    Verifica que el servidor backend (Express) esté corriendo.
                </Text>
            </Box>
        );
    }

    return (
        <VStack spacing={10} p={{ base: 4, md: 10 }} align="stretch" w={{ base: '80%', xl: '60%' }} mx="auto">
            <Heading as="h1" size="xl" textAlign="center" color="primary.700" fontWeight="extrabold">
                Encuentra tu Profesional
            </Heading>
            <Text textAlign="center" color="violet.50" fontSize="lg">
                Nuestros psicólogos están aquí para ayudarte. Elige el tuyo.
            </Text>

            {psicologos.length === 0 ? (
                <Alert
                    status='info'
                    variant='subtle'
                    mt={8} borderRadius="lg"
                    justifyContent="center"
                >
                    <AlertIcon />
                    Actualmente no hay psicólogos aprobados en la plataforma.
                </Alert>
            ) : (
                <SimpleGrid columns={columns} spacing={8} pt={4}>
                    {psicologos.map((psicologo) => (
                        <Card
                            key={psicologo.id}
                            borderRadius="2xl"
                            boxShadow="2xl"
                            p={5}
                            align="center"
                            bg="white"
                            transition="all 0.3s"
                            _hover={{ transform: 'translateY(-5px)', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}
                        >
                            <Image
                                boxSize='140px'
                                borderRadius='full'
                                objectFit='cover'
                                src={psicologo.fotoUrl || 'https://placehold.co/140x140/94b8e7/ffffff?text=P'}
                                alt={`Foto de ${psicologo.nombre}`}
                                mb={4}
                                border="4px solid"
                                borderColor="primary.500"
                            />

                            <CardBody p={2} textAlign="center" w="full">
                                <Heading size="md" color="gray.800" mb={1}>{psicologo.nombre} {psicologo.apellido}</Heading>
                                <Tag
                                    size='md'
                                    variant='subtle'
                                    colorScheme='purple'
                                    mt={2}
                                    mb={3}
                                    borderRadius="full"
                                >
                                    <FaTag style={{ marginRight: '6px' }} />
                                    {psicologo.especialidad || 'Psicología General'}
                                </Tag>
                                <VStack align="center" spacing={1} fontSize="sm" color="gray.600">
                                    <HStack>
                                        <Box as={FaUserGraduate} color="primary.500" />
                                        <Text>Matrícula: {psicologo.matricula || 'N/A'}</Text>
                                    </HStack>
                                    <HStack color="yellow.500">
                                        <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                                        <Text fontSize="xs" color="gray.500">(4.8/5.0)</Text>
                                    </HStack>
                                </VStack>
                            </CardBody>
                            <CardFooter pt={2}>
                                <Button
                                    leftIcon={<FaEnvelope />}
                                    colorScheme="orange"
                                    bg="primary.500"
                                    _hover={{ bg: 'primary.700', boxShadow: 'md' }}
                                    as="a"
                                    href={`mailto:${psicologo.email}`}
                                    /* isExternal */
                                    size="md"
                                    borderRadius="lg"
                                    fontWeight="bold"
                                >
                                    Enviar Correo
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </SimpleGrid>
            )}
        </VStack>
    );
}