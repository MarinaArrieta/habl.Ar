import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Heading,
  Image,
  Input,
  InputGroup,
  Stack,
  Text,
  Textarea,
  useDisclosure
} from '@chakra-ui/react'
import { useRef } from 'react'
import { IoMdPerson } from 'react-icons/io'

export default function Techniques() {
  return (
    <>
      <Card
        border='0px'
        boxShadow='none'
        flexDirection='column'
      >
        <CardHeader
          bg='secondary.500'
        // bg="#a0bc94"
        >
          <Heading
            size='lg'
            textAlign='center'
            color="primary.500"
          >
            Relajate !
          </Heading>
        </CardHeader>
      </Card>
      <Card
        // direction={{ base: 'column', sm: 'row' }}
        direction={{ base: 'column'}}
        overflow='hidden'
        variant='outline'
        bg='secondary.500'
        w="70%"
        border='0px'
      >
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
        >
          <Image
            objectFit='cover'
            maxW={{ base: '100px', sm: '145px' }}
            src='/meditation.svg'
            alt='Mujer sola'
          />
        </Box>
        <Stack>
          <CardBody>
            <Text py='2'>
              Técnica: Respiración 4-7-8 <br /><br />
              Descripción:
              La técnica de respiración 4-7-8 es un ejercicio simple que ayuda a reducir la ansiedad, mejorar el sueño y calmar la mente. Se basa en controlar la respiración siguiendo un ritmo específico.
              <br /><br />
              Instrucciones paso a paso:
              Sentate o recostate en un lugar cómodo. Mantené la espalda recta si estás sentado.

              Cerrá los ojos y respirá profundamente por la nariz durante 4 segundos.

              Retené el aire en tus pulmones durante 7 segundos.

              Exhalá lentamente por la boca durante 8 segundos, haciendo un sonido suave de “shhh”.

              Repetí el ciclo de 3 a 4 veces, o hasta sentirte más tranquilo/a.
              <br /><br />
              Beneficios:
              Disminuye la ansiedad y el estrés.

              Ayuda a relajarse antes de dormir.

              Estabiliza el ritmo cardíaco.

              Promueve la concentración y el control emocional.
            </Text>
          </CardBody>
        </Stack>
      </Card>
    </>
  )
}
