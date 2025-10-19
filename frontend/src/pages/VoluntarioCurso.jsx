import { useState } from 'react';
import { Button, Heading, Text, RadioGroup, Stack, Radio, useToast, Link, VStack } from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { EXAMEN } from '../utils/examen';
import { FaArrowLeft } from 'react-icons/fa';

// Función utilitaria para generar una clave de 4 dígitos
const generateKey = () => Math.floor(1000 + Math.random() * 9000).toString();

export default function VoluntarioCurso() {
  const toast = useToast();
  const navigate = useNavigate();
  const [respuestas, setRespuestas] = useState({});

  const handleRespuestaChange = (preguntaId, valor) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: valor,
    }));
  };

  const handleCursoSubmit = () => {
    let errores = 0;

    // 1. Verificar que se hayan respondido todas las preguntas
    if (Object.keys(respuestas).length !== EXAMEN.length) {
      toast({
        title: "Incompleto",
        description: "Debes responder todas las preguntas para continuar.",
        status: "warning",
        duration: 5000,
        isClosable: true
      });
      return;
    }

    // 2. Evaluar las respuestas
    EXAMEN.forEach(p => {
      if (respuestas[p.id] !== p.respuestaCorrecta) {
        errores++;
      }
    });

    if (errores > 0) {
      // 3. Resultado: Fallido
      toast({
        title: "Curso no aprobado",
        description: `Tuviste ${errores} error(es). Vuelve a repasar los conceptos y haz el examen de nuevo.`,
        status: "error",
        duration: 10000,
        isClosable: true
      });
      // Opcional: limpiar respuestas para un nuevo intento
      setRespuestas({});
    } else {
      // 4. Resultado: Aprobado - Generar clave y redirigir
      const clave = generateKey();

      toast({
        title: "¡Curso Aprobado!",
        description: `Tu CLAVE DE REGISTRO es: ${clave}. Úsala en el formulario de voluntario.`,
        status: "success",
        duration: 15000,
        isClosable: true,
        position: 'top',
      });

      // 5. Redirigir al formulario de registro, pasando la clave como estado
      navigate('/register', { state: { cursoAprobadoKey: clave } });
    }
  };

  return (
    <VStack w={{ base: '80%', xl: '60%' }}>
      <VStack alignItems="flex-start" w="100%">
        {/* Usa RouterLink para la navegación interna */}
        <RouterLink to="/register">
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
        </RouterLink>
      </VStack>
      <Heading size="lg" mb={6} color="primary.700">Capacitación: Escucha Activa y Empatía</Heading>
      <Text mb={6} color="violet.50">Responde las siguientes 5 preguntas de opción múltiple. ¡Debes acertar el 100% para aprobar!</Text>
      <Link href="/capacitacion-voluntarios.pdf" color="blue.500" mb={6} isExternal>
        👉🏽 Si aún no descargaste el material de estudio para aprobar el exámen hazlo aquí.
      </Link>

      {EXAMEN.map((pregunta) => (
        <VStack
          key={pregunta.id}
          mb={8} p={4}
          border="1px solid #353887"
          borderRadius="md"
          w="70%"
        >
          <Text fontWeight="bold" mb={3} color="blue.50">{pregunta.id}. {pregunta.pregunta}</Text>
          <RadioGroup
            onChange={(val) => handleRespuestaChange(pregunta.id, val)}
            value={respuestas[pregunta.id] || ''}
          >
            <Stack direction="column" color="blue.50">
              {Object.entries(pregunta.opciones).map(([key, valor]) => (
                <Radio key={key} value={key} border="1px solid green">
                  {valor}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        </VStack>
      ))}

      <Button
        colorScheme="green"
        onClick={handleCursoSubmit}
        w="70%"
        mt={4}
      >
        Finalizar Examen y Obtener Clave
      </Button>
    </VStack>
  );
}