import { Card, CardBody, CardFooter } from '@chakra-ui/react'
import { Text, Stack, Heading, Image , Button, ButtonGroup } from '@chakra-ui/react'

export default function ProductCard() {
    return (
        <>
            <Card minW='min-content' w='55%' maxW='250'>
                <CardBody p='2'>
                    <Image
                    src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                    alt='Green double couch with wooden legs'
                    borderRadius='lg'
                    w='100%'
                    />
                    <Stack mt='4' spacing='2'>
                        <Heading size='md'>Living room Sofa</Heading>
                        <Text color='blue.600' fontSize='2xl'>
                            $450
                        </Text>
                    </Stack>
                </CardBody>
                <CardFooter  p='2' justifyContent='center'>
                    <ButtonGroup spacing='2'>
                        <Button size='md' variant='solid' colorScheme='blue'>
                            Buy now
                        </Button>
                        <Button size='md'variant='ghost' colorScheme='blue'>
                            Add to cart
                        </Button>
                    </ButtonGroup>
                </CardFooter>
            </Card>
        </>
    )
}