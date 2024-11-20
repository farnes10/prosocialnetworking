import { Box, Container, Heading, Stack, Text, useColorModeValue } from "@chakra-ui/react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { setCurrentUser } from "@/redux/authSlice"
const EmailVerifyAccount = ()=>{
    const dispatch = useDispatch()
    const {currentUser} = useSelector((state:RootState)=>state.auth)
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
                        <Heading>
                            Vérifier votre compte
                        </Heading>
                        <Text>
                            Nous avous envoyé un email à {dispaatch(currentUser?.email)}
                        </Text>
                    </Stack>
                </Container>
            </Box>
        </Box>
    )
}
export default EmailVerifyAccount