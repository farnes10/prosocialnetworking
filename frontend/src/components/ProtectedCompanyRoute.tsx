import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store";

interface ProtectedCompanyRouteProps{
    children: React.ReactNode
}
const ProtectedCompanyRoute = ({children}: ProtectedCompanyRouteProps)=> {
    const navigate = useNavigate();
    const { currentUser } = useSelector((state: RootState) => state.auth);
    useEffect(()=>{
        if(!currentUser || currentUser.role !== "Employee") {
            navigate('/login')
        }
    },[currentUser, navigate])
    return(
        <>
            {children}
        </>
    )
}

export default ProtectedCompanyRoute