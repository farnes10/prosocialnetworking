import { LanguageSchema } from "../../libs/LanguageSchema";
import * as z from "zod"
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form'
import axios from "axios";
import { LANG_API_END_POINT } from "../../globals";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../../redux/authSlice";
import { Box, Container, Input, Button, FormControl,useToast, FormErrorMessage, Stack, useColorModeValue, Heading, Select } from "@chakra-ui/react";
import { Loader2 } from "lucide-react";
const LanguageForm = ()=> {
    const [loading, setLoading] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const {currentUser} = useSelector((store: any) => store.auth)
    const dispatch = useDispatch()
    const toast = useToast()
    const {
        register,
        handleSubmit,
        formState:{errors},
        trigger
    } = useForm<z.infer<typeof LanguageSchema>>({
        resolver: zodResolver(LanguageSchema),
        defaultValues:{
            language: '',
            level:''
        }
    })
    type FieldName = keyof z.infer<typeof LanguageSchema>
    const fields = ['language', 'level']
    const addLanguage = async(data:z.infer<typeof LanguageSchema>) => {
        const formData = new FormData()
        const output = await trigger(fields as FieldName[], {shouldFocus: true})
        if(!output) return
        Object.entries(data).forEach(([key, value])=>{
            if(key === 'language' && value !==''){
                formData.append(key, value.toString())
            }
            if(key === 'level' && value !== '') {
                formData.append(key, value)
            }
        })
        try {
            setLoading(true)
            const response = await axios.post(`${LANG_API_END_POINT}/add`,formData, {
            headers:{
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true
        })
        if(response.data) {
            dispatch(setCurrentUser(currentUser.languages.unshift(response.data)))
            toast({
                title: 'Langue ajouté.',
                description: "Langue ajouté avec succès",
                status: 'success',
                duration: 3000,
                isClosable: true,
              })
        }
    }
        catch(error) {
            console.log(error)
            toast({
                title: 'Erreur',
                description: "Erreur lors de l'ajout de la langue",
                status: 'error',
                duration: 3000,
                isClosable: true
            })
        }
        finally {
            setLoading(false)
        }
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
        Ajouter une langue
      </Heading>
      <form onSubmit={handleSubmit(addLanguage)}>
        <FormControl isInvalid={!!errors.language}>
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="email"
            {...register('language')}
            autoComplete='off'
          />
          <FormErrorMessage>{errors.language?.message && errors.language.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.level}>
          <Select placeholder="Niveau" {...register('level')}>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
            <option value="C2">C2</option>
            <option value="Langue maternelle">Mangue maternelle</option>
          </Select>
          <FormErrorMessage>{errors.level?.message && errors.level.message}</FormErrorMessage>
        </FormControl>
        <Stack spacing={6} mt={5}>
          {loading ?<Button
            type='submit'
            bg={'green.400'}
            color={'white'}
            _hover={{
              bg:'green.500',
              border:'white'
            }}
          >
            <Loader2 className="w-full my-4"/> Patientez s'il vous plaît
          </Button>:
          <Button
          type='submit'
          bg={'green.400'}
          color={'white'}
          _hover={{
            bg:'green.500',
            border:'white'
          }}
        >
          Ajouter une langue  
        </Button>}
        </Stack>
      </form>
    </Stack>
  </Container>
  </Box>
</Box>
    )
}

export default LanguageForm