import { VStack } from "@chakra-ui/react";
import Header from "./Header";
import Main from "./Main";


export default function AppLayout() {
  return (
    <VStack>
      <Header />
      <Main />
    </VStack>
  )
}
