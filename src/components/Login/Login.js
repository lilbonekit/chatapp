import {
    FormControl,
    FormLabel,
    Input,
    Button,
    Box,
    Stack,
    FormErrorMessage,
    useToast,
} from "@chakra-ui/react"

import { useForm } from 'react-hook-form'

import { useCurrentUser } from "../../store/store"

const LoginForm = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({ mode: 'onBlur' })

    const {
            loading,
            getCurrentUser
        } = useCurrentUser()

    const toast = useToast()

    const onSubmit = ({email, password}) => {
        reset()

        toast.promise(getCurrentUser(email, password), {
            success: {
                title: `Hi ${email}!`,
                description: 'You has been successfully authorized!',
                isClosable: true,
                duration: 2000,
                position: 'top'
            },
            error: {
                title: 'Error!',
                description: navigator.onLine ? 'Invalid email or password!' : null,
                isClosable: true,
                duration: 3000,
                position: 'top'
            },
            loading: { 
                title: 'Please wait...',
                description: 'Trying to log in...',
                isClosable: true,
                position: 'top'
            },
        })
    }

    return (
        <LoginFormView
            onSubmit={onSubmit}
            handleSubmit={handleSubmit}
            register={register}
            errors={errors}
            loading={loading}
        />
    )
}

const LoginFormView = (props) => {
    const {
        handleSubmit,
        onSubmit,
        errors,
        register,
        loading
    } = props
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                <Box spacing='20px'>
                    <FormControl isInvalid={errors.email}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            id='email'
                            size='lg'
                            type='email'
                            placeholder='Email'
                            defaultValue=''
                            {...register('email', {
                                required: 'Email is required',
                                minLength: {
                                    value: 6,
                                    message: 'At least 6 characters'
                                },
                                maxLength: {
                                    value: 35,
                                    message: 'Maximum of 35 characters'
                                },
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                    message: 'Invalid email format',
                                },
                            })}
                        />
                        <FormErrorMessage>
                            {errors.email && errors.email.message}
                        </FormErrorMessage>
                    </FormControl>
                </Box>
                <Box spacing='20px'>
                    <FormControl isInvalid={errors.password}>
                        <FormLabel>Password</FormLabel>
                        <Input
                            id='password'
                            type='password'
                            placeholder='Password'
                            size='lg'
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 5,
                                    message: 'At least 5 characters'
                                },
                                maxLength: {
                                    value: 35,
                                    message: 'Maximum of 35 characters'
                                }
                            })}
                        />
                        <FormErrorMessage>
                            {errors.password && errors.password.message}
                        </FormErrorMessage>
                    </FormControl>
                </Box>
                <Button
                    mt={4}
                    colorScheme='teal'
                    isLoading={loading}
                    loadingText='Submitting'
                    size='lg'
                    type='submit'
                >
                    Sign in
                </Button>
            </Stack>
        </form>
    )
}

export default LoginForm