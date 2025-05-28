import { useAuth } from '../hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute() {
    const { user, loading } = useAuth()
    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center">
                Loading...
            </div>
        )
    }
    return user ? <Outlet /> : <Navigate to="/login" replace />
}
