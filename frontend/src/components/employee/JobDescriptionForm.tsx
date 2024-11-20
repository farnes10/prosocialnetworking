import { Button, FormControl, Box, Container, Heading, Input, Text, useColorModeValue, useToast, FormErrorMessage, Stack } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { JobDescriptionSchema } from '../../libs/JobSchema'
import * as z from 'zod'
const JobDescriptionForm = () => {
    const {register, handleSubmit, trigger, formState:{errors}} = useForm<z.infer<typeof JobDescriptionSchema>>({
        resolver: zodResolver(JobDescriptionSchema),
        defaultValues:{
            jobDescription: '',
        }
    })
    const toast = useToast()
    type FieldName = keyof z.infer<typeof JobDescriptionSchema>
    const jobDescription = async(data: z.infer<typeof JobDescriptionSchema>) => {
        const formData = new FormData()
        const field = 'jobDescription'
        const output = await trigger(field as FieldName, {shouldFocus: true})
        if(!output) return
        Object.entries(data).forEach(([key, value]) => {
            if(key === 'jobTitle' && value !== '') {
                formData.append(key, value.toString())
            }
        })
        for(const [key, value] of formData.entries()){
            console.log(`${key}: ${value}`);
        }
        toast({
            title: 'Description du job',
            description: "Description du job mis a jour",
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        console.log('FormData ready for submission:', formData);
    }
    return(
        <Box
        minHeight="100vh"
        width="100%"
        bg={useColorModeValue('gray.50', 'gray.800')}
        py={12}
        display="flex"
        justifyContent="center"
        alignItems="center"
>
<Box
    position="absolute"
    top="50%"
    left="50%"
    transform="translate(-50%, -50%)"
  >
  <Container
    maxW={{ base: '90%', sm: 'container.sm', md: 'container.md' }}
    mx={"auto"}
    py={12}
  >
    <Stack
      spacing={4}
      w={'full'}
      maxW={'md'}
      mx="auto"
      bg={useColorModeValue('white', 'gray.700')}
      rounded={'xl'}
      boxShadow={'lg'}
      p={6}
    >
      <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
        Description du job
      </Heading>
      <Text
        fontSize={{ base: 'sm', sm: 'md' }}
        color={useColorModeValue('gray.800', 'gray.400')}
      >
        Saisir votre nouvelle description du job
      </Text>
      <form onSubmit={handleSubmit(jobDescription)}>
        <FormControl isInvalid={!!errors.jobDescription}>
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="email"
            {...register('jobDescription')}
            autoComplete='off'
          />
          <FormErrorMessage>{errors.jobDescription?.message && errors.jobDescription.message}</FormErrorMessage>
        </FormControl>
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

export default JobDescriptionForm