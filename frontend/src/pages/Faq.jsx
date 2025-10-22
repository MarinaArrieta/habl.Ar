import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Card,
    CardHeader,
    Heading,
    Image,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react'
import { faqData } from '../utils/faqData';

export default function Faq() {
    return (
        <VStack w={{ base: '80%', xl: '60%' }} gap="30px">
            <Card
                border='0px'
                boxShadow='none'
                flexDirection='column'
            >
                <CardHeader bg="#F0DCC9" p="0">
                    <Heading
                        size="2xl"
                        textAlign="center"
                        color="primary.700"
                    >
                        Dudas Comunes
                    </Heading>
                </CardHeader>
            </Card>
            <Card
                direction={{ base: 'column' }}
                overflow='hidden'
                variant='outline'
                border='0px'
                bg="#F0DCC9"
                p={0}
                w="100%"
                gap="30px"
            >
                {/* <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    mb={6}
                >
                    <Image
                        objectFit='cover'
                        maxW={{ base: '100px', sm: '145px' }}
                        src='/dudas.png'
                        alt='Dudas Image'
                        filter="drop-shadow(-2px 7px 6px #2d2d2d)"
                    />
                </Box> */}
                <Stack spacing={4}>
                    <Accordion allowToggle> 
                        {faqData.map((item) => (
                            <AccordionItem 
                                key={item.id} 
                                borderBottom="1px solid" 
                                borderColor="gray.300" 
                                bg="primary.700"
                                mb={2}
                                borderRadius="lg"
                                overflow="hidden"
                            >
                                <Text color="#F0DCC9">
                                    <AccordionButton 
                                        _expanded={{ bg: 'blue.50', color: "#F0DCC9" }} 
                                        p={4} 
                                        textAlign="left"
                                        fontWeight="bold"
                                    >
                                        <Box as="span" flex='1'>
                                            {item.pregunta}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </Text>
                                <AccordionPanel pb={4} p={4} bg="#d3bda9">
                                    <Text color="blue.50">
                                        {item.respuesta}
                                    </Text>
                                </AccordionPanel>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </Stack>
            </Card>
        </VStack>
    )
}