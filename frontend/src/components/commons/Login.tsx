import { useForm } from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import { LoginSchema } from '../../libs/LoginSchema'
import { Button,Image, Text, Checkbox, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, InputGroup, InputRightElement, Stack, useToast } from '@chakra-ui/react'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
const Login = ()=> {
    const {register, handleSubmit, trigger, formState:{errors}} = useForm<z.infer<typeof LoginSchema>>({
        resolver:zodResolver(LoginSchema),
        defaultValues:{
            email:'',
            password:''
        }
    })
    const [show, setShow] = useState<boolean>(false)
    const showPassword = ()=>setShow(!show)
    const toast = useToast()
    type FieldName = keyof z.infer<typeof LoginSchema>
    const login =async (data: z.infer<typeof LoginSchema>)=>{
        const formData = new FormData()
        const fields = ['email', 'password']
        const output = await trigger(fields as FieldName[], {shouldFocus: true})
        if(!output) return 
        Object.entries(data).forEach(([key, value])=>{
            if(key === 'email' && value !== ''){
                formData.append(key, value.toString())
            }
            if(key === 'password' && value !== ''){
                formData.append(key, value.toString())
            }
        })
        for(const [key, value] of formData.entries()){
            console.log(`${key}: ${value}`);
        }
        toast({
            title: 'Connexion réussie.',
            description: "Connecté.",
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        console.log('FormData ready for submission:', formData);
    }
    return(
        <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
            <Flex p={8} flex={1} align={'center'} justify={'center'}>
                <Stack spacing={4} w={"full"} maxW={'md'}>
                    <Heading textAlign={"center"} fontSize={"2xl"}>Se connecter</Heading>
                    <form onSubmit={handleSubmit(login)}>
                        <FormControl isInvalid={!!errors.email}>
                            <FormLabel>Email</FormLabel>
                            <Input type="text" {...register('email')} placeholder="Email"/>
                            <FormErrorMessage>{errors.email?.message && errors.email.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.password}>
                            <FormLabel>Mot de passe</FormLabel>
                            <InputGroup>
                                <Input type={show?'text':'password'} {...register('password')} placeholder="Mot de passe"></Input>
                                <InputRightElement width={"4.5rem"}>
                                    <Button height={"1.75rem"} size={"sm"} onClick={showPassword}>{show?<EyeOff/>:<Eye/>}</Button>
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>{errors.password?.message && errors.password.message}</FormErrorMessage>
                        </FormControl>
                        <Stack spacing={6}>
                            <Stack
                            direction={{ base: 'column', sm: 'row' }}
                            align={'start'}
                            justify={'space-between'}>
                                <Checkbox>Me souvient</Checkbox>
                                <Link to={'/forgetpassword'}><Text color={'blue.500'}>Mot de passe oublié ?</Text></Link>
                            </Stack>
                            <Button type='submit' colorScheme={'teal'} variant={'solid'}>
                                Se connecter
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            </Flex>
            <Flex flex={1}>
                <Image
                alt={'Login Image'}
                objectFit={'cover'}
                src={
                    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
                }
                />
            </Flex>
        </Stack>
    )
}
export default Login