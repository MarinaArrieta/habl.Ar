import { VStack } from '@chakra-ui/react'
import Header from './Header'
import Routing from '../routes/Routing'
import Footer from './Footer'
import { useLocation } from 'react-router-dom';


export default function AppLayout() {

  const location = useLocation();
  const excludedPaths = ['/', '/register', '/login'];
  const shouldHideFooter = excludedPaths.includes(location.pathname);

  return (
    <VStack>
      <Header />
      <Routing />
      {!shouldHideFooter && <Footer />}
    </VStack>
  )
}