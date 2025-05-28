import { useAuth } from '../hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom'

export default function AdminRoute() {
    const { user } = useAuth()

    return user?.role === 'admin' ? <Outlet /> : <Navigate to="/pos" replace />
}
