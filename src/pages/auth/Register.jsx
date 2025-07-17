import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Select
} from "@chakra-ui/react";


export default function Register() {
  return (
    <FormControl w="70%">
      <FormLabel>Nombre</FormLabel>
      <Input type="text" border="1px solid green" />
      <FormLabel>Email address</FormLabel>
      <Input type='email' border="1px solid green" />
      <FormHelperText>We'll never share your email.</FormHelperText>
      <FormLabel>Contraseña</FormLabel>
      <Input type='password' border="1px solid green" />
      <FormLabel>Tipo de usuario</FormLabel>
      <Select placeholder='Selecciona el tipo de Usuario' border="1px solid green">
        <option>Usuario común</option>
        <option>Voluntario</option>
        <option>Psicólogo</option>
      </Select>
    </FormControl>
  )
}
