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

export default function Faq() {
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
            Dudas
          </Heading>
        </CardHeader>
      </Card>
      <Card
        // direction={{ base: 'column', sm: 'row' }}
        direction={{ base: 'column' }}
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
            src='/questions.svg'
            alt='Mujer sola'
          />
        </Box>
        <Stack>
          <CardBody>
            <Text py='2'>
              1. ¿Es confidencial lo que comparto en el chat?<br /><br />
              Sí. Todo lo que compartís en Habl.Ar es confidencial. No se guarda información personal y podés hablar de manera anónima.

              <br /><br />2. ¿Quién responde en el chat?
              <br /><br />Voluntarios capacitados para brindar escucha activa, contención y orientación. No reemplazan a un profesional de la salud mental, pero están para ayudarte.

              <br /><br />3. ¿Qué hago si necesito ayuda urgente?
              <br /><br />Habl.Ar no está diseñado para emergencias. Si estás en peligro o necesitás ayuda inmediata, contactá con una línea de emergencia o servicio profesional de tu zona.
            </Text>
          </CardBody>
        </Stack>
      </Card>
    </>
  )
}
