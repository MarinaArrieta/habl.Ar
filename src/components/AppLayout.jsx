import { Box, VStack } from "@chakra-ui/react";
import Header from '../components/Header';
import Routing from "../routes/Routing";
import Footer from "../components/Footer";


export default function AppLayout() {
  return (
    // <VStack gap='3rem'>
      <Box
        display="flex"
        flexDirection="column"
        alignItems='center'
        // justifyContent='center'
        minHeight="100vh"
      >
        <Header />
        <Box as="main" flex="1" display="flex" justifyContent="center" flexDirection="column" alignItems='center'>
          <Routing />
        </Box>
        <Footer />
      </Box>
    // </VStack>
  )
}
