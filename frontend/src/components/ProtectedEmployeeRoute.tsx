import { RootState } from '@/redux/store'
import {useEffect} from 'react'
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'
interface ProtectedEmployeeRouterProps{
    children: React.ReactNode
}
const ProtectedEmployeeRouter = ({children}: ProtectedEmployeeRouterProps)=> {
    const {currentUser} = useSelector((store: RootState) => store.auth)
    const navigate = useNavigate()
    useEffect(()=>{
        if(!currentUser|| currentUser.role !== "Company") {
            navigate('/login')
        }
    },[currentUser, navigate])
    return(
        <>
            {children}
        </>
    )
}
export default ProtectedEmployeeRouter