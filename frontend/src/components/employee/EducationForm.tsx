import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EducationSchema } from '../../libs/EducationSchema'
import * as z from 'zod'
import { Box, Container, Stack, useToast,Heading, Text, useColorModeValue, FormControl,FormLabel, Input, Button, FormErrorMessage, Flex } from '@chakra-ui/react'

const EducationForm = ()=> {
    
    const toast = useToast()
    const {register, handleSubmit, formState:{errors}, trigger} = useForm<z.infer<typeof EducationSchema>>({
        resolver: zodResolver(EducationSchema),
        defaultValues:{
            degree: '',
            speciality:'',
            institution: '',
            startDate:'',
            endDate:'',
        }
    })

    type FieldName = keyof z.infer<typeof EducationSchema>
    const fields = ['degree', 'speciality', 'institution', 'startDate', 'endDate']
    const addEducation =  async(data: z.infer<typeof EducationSchema>) => {
        const output = await trigger(fields as FieldName[], {shouldFocus: true})
        if (!output) return
        const formData = new FormData()
        Object.entries(data).forEach(([key, value])=>{
            formData.append(key, value)
        })
        toast({
            title: 'Education Added',
            description: 'Your education has been added',
            status: 'success',
            duration: 3000,
            isClosable: true,
        })
    }
    return(
        <Box
        minHeight="100vh"
        width="100%"
        bg={useColorModeValue('gray.50', 'gray.800')}
        py={12}
        display="flex"
        justifyContent="center"
        alignItems="center">
            <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)">
                <Container
                maxW={{ base: '90%', sm: 'container.sm', md: 'container.md' }}
                mx={"auto"}
                py={12}>
                    <Stack
                    spacing={4}
                    w={'full'}
                    maxW={'md'}
                    mx="auto"
                    bg={useColorModeValue('white', 'gray.700')}
                    rounded={'xl'}
                    boxShadow={'lg'}
                    p={6}>
                        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
                            Education
                        </Heading>
                        <Text
                        fontSize={{ base: 'sm', sm: 'md' }}
                        color={useColorModeValue('gray.800', 'gray.400')}
                        >
                            Ajouter un niveau d'éducation
                        </Text>
                        <form onSubmit={handleSubmit(addEducation)}>
                            <FormControl isInvalid={!!errors.degree}>
                                <FormLabel>Niveau</FormLabel>
                                <Input type='text' placeholder="Niveau" {...register('degree')}></Input>
                                <FormErrorMessage>{errors.degree?.message && errors.degree.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.speciality}>
                                <FormLabel>Spécialité</FormLabel>
                                <Input type='text' placeholder="Spécialité" {...register('speciality')}></Input>
                                <FormErrorMessage>{errors.speciality?.message && errors.speciality.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.institution}>
                                <FormLabel>Etablissement</FormLabel>
                                <Input type='text' placeholder="Etablissement" {...register('institution')}></Input>
                                <FormErrorMessage>{errors.institution?.message && errors.institution.message}</FormErrorMessage>
                            </FormControl>
                            <Flex>
                            <FormControl isInvalid={!!errors.startDate}>
                                <FormLabel>Date de début</FormLabel>
                                <Input type='date' placeholder="Date début" {...register('degree')}></Input>
                                <FormErrorMessage>{errors.startDate?.message && errors.startDate.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.endDate}>
                                <FormLabel>Date fin</FormLabel>
                                <Input type='date' placeholder="Date fin" {...register('endDate')}></Input>
                                <FormErrorMessage>{errors.endDate?.message && errors.endDate.message}</FormErrorMessage>
                            </FormControl>
                            </Flex>
                            <Stack spacing={6} mt={5}>
                                <Button
                                 type='submit'
                                 bg={'green.400'}
                                 color={'white'}
                                _hover={{
                                    bg:'green.500',
                                    border:'white'
                                    }}
                                >
                                    S'enregistrer  
                                </Button>
                            </Stack>
                        </form>
                    </Stack>
                </Container>
            </Box>
        </Box>
    )
}
export default EducationForm