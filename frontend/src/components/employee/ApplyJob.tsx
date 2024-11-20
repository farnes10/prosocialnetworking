import {useForm} from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ApplicationSchema } from '../../libs/ApplicationSchema'
import { Box, useToast, Container, Heading, Text, Input, Textarea, FormControl, FormLabel,  FormErrorMessage, Button, Stack} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'

const ApplicationForm = ()=> {
    const [loading, setLoading] = useState(false)
    const {register, handleSubmit, trigger, formState: {errors}, setValue, watch} = useForm<z.infer<typeof ApplicationSchema>>({
        resolver: zodResolver(ApplicationSchema),
        defaultValues:{
            coverLetter: '',
            cv: undefined
        }
    })
    const fileRefInput = useRef<HTMLInputElement>(null)
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
    const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void=>{
        const file = e.target.files?.[0]
        if(file){
            setValue('cv', file)
            setSelectedFileName(file.name)
        }
        else {
            setValue('cv', null)
            setSelectedFileName(null)
        }
    }
    const toast = useToast()
    type FieldName = keyof z.infer<typeof ApplicationSchema>
    const applyJob = async (data: z.infer<typeof ApplicationSchema>) => {
        setLoading(true)
        const fields = ['cv', 'coverLetter']
        const output = await trigger(fields as FieldName[])
        if(!output) return
        const formData = new FormData()
        Object.entries(data).forEach(([key, value])=>{
            formData.append('coverLetter', watch('coverLetter'))
            if(key === 'cv' && value !== undefined && value !== null){
                formData.append(key, value.toString())
            }
        }
        )
        toast({
            title: 'Application submitted',
            description: "Votre candidature à été soumise avec succès",
            status: 'success',
            duration: 2000,
            isClosable: true,
        })
        console.log(formData)
        setLoading(false)
    }
    return(
        <Box>
            <Box>
                <Container>
                    <Stack>
                    <Heading>
                        Postuler
                    </Heading>
                    <Text>
                        Postuler à cet offre d'emploi votre candidature
                    </Text>
                    <form onSubmit={handleSubmit(applyJob)}>
                        <FormControl isInvalid={!!errors.cv}>
                            <FormLabel>CV</FormLabel>
                            <Input type = 'file' ref={fileRefInput} onChange={fileChangeHandler} style={{display:'none'}}
                            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'/>
                            <Button onClick={() => fileRefInput.current?.click()}>
                                Téléverser votre CV
                            </Button>
                            {selectedFileName && <Text mt={2}>{selectedFileName}</Text>}
                            <FormErrorMessage>{errors.cv?.message && errors.cv.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.coverLetter}>
                            <FormLabel>Lettre de motivation</FormLabel>
                            <Textarea placeholder='Lettre de motivation...' {...register('coverLetter')}></Textarea>
                            <FormErrorMessage>{errors.coverLetter?.message && errors.coverLetter.message}</FormErrorMessage>
                        </FormControl>
                        <Stack>
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
export default ApplicationForm