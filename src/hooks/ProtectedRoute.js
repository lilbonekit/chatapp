import { useLocation, useNavigate } from "react-router-dom"
import { useCurrentUser } from "../store/store"
import { useEffect } from "react"
import { useToast } from "@chakra-ui/react"

const ProtectedRoute = ({ children }) => {
    const currentUser = useCurrentUser(state => state.currentUser)
    const navigate = useNavigate()
    const location = useLocation()
    const toast = useToast()

    useEffect(() => {
        if (!currentUser) {
            if(location.pathname !== '/') {
                toast({
                    title: 'Error!',
                    description: 'To view this page, you need to log in',
                    status: 'error',
                    position: 'top',
                    duration: 9000,
                    isClosable: true,
                })
            }
            navigate('/login', { replace: true })
            return
        }
    }, [currentUser, navigate, toast, location])

    return children
}
export default ProtectedRoute