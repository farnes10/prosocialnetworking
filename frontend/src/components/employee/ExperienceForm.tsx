import { Input, Button, Radio, Stack, Textarea, useColorModeValue, Box, FormLabel, Flex, useToast, Container, Heading, FormControl, FormErrorMessage } from '@chakra-ui/react'
import {useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ExperienceSchema } from '../../libs/ExperienceSchema'
import * as z from 'zod'

export const ExperienceForm = () => {
    const {register, handleSubmit, formState: {errors}, watch, trigger} = useForm<z.infer<typeof ExperienceSchema>>({
        resolver: zodResolver(ExperienceSchema),
        defaultValues: {
            position: '',
            company: '',
            startDate: '',
            endDate: undefined,
            description: '',
            tillNowWork: false
        }
    })
    const toast = useToast()
    type FieldName = keyof z.infer<typeof ExperienceSchema>
    const fields = ['position', 'company', 'startDate', 'endDate', 'description', 'tillNowWork']
    const addExperience = async(data: z.infer<typeof ExperienceSchema>) => {
        const formData = new FormData()
        const output= await trigger(fields as FieldName[], {shouldFocus: true})
        if(!output) return
        Object.entries(data).forEach(([key, value]) => {
            if(key === 'startDate' && value !== '') {
                formData.append(key, value.toString())
            }
            if(key === 'endDate' && value !== undefined) {
                formData.append(key, value.toString())
            }
        })
        toast({
            title: 'Experience Added',
            description: 'Your experience has been added successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
        })
        console.log(formData)
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
                    <form onSubmit={handleSubmit(addExperience)}>
                        <Heading>
                            Ajouter une expérience
                        </Heading>
                        <Flex>
                            <FormControl mr={"5%"} isInvalid={!!errors.position}>
                                <FormLabel>Occupation</FormLabel>
                <Input
                  type="text"
                  placeholder="Occupation"
                  {...register("position")}
                ></Input>
                <FormErrorMessage>
                  {errors.position && errors.position.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.company}>
                <FormLabel>Société</FormLabel>
                <Input
                  type="text"
                  placeholder="Société"
                  {...register("company")}
                ></Input>
                <FormErrorMessage>
                  {errors.company && errors.company.message}
                </FormErrorMessage>
              </FormControl>
              </Flex>
              <Flex>
                            <FormControl mr={"5%"} isInvalid={!!errors.startDate}>
                                <FormLabel>Date de début</FormLabel>
                <Input
                  type="date"
                  placeholder="Date de début"
                  {...register("startDate")}
                ></Input>
                <FormErrorMessage>
                  {errors.startDate && errors.startDate.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.endDate}>
                <FormLabel>Date fin</FormLabel>
                <Input
                  type="date"
                  placeholder="Date fin"
                  {...register("endDate")}
                  disabled={watch('tillNowWork') === true}
                ></Input>
                <FormErrorMessage>
                  {errors.endDate && errors.endDate.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.tillNowWork}>
                <Radio {...register('tillNowWork')}
                disabled={watch('endDate') !== undefined}
                >
                    Occupez-vous actuellement ce poste?
                </Radio>
                <FormErrorMessage>
                  {errors.tillNowWork && errors.tillNowWork.message}
                </FormErrorMessage>
              </FormControl>
              </Flex>
              <FormControl isInvalid={!!errors.description}>
                <FormLabel>Decrivez votre activité</FormLabel>
                <Textarea
                  placeholder="Description du job"
                  {...register("description")}
                ></Textarea>
                <FormErrorMessage>
                  {errors.description && errors.description.message}
                </FormErrorMessage>
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
                </Container>
            </Box>
        </Box>
    )
}