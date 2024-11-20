import {
  Box,
  useSteps,
  FormControl,
  FormLabel,
  Input,
  Flex,
  InputGroup,
  InputRightElement,
  Button,
  Textarea,
  ButtonGroup,
  useToast,
  Progress,
  Heading,
  SimpleGrid,
  Select,
  Text,
  useColorModeValue,
  FormErrorMessage,
  Container,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { PhoneInputNumber } from "./phoneInput";
import useLocationPicker from "../../hooks/useLocationPicker";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { EmployeeSchema } from "../../libs/EmployeeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setLoading } from "../../redux/authSlice";
import axios from "axios";
import { USER_API_END_POINT } from "../../globals";
import { useNavigate } from "react-router-dom";
const EmployeeRegistrationForm = () => {
  const steps = [
    {
      title: "Se connecter",
      description: "S'authentifier",
      fields: [
        "email",
        "password",
        "firstName",
        "lastName",
        "birthdate",
        "phone",
      ],
    },
    {
      title: "Infos du candidat",
      description: "Info Professionnelles",
      fields: ["address", "zipCode", "city", "province", "country"],
    },
    {
      title: "Addresse",
      description: "Addresse du candidat",
      fields: ["jobTitle", "jobDescription"],
    },
    { title: "Image", description: "Photo de profil", fields: ["image"] },
  ];
  const {loading, currentUser} = useSelector((store:RootState)=> store.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const toast = useToast();
  const {
    countries,
    states,
    cities,
    handleCountryChange,
    handleStateChange,
    handleCityChange,
  } = useLocationPicker();
  const { activeStep, goToNext, goToPrevious } = useSteps({
    index: 0,
    count: steps.length,
  });
  const [show, setShow] = useState<boolean>(false);
  const showPassword = () => setShow(!show);
  const [phoneNumber, setPhoneNumber] = useState("");
  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
  };
  const [progress, setProgress] = useState(25);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<z.infer<typeof EmployeeSchema>>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      birthdate: "",
      phone: phoneNumber,
      address: "",
      zipCode: "",
      city: "",
      province: "",
      country: "",
      jobTitle: "",
      jobDescription: "",
      image: undefined,
    },
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const changeFileHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      setSelectedFileName(file.name);
    } else {
      setValue("image", null);
      setSelectedFileName(null);
    }
  };
  type FieldName = keyof z.infer<typeof EmployeeSchema>;
  const handleNext = async () => {
    const fields = steps[activeStep].fields;
    const output = await trigger(fields as FieldName[], { shouldFocus: true });
    if (!output) return;
    goToNext();
    if (activeStep === 3) {
      setProgress(100);
    } else {
      setProgress(progress + 25);
    }
  };
  const handlePrevious = () => {
    goToPrevious();
    setProgress(progress - 25);
  };

  const RegisterEmployee = async(data: z.infer<typeof EmployeeSchema>) => {
    const formData = new FormData();
    formData.append("email", watch("email"));
    formData.append("password", watch("password"));
    formData.append("firstName", watch("firstName"));
    formData.append("lastName", watch("lastName"));
    formData.append("birthdate", watch("birthdate"));
    formData.append("phone", watch("phone"));
    formData.append("jobTitle", watch("jobTitle"));
    formData.append("jobDescription", watch("jobDescription"));
    formData.append("country", watch("country"));
    formData.append("province", watch("province"));
    formData.append("city", watch("city"));
    formData.append("address", watch("address"));
    formData.append("zipCode", watch("zipCode"));
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "image" && value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    if (data.image instanceof File) {
      formData.append("image", data.image);
    }
    try {
      dispatch(setLoading(true))
      const req = await axios.post(`${USER_API_END_POINT}/signup/employee`, formData,{
        headers:{'Content-Type':"multipart/form-data"},
        withCredentials:true
      })
      if(req.data){
        navigate('/login')
        toast({
          title: "Compte créé",
          description: "Nouveau compte créé en tant qu'un employé",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      console.log("FormData ready for submission:", formData);
    } catch (error) {
      console.error(error)
      toast({
        title: "Echec",
        description: "echec de création du compte d'un employé",
        status:"error",
        duration: 3000,
        isClosable: true,
      });
    }
    finally{
      dispatch(setLoading(false))
    }
  };
  useEffect(()=>{
    if(currentUser){
      navigate('/')
    }
  }, [currentUser, navigate])
  return (
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
      transform="translate(-50%, -50%)">
      <Container
      maxW={{ base: '90%', sm: 'container.sm', md: 'container.md' }}
      mx={"auto"}
      py={12}>
      <Progress
        colorScheme="gray"
        value={progress}
        mb="5%"
        mx="5%"
        isAnimated
      ></Progress>
      <form onSubmit={handleSubmit(RegisterEmployee)}>
        {activeStep === 0 && (
          <>
            <Heading w="100%" textAlign={"center"} fontWeight="normal">
              Enregister l'utilisateur
            </Heading>

            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="text"
                placeholder="Email"
                {...register("email")}
              ></Input>
              <FormErrorMessage>
                {errors.email?.message && errors.email.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Mot de passe</FormLabel>
              <InputGroup>
                <Input
                  type={show ? "text" : "password"}
                  {...register("password")}
                  placeholder="Entrer votre mot de passe"
                ></Input>
                <InputRightElement width={"4.5rem"}>
                  <Button height={"1.75rem"} size={"sm"} onClick={showPassword}>
                    {show ? <EyeOff /> : <Eye />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>
            <Flex>
              <FormControl mr={"5%"} isInvalid={!!errors.lastName}>
                <FormLabel>Nom</FormLabel>
                <Input
                  type="text"
                  placeholder="Nom"
                  {...register("lastName")}
                ></Input>
                <FormErrorMessage>
                  {errors.lastName && errors.lastName.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.firstName}>
                <FormLabel>Prénom</FormLabel>
                <Input
                  type="text"
                  placeholder="Prénom"
                  {...register("firstName")}
                ></Input>
                <FormErrorMessage>
                  {errors.firstName && errors.firstName.message}
                </FormErrorMessage>
              </FormControl>
            </Flex>
            <Flex>
              <FormControl mr={"5%"} isInvalid={!!errors.birthdate}>
                <FormLabel>Date de naissance</FormLabel>
                <Input
                  type="date"
                  placeholder="Date de naissance"
                  {...register("birthdate")}
                ></Input>
                <FormErrorMessage colorScheme="red">
                  {errors.birthdate && errors.birthdate.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.phone}>
                <FormLabel>Téléphone</FormLabel>
                <PhoneInputNumber
                  {...register("phone")}
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                />
                <FormErrorMessage colorScheme="red">
                  {errors.phone && errors.phone.message}
                </FormErrorMessage>
              </FormControl>
            </Flex>
          </>
        )}
        {activeStep === 2 && (
          <>
            <Heading w="100%" textAlign={"center"} fontWeight="normal">
              Détail du job
            </Heading>
            <SimpleGrid columns={1} spacing={6}>
              <FormControl isInvalid={!!errors.jobTitle}>
                <FormLabel>Intitulé du job</FormLabel>
                <Input
                  {...register("jobTitle")}
                  type="text"
                  placeholder="Intitulé du job"
                ></Input>
                <FormErrorMessage colorScheme="red">
                  {errors.jobTitle && errors.jobTitle.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.jobDescription}>
                <FormLabel>Description du profil</FormLabel>
                <Textarea
                  {...register("jobDescription")}
                  placeholder="Description du profil"
                ></Textarea>
                <FormErrorMessage colorScheme="red">
                  {errors.jobDescription && errors.jobDescription.message}
                </FormErrorMessage>
              </FormControl>
            </SimpleGrid>
          </>
        )}
        {activeStep === 1 && (
          <>
            <Heading w="100%" textAlign={"center"} fontWeight={"normal"}>
              Informations de contact
            </Heading>
            <FormControl isInvalid={!!errors.address}>
              <FormLabel>Addresse</FormLabel>
              <Input
                type="text"
                placeholder="Addresse"
                {...register("address")}
              ></Input>
              <FormErrorMessage>
                {errors.address && errors.address.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.zipCode}>
              <FormLabel>Code postal</FormLabel>
              <Input
                type="text"
                placeholder="Code postal"
                {...register("zipCode")}
              ></Input>
              <FormErrorMessage>
                {errors.zipCode && errors.zipCode.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.country}>
              <FormLabel>Pays</FormLabel>
              <Select
                {...register("country")}
                onChange={(e) =>
                  handleCountryChange({ code: e.target.value, name: "" })
                }
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors.country && errors.country.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.province}>
              <FormLabel>Province</FormLabel>
              <Select
                {...register("province")}
                onChange={(e) =>
                  handleStateChange({ code: e.target.value, name: "" })
                }
              >
                {states.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors.province && errors.province.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.city}>
              <FormLabel>Ville</FormLabel>
              <Select
                {...register("city")}
                onChange={(e) => handleCityChange({ name: e.target.value })}
              >
                {cities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors.city && errors.city.message}
              </FormErrorMessage>
            </FormControl>
          </>
        )}
        {activeStep === 3 && (
          <>
            <Heading w={"100%"} textAlign={"center"} fontWeight={"normal"}>
              Photo du profil
            </Heading>
            <FormControl isInvalid={!!errors.image}>
              <FormLabel>Photo de profil</FormLabel>
              <Input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: "none" }}
                onChange={changeFileHandler}
                placeholder="Description du profil"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
              <Button onClick={() => fileInputRef.current?.click()}>
                Ajouter un fichier
              </Button>
              {selectedFileName && <Text mt={2}>{selectedFileName}</Text>}
              {errors.image?.message && (
                <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
              )}
            </FormControl>
          </>
        )}
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={handlePrevious}
                isDisabled={activeStep === 0}
                colorScheme="teal"
                variant="solid"
                w="7rem"
                mr="5%"
              >
                Précédant
              </Button>
            </Flex>
            <Flex>
              <Button
                w="7rem"
                isDisabled={activeStep === 3}
                onClick={handleNext}
                colorScheme="teal"
                variant="outline"
              >
                Suivant
              </Button>
            </Flex>
          </Flex>
          {activeStep === 3 ? (
            loading ? <Button p={2}> <Loader2/> Patientez s'il vous plaît...</Button> : <Button w="7rem" colorScheme="teal" variant="solid" type="submit">
              S'inscrire
            </Button> 
          ) : null}
        </ButtonGroup>
      </form>
      </Container>
      </Box>
    </Box>
  );
};
export default EmployeeRegistrationForm;
