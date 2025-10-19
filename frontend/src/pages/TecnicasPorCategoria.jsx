import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Heading, Text, Spinner, Card, CardBody, Stack, Button, VStack, Image } from '@chakra-ui/react';
import { getTecnicasPorTipo } from '../services/techniques';
import { FaArrowLeft } from "react-icons/fa";

const formatTitle = (slug) => {
    return slug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
};

export default function TecnicasPorCategoria() {

    const category_colors_by_slug = {
        "respiracion-consciente": { bg: "yellow.50", Heading: "primary.700", text: "blue.50" },
        "meditacion-y-mindfulness": { bg: "orange.50", Heading: "#F0DCC9", text: "blue.50" },
        "relajacion-muscular-progresiva-rmp": { bg: "violet.50", Heading: "red.50", text: "#F0DCC9" },
    };

    const { slug } = useParams();
    const [tecnicas, setTecnicas] = useState([]);
    const [loading, setLoading] = useState(true);
    const tituloCategoria = formatTitle(slug);
    const currentColors = category_colors_by_slug[slug]

    useEffect(() => {
        const fetchTecnicas = async () => {
            setLoading(true);
            try {
                const res = await getTecnicasPorTipo(slug);

                setTecnicas(res.data);

            } catch (err) {
                console.error("Error cargando técnicas por categoría:", err);
                setTecnicas([]);
            } finally {
                setLoading(false);
            }
        };
        fetchTecnicas();
    }, [slug]);

    if (loading) {
        return (
            <Box textAlign="center" mt={10}>
                <Spinner size="xl" color="primary.500" />
                <Text mt={2}>Cargando técnicas de {tituloCategoria}...</Text>
            </Box>
        );
    }

    return (
        <Box
            textAlign="center"
            w={{ base: '80%', xl: '60%' }}
        >
            <VStack alignItems="flex-start">
                <Link to="/techniques">
                    <Button
                        variant="solid3D"
                        colorScheme='primary'
                        alignSelf="flex-start"
                        m={4}
                        borderRadius="full"
                        marginLeft="15px"
                        marginBottom="27px"
                        p="15px"
                    >
                        <FaArrowLeft />
                    </Button>
                </Link>
            </VStack>
            <Heading size="xl" mb={6} color="primary.700">
                Técnicas de: {tituloCategoria}
            </Heading>
            <Text
                color="violet.50"
                fontStyle="italic"
                marginBottom="40px"
            >
                Tu camino hacia la calma comienza aquí. Explora y elige.
            </Text>
            {tecnicas.length === 0 ? (
                <Text color="blue.50">No hay técnicas disponibles para esta categoría.</Text>
            ) : (
                <Stack spacing={4} align="center">
                    {tecnicas.map((t) => (
                        <Card
                            key={t.pk}
                            direction={{ base: 'column', sm: 'row' }}
                            overflow='hidden'
                            variant='outline'
                            p={4}
                            w={{ base: "100%", md: "100%" }}
                            bg={currentColors.bg}

                        >
                            <Stack flex="1">
                                <CardBody>
                                    <Heading
                                        size='md'
                                        color={currentColors.Heading}
                                    >
                                        {t.titulo}
                                    </Heading>
                                    <Text
                                        py='2'
                                        color={currentColors.text}
                                    >
                                        {t.descripcion}
                                    </Text>
                                </CardBody>
                            </Stack>
                        </Card>
                    ))}
                </Stack>
            )}
        </Box>
    );
}