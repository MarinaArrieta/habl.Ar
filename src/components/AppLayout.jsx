import { VStack } from "@chakra-ui/react";
import Header from '../components/Header';
import Routing from "../routes/Routing";


export default function AppLayout() {
  return (
    <VStack>
      <Header />
      <Routing />
      {/* <Home /> */}
    </VStack>
  )
}
