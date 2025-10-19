import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Image,
  Stack,
  Text,
  Textarea,
  useDisclosure
} from '@chakra-ui/react'
import { IoMdPerson } from 'react-icons/io'

export default function Home() {

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Card
        direction={{ base: 'column', lg: 'row-reverse' }}
        overflow='hidden'
        variant='outline'
        bg="none"
        w={{ base: "70%", lg: "80%", xl: "60%" }}
        h="80vh"
        border='0px'
        alignItems={{ base: 'center', lg: 'center' }}
        justifyContent={{ base: 'center', lg: 'space-between' }}
      >
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'

          py={{ base: 4, lg: 0 }}
        >
          <Image
            objectFit='cover'
            maxW={{ base: '230px', md: '280px', lg: '400px' }}
            src='/hablar-sentados.png'
            alt='Personas hablando'
          />
        </Box>
        <Stack
          spacing={4}
          alignItems={{ base: 'center', lg: 'flex-start' }}
          flex={1}
        >
          <CardBody
            display='flex'
            flexDirection='column'
            justifyContent={'center'}
            paddingLeft={{lg: "unset"}}
          >
            <Text
              py='2'
              color="violet.50"
              textAlign={{ base: "center", lg: "start" }}
              fontSize={{ xl: "1.3rem" }}
              paddingLeft="unset"
            >
              Tómate un respiro. Estamos aquí para escucharte.
            </Text>
            <Text
              py='2'
              color="violet.50"
              fontStyle="italic"
              textAlign={{ base: "center", lg: "start" }}
              fontSize={{ xl: "1.3rem" }}
            >
              Transforma la soledad en conversación.
            </Text>
          </CardBody>

          {/* Contenedor del Botón */}
          <CardFooter
            justifyContent={{ base: "center", lg: "flex-start" }}
            p={{ base: 4, lg: 0 }}
          >
            <Button
              variant='solid3D'
              colorScheme='primary'
              onClick={onOpen}
            >
              Abrir chat
            </Button>
          </CardFooter>
        </Stack>
      </Card>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent bg="secondary.500" color="primary.500">
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px' display='flex' alignItems={'center'} gap={2}>
            <IoMdPerson /> Brad
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing='24px'>
              <Box>
                <FormLabel htmlFor='username'>Hola</FormLabel>
                <FormLabel display='flex' justifyContent='end'>Hola Brad</FormLabel>
              </Box>

              <Box>
                <FormLabel htmlFor='desc'>Description</FormLabel>
                <Textarea id='desc' borderColor='1px solid primary.400' />
              </Box>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth='1px'>
            <Button
              variant='outline3D' // Aplicamos la variante sutil 3D
              colorScheme='primary'
              mr={3}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant='solid3D' // Usamos la variante grande, pero sin padding extra
              colorScheme='primary'
            >
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}