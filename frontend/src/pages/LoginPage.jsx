import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'

export default function LoginPage() {
    const { user, signIn, authLoading } = useAuth()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    // If already logged in, redirect to POS
    if (user) {
        return <Navigate to="/shift" replace />
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await signIn({ username, password })
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Error logging in'
            )
        }
    }

    return (
        <div className="flex h-full items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle>BarPOS Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={authLoading}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={authLoading}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={authLoading}
                        >
                            {authLoading ? 'Loading...' : 'Login'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
