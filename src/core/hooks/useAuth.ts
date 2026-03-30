import { useApiClient } from '@/core/helpers/ApiClient'
import { removeToken } from '@/core/helpers/TokenHandle'
import { useNavigate } from 'react-router-dom'

export const useAuth = () => {
    const apiClient = useApiClient()
    const navigate = useNavigate()

    const logout = async () => {
        try {
            await apiClient.post('/logout')

            removeToken()
            navigate('/')
            
            return { success: true }
        } catch (error) {
            console.error('Logout error:', error)
            removeToken()
            navigate('/login')
            
            return { success: false, error }
        }
    }

    return { logout }
}