import React from 'react'
import { Button, Input } from '@chakra-ui/react'
import {usePhoneInput, CountrySelector} from 'react-international-phone'
import 'react-international-phone/style.css';

interface PhoneInputNumberProps {
   value: string
   onChange: (value: string) => void
}

const PhoneInputNumber: React.FC<PhoneInputNumberProps> = ({value, onChange}) => {
const phoneInput = usePhoneInput({
    defaultCountry:'tn',
    value,
    onChange: (data)=>onChange(data.phone)
}) 
return(
    <div className='flex items-center'>
        <CountrySelector selectedCountry={phoneInput.country.iso2}
        onSelect={(country)=>phoneInput.setCountry(country.iso2)}
        renderButtonWrapper={({children, rootProps})=>{
            return <Button {...rootProps} variant={'outline'} px={"4px"} mr={"8px"}>
                {children}
            </Button>
        }}>
        </CountrySelector>
        <Input
          name="phone"
          placeholder="Numéro de téléphone"
          type="tel"
          color="primary"
          value={phoneInput.inputValue}
          onChange={phoneInput.handlePhoneValueChange}
          width={"full"}
          ref={phoneInput.inputRef}
        />
    </div>
) 
}

export  {PhoneInputNumber}