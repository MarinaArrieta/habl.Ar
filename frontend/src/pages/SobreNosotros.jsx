import {
  Box,
  Card,
  CardBody,
  Heading,
  Image,
  Stack,
  Text,
  VStack
} from '@chakra-ui/react'

export default function Home() {

  return (
    <VStack w={{ base: '80%', xl: '60%' }}>
      <Heading
        size="2xl"
        textAlign="center"
        color="primary.700"
      >
        ¿Qué es Habl.Ar?
      </Heading>
      <Card
        direction={{ base: 'column', lg: 'row' }}
        alignItems='center'
        overflow='hidden'
        variant='outline'
        bg="none"
        border='0px'
        gap="25px"
        m="47px 0 0 0"
      >
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
        >
          <Image
            objectFit='cover'
            maxW={{ base: '216px', md: '259px' }}
            src="/tres.png"
            alt='Personas hablando'
          />
        </Box>
        <Stack>
          <CardBody p="0" color="blue.5">
            <Text>
              🔸En un mundo donde muchas veces el dolor se oculta detrás del silencio, nace esta plataforma con un propósito claro: brindar apoyo, contención y orientación a quienes enfrentan situaciones de bullying, acoso, o cualquier forma de maltrato.
            </Text>
            <br />
            <Text>
              🔸Nuestro objetivo es que te sientas escuchado y acompañado.
              Contamos con voluntarios que responden tus dudas y/o problemas en el menor tiempo posible.
              También ofrecemos la posibilidad de sacar turnos para hablar con profesionales de la salud mental.
            </Text>
            <br />
            <Text>
              🔸Acá vas a encontrar un espacio seguro, donde podés hablar de forma anónima.
              Porque hablar sana, y nadie merece atravesar momentos difíciles en soledad.
              Acá vas a encontrar un espacio seguro, donde podés hablar de forma anónima.
              Porque hablar sana, y nadie merece atravesar momentos difíciles en soledad.
            </Text>
          </CardBody>
        </Stack>
      </Card>
    </VStack>
  )
}
