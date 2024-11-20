import { useSelector } from "react-redux"
import { Table, TableCaption, Thead, Tr, Td, Tbody} from "@chakra-ui/react"
const ApplicationStatusTable = ()=> {
    const applicationStatus = ['En cours','Acceptée', 'Rejetée' ]
    const applicants = useSelector((store: any)=>store.applicants)
    return(
       <Table>
        <TableCaption>Statut des candidatures</TableCaption>
        <Thead>
            <Tr>
                <Td>Prénom</Td>
                <Td>Nom</Td>
                <Td>Email</Td>
                <Td>Curriculum</Td>
                <Td>Statut</Td>
            </Tr>
        </Thead>
        <Tbody>
            {
                applicants && applicants?.applications?.map((application)=>{
                    <Tr>
                        <Td>{application.applicant?.firstName}</Td>
                        <Td>{application.applicant?.lastName}</Td>
                        <Td>{application.applicant?.email}</Td>
                        <Td>{application?.cv ?<a href={application.cv}></a>:<span>NA</span>}</Td>
                    </Tr>
                })
            }
        </Tbody>
       </Table>    
    )
}
export default ApplicationStatusTable