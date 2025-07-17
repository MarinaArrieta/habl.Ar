import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Image,
  Stack,
  Text
} from '@chakra-ui/react'

export default function Home() {
  return (
    <Card
      /* maxW='sm' */
      bg="#a0bc94"
      w="70%"
    >
      <CardBody>
        <Image
          w="100px"
          borderRadius='lg'
          src='/logo-hablar.png'
          alt='Logo Hablar'
        />
        <Stack mt='6' spacing='3'>
          <Heading size='md'>¿Qué es Habl.Ar?</Heading>
          <Text>
            En un mundo donde muchas veces el dolor se oculta detrás del silencio, nace esta plataforma con un propósito claro: brindar apoyo, contención y orientación a quienes enfrentan situaciones de bullying, acoso, o cualquier forma de maltrato.
            <br />
            Acá vas a encontrar un espacio seguro, donde podés hablar de forma anónima o con tu nombre, como vos lo prefieras. Nuestro objetivo es que te sientas escuchado y acompañado. Contamos con voluntarios que responden tus dudas y/o problemas en el menor tiempo posible, y también ofrecemos la posibilidad de sacar turnos para hablar con profesionales de la salud mental.
            <br />
            Porque hablar sana, y nadie merece atravesar momentos difíciles en soledad.
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter justifyContent="end">
        <ButtonGroup spacing='2'>
          <Button 
          /* colorScheme='blue' */
          bg="primary.500"
          /* color="secondary.500" */
          >
            Abrir chat
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  )
}
