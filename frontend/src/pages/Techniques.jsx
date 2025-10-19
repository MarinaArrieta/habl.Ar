import { useEffect, useState } from "react";
import { getTecnicas } from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Spinner,
  Text,
  Stack,
  Card,
  CardBody,
  Image,
  Divider,
  CardFooter,
  ButtonGroup,
  Button,
} from "@chakra-ui/react";

export default function TecnicasList() {
  
  const [tecnicas, setTecnicas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  const getSlug = (nombre) => {
      return nombre
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[áéíóúüñ()\//]+/g, '');
  };

  const handleViewClick = (nombre) => {
      const slug = getSlug(nombre);
      navigate(`/techniques/${slug}`);
  };

  useEffect(() => {
    const fetchTecnicas = async () => {
      try {
        const res = await getTecnicas();
        setTecnicas(res.data);
      } catch (err) {
        console.error("Error cargando técnicas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTecnicas();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" color="purple.400" />
        <Text mt={2}>Cargando técnicas...</Text>
      </Box>
    );
  }

  return (
    <Box p={5}>
      <Box
        display="flex"
        justifyContent="center"
        boxSize='100%'
        objectFit='cover'
        marginBottom="35px"
      >
        <Heading
          size="2xl"
          textAlign="center"
          color="primary.700"
        >
          Técnicas de Relajación
        </Heading>
      </Box>
      <Stack
        spacing={4}
        justifyContent="center"
        alignItems="center"
        direction={{ base: "column", md: "row" }}
      >
        <Card
          width={{ base: '80%', lg: "298px" }}
          background="yellow.50"
          borderRadius="95px 95px 10px 10px"
          h={{ base: 'auto', md: '656px', lg: "585px" }}
        >
          <CardBody>
            <Box display="flex" justifyContent="center">
              <Image
                src='/respiracion.png'
                alt='Respiración'
                borderRadius='lg'
                maxW="100px"
              />
            </Box>
            <Stack mt='6' spacing='3'>
              <Heading fontSize="1.20rem" color="primary.700">Respiración Consciente</Heading>
              <Text color="violet.50" >
                Descripción y Objetivo:
              </Text>
              <Text color="blue.50">
                Se enfoca en el control del ritmo y la profundidad de la respiración. Es la herramienta más rápida para activar el sistema nervioso parasimpático (el de la calma).
              </Text>
            </Stack>
          </CardBody>
          <Divider color="#F0DCC9" />
          <CardFooter display="flex" justifyContent="end">
            <ButtonGroup spacing='2'>
              <Button
                variant="solid3D"
                colorScheme='primary'
                onClick={() => handleViewClick('Respiracion Consciente')} 
              >
                Ver
              </Button>
            </ButtonGroup>
          </CardFooter>
        </Card>
        <Card
          width={{ base: '80%', lg: "298px" }}
          background="violet.50"
          borderRadius="95px 95px 10px 10px"
          h={{ base: 'auto', md: '656px', lg: "585px" }}
        >
          <CardBody>
            <Box display="flex" justifyContent="center">
              <Image
                src='/relajacion.png'
                alt='Relajación'
                borderRadius='lg'
                maxW="115px"
              />
            </Box>
            <Stack mt='6' spacing='3'>
              <Heading fontSize="1.20rem" color="red.50">Relajación Muscular Progresiva (RMP)</Heading>
              <Text color="yellow.50">
                Descripción y Objetivo:
              </Text>
              <Text color="#F0DCC9">
                Consiste en tensar y luego relajar sistemáticamente grupos musculares, ayudando a reconocer y liberar la tensión corporal.
              </Text>
            </Stack>
          </CardBody>
          <Divider color="#F0DCC9" />
          <CardFooter display="flex" justifyContent="end">
            <ButtonGroup spacing='2'>
              <Button
                variant="solid3D"
                colorScheme='primary'
                onClick={() => handleViewClick('Relajacion Muscular Progresiva (RMP)')} 
              >
                Ver
              </Button>
            </ButtonGroup>
          </CardFooter>
        </Card>
        <Card
          width={{ base: '80%', lg: "298px" }}
          background="orange.50"
          borderRadius="95px 95px 10px 10px"
          h={{ base: 'auto', md: '656px', lg: "585px" }}
        >
          <CardBody>
            <Box display="flex" justifyContent="center">
              <Image
                src='/meditacion.png'
                alt='Meditación'
                borderRadius='lg'
                maxW="142px"
              />
            </Box>
            <Stack mt='6' spacing='3'>
              <Heading
                fontSize="1.20rem"
                color="#F0DCC9"
              >
                Meditación y Mindfulness
              </Heading>
              <Text color="red.50">
                Descripción y Objetivo:
              </Text>
              <Text color="blue.50">
                Se centra en prestar atención al momento presente sin juzgar. Ayuda a detener la rumiación mental y a tomar distancia de los pensamientos estresantes.
              </Text>
            </Stack>
          </CardBody>
          <Divider color="#F0DCC9" />
          <CardFooter display="flex" justifyContent="end">
            <ButtonGroup spacing='2'>
              <Button
                variant="solid3D"
                colorScheme='primary'
                onClick={() => handleViewClick('Meditacion y Mindfulness')} 
              >
                Ver
              </Button>
            </ButtonGroup>
          </CardFooter>
        </Card>
      </Stack>
    </Box>
  );
}