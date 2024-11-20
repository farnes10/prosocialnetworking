import { Country, State, City } from "country-state-city";
import {useState} from 'react'
interface ICountry{
    name: string
    code: string
}
interface IState{
    name: string
    code: string
}
interface ICity {
    name: string
}
const useLocationPicker = ()=>{
    const [location, setLocation] = useState({
        country: "",
        state: "",
        city: "",
      })
       
      const [selectedCountry, setSelectedCountry] = useState("");
      const handleCountryChange = (country:ICountry) => {
        if (country.code !== selectedCountry) {
          setSelectedCountry(country.code);
          setLocation({ ...location, country: country.code, state: "", city: "" }); // Reset state and city on country change
        }
      };
    
      // Update selectedState only if country and state actually change
      const [selectedState, setSelectedState] = useState("");
      const handleStateChange = (state:IState) => {
        if (selectedCountry && state.code !== selectedState) {
          setSelectedState(state.code);
          setLocation({ ...location, state: state.code, city: "" }); // Reset city on state change
        }
      };
    
      // Update selectedCity only if country, state, and city actually change
      const [selectedCity, setSelectedCity] = useState("");
      const handleCityChange = (city: ICity) => {
        if (selectedCountry && selectedState && city.name !== selectedCity) {
          setSelectedCity(city.name);
          setLocation({ ...location, city: city.name });
        }
      };
      const countries = Country.getAllCountries().map((country)=>(
        {
          name: country.name,
          code: country.isoCode,
        }
      ))
      const states = State.getStatesOfCountry(selectedCountry).map((state): IState=>({
        name: state.name,
        code: state.isoCode,
      }))
      const cities = City.getCitiesOfState(selectedCountry, selectedState).map((city)=>({
        name:city.name
      }))
      return{
        location,
        countries,
        states,
        cities,
        handleCountryChange,
        handleStateChange,
        handleCityChange
      }
}
export default useLocationPicker