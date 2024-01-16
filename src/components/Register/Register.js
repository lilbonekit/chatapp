import {
    FormControl,
    FormLabel,
    Input,
    Button,
    Box,
    Stack,
    FormErrorMessage
} from "@chakra-ui/react"

import { useForm } from 'react-hook-form'
import { useToast } from "@chakra-ui/react"
import { useCurrentUser } from "../../store/store"

const RegisterForm = () => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm({ mode: 'onBlur' })

    const {
        loading,
        error,
        createUser
    } = useCurrentUser()

    const toast = useToast()

    const onSubmit = ({ email, password }) => {
        reset()
        
        const promise = createUser(email, password)

        toast.promise(promise, {
            success: {
                title: `Welcome! ${email}!`,
                description: 'You account has been created!',
                isClosable: true,
                position: 'top',
                duration: 2000
            },
            error: {
                title: 'Error!',
                description: navigator.onLine ? 'Email already in use!' : null,
                isClosable: true,
                duration: 3000,
                position: 'top'
            },
            loading: { 
                title: 'Please wait...',
                description: 'Trying to create your account...',
                isClosable: true,
                position: 'top'
            },
        })
    }


    const password = watch('password', '')

    return (
        <RegisterFormView
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            register={register}
            errors={errors}
            password={password}
            loading={loading}
            error={error}
        />
    )
}



const RegisterFormView = (props) => {
    const {
        handleSubmit,
        onSubmit,
        register,
        errors,
        password,
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
                                    value: 6,
                                    message: 'At least 6 characters'
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
                <Box spacing='20px'>
                    <FormControl isInvalid={errors.confirmPassword}>
                        <FormLabel>Confirm the password</FormLabel>
                        <Input
                            id='confirmPassword'
                            type='password'
                            placeholder='Password'
                            size='lg'
                            {...register('confirmPassword', {
                                required: 'Password confirmation is mandatory',
                                validate: (value) => value === password || 'The passwords must match',
                            })}
                        />
                        <FormErrorMessage>
                            {errors.confirmPassword && errors.confirmPassword.message}
                        </FormErrorMessage>
                    </FormControl>
                </Box>
                <Button
                    mt={4}
                    colorScheme='teal'
                    isLoading={loading}
                    loadingText='Submitting'
                    // isLoading={props.isSubmitting}
                    size='lg'
                    type='submit'
                >
                    Create an account
                </Button>
            </Stack>
        </form>
    )
}

export default RegisterForm