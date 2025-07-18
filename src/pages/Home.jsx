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

export default function Home() {

  const { isOpen, onOpen, onClose } = useDisclosure()

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
            ¿Qué es Habl.Ar?
          </Heading>
        </CardHeader>
      </Card>
      <Card
        direction={{ base: 'column', sm: 'row' }}
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
            src='/walking.svg'
            alt='Mujer sola'
          />
        </Box>
        <Stack>
          <CardBody>
            <Text py='2'>
              En un mundo donde muchas veces el dolor se oculta detrás del silencio, nace esta plataforma con un propósito claro: brindar apoyo, contención y orientación a quienes enfrentan situaciones de bullying, acoso, o cualquier forma de maltrato.
            </Text>
          </CardBody>
        </Stack>
      </Card>
      <Card
        direction={{ base: 'column-reverse', sm: 'row' }}
        overflow='hidden'
        variant='outline'
        bg='secondary.500'
        w="70%"
        border='0px'
      >
        <Stack>
          <CardBody>
            <Text py='2'>
              Nuestro objetivo es que te sientas escuchado y acompañado. Contamos con voluntarios que responden tus dudas y/o problemas en el menor tiempo posible.
              <br /> También ofrecemos la posibilidad de sacar turnos para hablar con profesionales de la salud mental.
            </Text>
          </CardBody>
        </Stack>
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
        >
          <Image
            objectFit='cover'
            maxW={{ base: '100px', sm: '145px' }}
            src='/messages.svg'
            alt='Mujer chateando'
          />
        </Box>
      </Card>
      <Card
        direction={{ base: 'column', sm: 'row' }}
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
            src='/love.svg'
            alt='Mujer con corazón'
          />
        </Box>
        <Stack>
          <CardBody>
            <Text py='2'>
              Acá vas a encontrar un espacio seguro, donde podés hablar de forma anónima.
              Porque hablar sana, y nadie merece atravesar momentos difíciles en soledad.
            </Text>
          </CardBody>
          <CardFooter justifyContent="end">
            {/* <Button colorScheme="primary">
              Abrir chat
            </Button> */}
            <Button colorScheme='primary' onClick={onOpen}>
              Abir chat
            </Button>
            <Drawer
              isOpen={isOpen}
              placement='right'
              // initialFocusRef={firstField}
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
                      {/* <Input
                        ref='{firstField}'
                        id='username'
                        placeholder='Please enter user name'
                      /> */}
                    </Box>

                    <Box>
                      <FormLabel htmlFor='desc'>Description</FormLabel>
                      <Textarea id='desc' borderColor='1px solid primary.400' />
                    </Box>
                  </Stack>
                </DrawerBody>

                <DrawerFooter borderTopWidth='1px'>
                  <Button variant='outline' mr={3} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button colorScheme='primary'>Submit</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

          </CardFooter>
        </Stack>
      </Card>
    </>
  )
}
