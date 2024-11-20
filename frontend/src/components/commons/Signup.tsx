import {Link} from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { UserSearch } from 'lucide-react'
const SignUp = () => {
    return(
        <>
            <div className='flex flex-row m-2 p-2'>
                <h1 className='text-slate-900 font-semibold not-italic font-sans'>Bienvenue dans FlixJob</h1>
                <p className='text-left font-light'>
                    FlixJob est un réseau social qui met en relation les entreprises et les individus pour améliorer l'employabilité.<br/>
                    FlixJob vous aide à: 
                </p>
                <ul className='list-disc p-2'>
                    <li className='text-left font-light mb-4'>Minimiser le biais entre l'employé et l'employeur</li>
                    <li className='text-left font-light mb-4'>Renforcer les compétences de l'employé</li>
                    <li className='text-left font-light mb-4'>Améliorer l'employabilité donc moins de chômmage</li>
                    <li className='text-left font-light mb-4'>Elevons l'indicateur des personnes actifs</li>
                    <li className='text-left font-light mb-4'>Protégeons l'économie et garantir sa croissance</li>
                </ul>
            </div>
            <div className='flex flex-row mt-2'>
                    <Link to='/signup/employee' className='cursor-pointer shadow-md rounded-md text-center px-4 py-2 text-white bg-slate-950 '><UserSearch/> Je suis un employé</Link>
                    <Link to='/signup/company' className='cursor-pointer shadow-md rounded-md text-center px-4 py-2 text-white bg-slate-950 '><Building2/> Nous sommes une société</Link>
            </div>
        </>
    )
}
export default SignUp