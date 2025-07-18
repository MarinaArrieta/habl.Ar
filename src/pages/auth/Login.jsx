import {
  FormControl,
  FormLabel,
  Input
} from "@chakra-ui/react";


export default function Login() {
  return (
    <FormControl
      // w="70%"
      display='flex'
      flexDirection='column'
      gap='15px'
    >
      <FormLabel>Nombre</FormLabel>
      <Input type="text" border="1px solid green" />
      <FormLabel>Ingresar con email</FormLabel>
      <Input type='email' border="1px solid green" />
      <FormLabel>Contraseña</FormLabel>
      <Input type='password' border="1px solid green" />
    </FormControl>
  )
}
