import { Navigate, Routes, Route } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import POSPage from './pages/POSPage'
import OrdersPage from './pages/OrdersPage'
import ShiftSummaryPage from './pages/ShiftSummaryPage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import UsersPage from './pages/UsersPage'
import ProfilePage from './pages/ProfilePage'
import ShiftsPage from './pages/ShiftsPage'
import ProductsPage from './pages/ProductsPage'
import TestPage from './TestPage'
import { Toaster } from 'sonner'

export default function App() {
    return (
        <>
        <Toaster position='bottom-center' />
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<AppLayout />}>
                    {/* Private routes */}
                    <Route index element={<Navigate to="/pos" replace />} />
                    <Route path="pos" element={<POSPage />} />
                    <Route path="orders" element={<OrdersPage />} />
                    <Route path="shift" element={<ShiftSummaryPage />} />
                    <Route path="profile" element={<ProfilePage />} />

                    {/* Admin routes */}
                    <Route element={<AdminRoute />}>
                        <Route path="users" element={<UsersPage />} />
                        <Route path="products" element={<ProductsPage />} />
                        <Route path="shifts" element={<ShiftsPage />} />
                        <Route path="test" element={<TestPage />} />
                    </Route>
                </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        </>
    )
}
