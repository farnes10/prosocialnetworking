import JobDescription from "./components/commons/JobDescription"
import Login from "./components/commons/Login"
import SignUp from "./components/commons/Signup"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import EmployeeDashboard from "./components/employee/EmployeeDashboard"
import CompanyDashboard from "./components/company/CompanyDashboard"
import ProtectedEmployeeRouter from "./components/ProtectedEmployeeRoute"
import ProtectedCompanyRoute from "./components/ProtectedCompanyRoute"
import EmployeeRegistrationForm from "./components/commons/EmployeeSignup"
import CompanyRegisrationForm from "./components/commons/CompanySignup"
import Home from "./components/commons/Home"
import ForgetPasswordForm from "./components/commons/ForgetPassword"
import ResetPasswordForm from "./components/commons/UpdatePassword"
import EmailResetPasswordForm from "./components/commons/EmailResetPassword"
import EducationForm from "./components/employee/EducationForm"
import LanguageForm from "./components/employee/LanguageForm"
import { ExperienceForm } from "./components/employee/ExperienceForm"
import JobTitleForm from "./components/employee/JobTitleForm"
import JobDescriptionForm from "./components/employee/JobDescriptionForm"
import Applicants from "./components/company/Applicants"
import JobForm from "./components/company/JobForm"

const appRouter = createBrowserRouter(
   [
      {path:'/', element:<Home/>},
      {path: '/login', element: <Login/>},
      {path:'/description/:id', element: <JobDescription/>},
      {path:'/employee/profile/:id', element:<ProtectedEmployeeRouter><EmployeeDashboard/></ProtectedEmployeeRouter>,
        children:[
          {path:'addeducation', element: <EducationForm/>},
          {path:'addlanguage', element: <LanguageForm/>},
          {path:'addexperience', element: <ExperienceForm/>},
          {path:'updatejob_title', element: <JobTitleForm/>},
          {path:'updatejobdescription', element: <JobDescriptionForm/>},
          {path:'updatepassword', element: <ResetPasswordForm/>},
        ]
      },
      {path: '/company/profile/:id', element:<ProtectedCompanyRoute><CompanyDashboard/></ProtectedCompanyRoute>,
        children:[
          {path:'updatepassword', element: <ResetPasswordForm/>},
          {path:'applications', element: <Applicants/>},
          {path:'addjob', element: <JobForm/>},
        ]
      },
      {path:'/signup', element: <SignUp/>},
      {path:'/signup/employee', element: <EmployeeRegistrationForm/>},
      {path:'/signup/company', element: <CompanyRegisrationForm/>},
      {path:'/forgetpassword', element: <ForgetPasswordForm/>},
      {path:'/resetpassword', element: <EmailResetPasswordForm/>},
  ]
) 
function App() {
  
  return (
    <RouterProvider router={appRouter}/>
  )
}

export default App
