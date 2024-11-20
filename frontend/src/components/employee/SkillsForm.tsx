import { useState } from 'react'
import { CirclePlus, X } from 'lucide-react'
import { Button, Input, FormControl, FormLabel } from '@chakra-ui/react'
const SkillsForm = ()=> {
    const [skills, setSkills] = useState<string[]>([])
    const addSkill = ()=> {
        return setSkills([...skills, ''])
    }
    const removeSkill = (index:number)=> {
        setSkills(skills.filter((_,i)=>i !== index))
    }
    const updateSkill = (value: string, index: number)=>{
        const newSkills = [...skills]
        newSkills[index] = value
        setSkills(skills)
    }
    const onSubmit = ()=> {
        console.log(skills)
    }
    return(
        <form onSubmit={onSubmit}>
            <Button type='button' onClick={()=>addSkill}><CirclePlus /> Ajouter</Button>
            {skills.map((skill, index)=>(
                <div>
                <FormControl>    
                <FormLabel>Compétence</FormLabel>    
                    <Input 
                    type='text'
                    value={skill}
                    onChange={(e)=>updateSkill(e.target.value, index)}/>
                </FormControl>    
                <Button type='button' onClick={()=>removeSkill(index)}><X/></Button>
                </div>
            ))}
            <Button type='submit'></Button>
        </form>   
    )
}
export default SkillsForm