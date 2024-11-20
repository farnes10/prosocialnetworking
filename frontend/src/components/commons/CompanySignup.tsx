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
import { useRef, useState } from "react";
import { PhoneInputNumber } from "./phoneInput";
import useLocationPicker from "../../hooks/useLocationPicker";
import { Eye, EyeOff } from "lucide-react";
import { CompanySchema } from "../../libs/CompanySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
const CompanyRegisrationForm = () => {
  const steps = [
    {
      title: "Se connecter",
      description: "S'authentifier",
      fields: ["email", "password", "name", "foundationDate", "phone"],
    },
    {
      title: "address",
      description: "Information du contact",
      fields: ["address", "zipCode", "city", "province", "country"],
    },
    {
      title: "Informations sur la société",
      description: "Données de la société",
      fields: [
        "industry",
        "activitySector",
        "slogan",
        "nationalId",
        "description",
        "employeeNumber",
      ],
    },
    { title: "Image", description: "Photo du profil", fields: ["image"] },
  ];
  const {
    countries,
    states,
    cities,
    handleCountryChange,
    handleStateChange,
    handleCityChange,
  } = useLocationPicker();
  const toast = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
  };

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof CompanySchema>>({
    resolver: zodResolver(CompanySchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      foundationDate: "",
      phone: phoneNumber,
      address: "",
      zipCode: "",
      city: "",
      province: "",
      country: "",
      industry: "",
      activitySector: "",
      slogan: "",
      nationalId: "",
      description: "",
      employeeNumber: "",
      image: undefined,
    },
  });
  const fileRefInput = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const changeFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      setSelectedFileName(file.name);
    } else {
      setValue("image", null);
      setSelectedFileName(null);
    }
  };
  const [show, setShow] = useState<boolean>(false);
  const showPassword = () => setShow(!show);

  const [progress, setProgress] = useState(25);
  const { activeStep, goToNext, goToPrevious } = useSteps({
    index: 0,
    count: steps.length,
  });
  type FieldName = keyof z.infer<typeof CompanySchema>;
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
  const RegisterCompany = (data: z.infer<typeof CompanySchema>) => {
    const formData = new FormData();
    formData.append("email", watch("email"));
    formData.append("password", watch("password"));
    formData.append("name", watch("name"));
    formData.append("foundationDate", watch("foundationDate"));
    formData.append("industry", watch("industry"));
    formData.append("activitySector", watch("activitySector"));
    formData.append("slogan", watch("slogan"));
    formData.append("description", watch("description"));
    formData.append("nationalId", watch("nationalId"));
    formData.append("employeeNumber", watch("employeeNumber"));
    formData.append("address", watch("address"));
    formData.append("zipCode", watch("zipCode"));
    formData.append("city", watch("city"));
    formData.append("province", watch("province"));
    formData.append("country", watch("country"));
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "image" && value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    if (data.image instanceof File) {
      formData.append("image", data.image);
    }
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    toast({
      title: "Account created.",
      description: "We've created your account for you.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    console.log("FormData ready for submission:", formData);
  };
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
    transform="translate(-50%, -50%)"
  >
    <Container
    maxW={{ base: '90%', sm: 'container.sm', md: 'container.md' }}
    mx={"auto"}
    py={12}>
      <Progress
        colorScheme="gray"
        value={progress}
        mb={"5%"}
        mx={"5%"}
        isAnimated
      />
      <form onSubmit={handleSubmit(RegisterCompany)}>
        {activeStep === 0 && (
          <>
            <Heading w={"100%"} textAlign={"center"} fontWeight={"normal"}>
              Enregistrer la société
            </Heading>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="text"
                {...register("email")}
                placeholder="Email"
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
                  placeholder="Mot de passe"
                ></Input>
                <InputRightElement width={"4.5rem"}>
                  <Button height={"1.75rem"} size={"sm"} onClick={showPassword}>
                    {show ? <EyeOff /> : <Eye />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>
                {errors.password?.message && errors.password.message}
              </FormErrorMessage>
            </FormControl>
            <Flex>
              <FormControl isInvalid={!!errors.name} mr={"5%"}>
                <FormLabel>Nom de la société</FormLabel>
                <Input
                  type="text"
                  {...register("name")}
                  placeholder="Nom de la société"
                />
                <FormErrorMessage>
                  {errors.name?.message && errors.name.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.phone}>
                <FormLabel>Téléphone</FormLabel>
                <PhoneInputNumber
                  {...register("phone")}
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                />
                <FormErrorMessage>
                  {errors.phone?.message && errors.phone.message}
                </FormErrorMessage>
              </FormControl>
            </Flex>
            <FormControl isInvalid={!!errors.foundationDate}>
              <FormLabel fontSize={"sm"}>Date de foundation</FormLabel>
              <Input type="date" {...register("foundationDate")} />
              <FormErrorMessage>
                {errors.foundationDate?.message &&
                  errors.foundationDate.message}
              </FormErrorMessage>
            </FormControl>
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
        {activeStep === 2 && (
          <>
            <Flex>
              <FormControl isInvalid={!!errors.industry}>
                <FormLabel>Industrie</FormLabel>
                <Input
                  type="text"
                  {...register("industry")}
                  placeholder="Industrie"
                />
                <FormErrorMessage>
                  {errors.industry?.message && errors.industry.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.activitySector}>
                <FormLabel>Secteur d'activité</FormLabel>
                <Input
                  type="text"
                  {...register("activitySector")}
                  placeholder="Secteur d'activité"
                />
                <FormErrorMessage>
                  {errors.activitySector?.message &&
                    errors.activitySector.message}
                </FormErrorMessage>
              </FormControl>
            </Flex>
            <Flex>
              <FormControl isInvalid={!!errors.nationalId}>
                <FormLabel>Identifiant Unique</FormLabel>
                <Input
                  type="text"
                  {...register("nationalId")}
                  placeholder="Identifiant Unique"
                />
                <FormErrorMessage>
                  {errors.nationalId?.message && errors.nationalId.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.employeeNumber}>
                <FormLabel>Nombre des employés</FormLabel>
                <Select {...register("employeeNumber")}>
                  <option value="Petite">Petite entreprise</option>
                  <option value="Moyenne">Entreprise moyenne</option>
                  <option value="Grande">Grande entreprise</option>
                </Select>
              </FormControl>
            </Flex>
            <SimpleGrid column={1} spacing={6}>
              <FormControl isInvalid={!!errors.description}>
                <FormLabel>Description de la société</FormLabel>
                <Textarea
                  {...register("description")}
                  placeholder="Description de la société"
                />
                <FormErrorMessage>
                  {errors.description?.message && errors.description.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.slogan}>
                <FormLabel>Slogan</FormLabel>
                <Textarea {...register("slogan")} placeholder="Slogan" />
                <FormErrorMessage>
                  {errors.slogan?.message && errors.slogan.message}
                </FormErrorMessage>
              </FormControl>
            </SimpleGrid>
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
                ref={fileRefInput}
                accept="image/*"
                style={{ display: "none" }}
                onChange={changeFileHandler}
                placeholder="Description du profil"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
              <Button onClick={() => fileRefInput.current?.click()}>
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
            <Button w="7rem" colorScheme="teal" variant="solid" type="submit">
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

export default CompanyRegisrationForm;
