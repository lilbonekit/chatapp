import LoginForm from '../../components/Login/Login'
import {
    Container,
    Heading,
    Box,
    AbsoluteCenter,
    Divider,
    Center,
    Link as ChakraLink
} from '@chakra-ui/react'

import { Link as RouterLink } from 'react-router-dom'

const LoginPage = () => {

    return (
        <Center minHeight="90vh" py={10}>
            <Container maxW='container.xl' centerContent>
                <Heading fontSize='3xl' as='h1' py={10}>Sign in</Heading>
                <Container
                    maxW='md'
                >
                    <LoginForm />
                    <Box position='relative' padding='10'>
                        <Divider />
                        <AbsoluteCenter bg='white' px='4'>
                            OR
                        </AbsoluteCenter>
                    </Box>
                    <Center>
                        <ChakraLink as={RouterLink} to='/register'>
                            Create a new account
                        </ChakraLink>
                    </Center>
                </Container>
            </Container>
        </Center>
    )
}

export default LoginPage