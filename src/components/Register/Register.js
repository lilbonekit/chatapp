import {
    FormControl,
    FormLabel,
    Input,
    Button,
    Box,
    Stack,
    FormErrorMessage,
} from "@chakra-ui/react"

import { useForm } from 'react-hook-form'

const RegisterForm = () => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm({mode: "onBlur"})

    const onSubmit = ({login, password}) => {
        reset()
        console.log({login, password})
    }

    const password = watch('password', '')

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                <Box spacing='20px'>
                    <FormControl isInvalid={errors.login}>
                        <FormLabel>Login</FormLabel>
                        <Input
                            id='login'
                            size='lg'
                            placeholder='Login'
                            defaultValue='' 
                            {...register('login', {
                                required: 'Login is required',
                                minLength: {
                                    value: 5,
                                    message: 'At least 5 characters'
                                },
                                maxLength: {
                                    value: 20,
                                    message: 'Maximum of 20 characters'
                                }
                            })}
                        />
                        <FormErrorMessage>
                            {errors.login && errors.login.message}
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
                                    value: 20,
                                    message: 'Maximum of 20 characters'
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