import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchProfile, login } from '../api/auth'
import client from '../api/client'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const navigate = useNavigate()
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem('barpos-user')
        return raw ? JSON.parse(raw) : null
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('barpos-token')
        if (token && !user) {
            client.defaults.headers.Authorization = `Bearer ${token}`
            fetchProfile()
                .then((profile) => {
                    setUser(profile)
                    localStorage.setItem('barpos-user', JSON.stringify(profile))
                })
                .catch(() => {
                    localStorage.removeItem('barpos-token')
                    localStorage.removeItem('barpos-user')
                    delete client.defaults.headers.Authorization
                    setUser(null)
                })
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [])

    const signIn = async ({ username, password }) => {
        setLoading(true)
        const data = await login({ username, password })
        localStorage.setItem('barpos-token', data.token)
        localStorage.setItem('barpos-user', JSON.stringify(data))
        client.defaults.headers.Authorization = `Bearer ${data.token}`
        setUser(data)
        setLoading(false)
        navigate('/pos', { replace: true })
    }

    const signOut = () => {
        localStorage.removeItem('barpos-token')
        localStorage.removeItem('barpos-user')
        delete client.defaults.headers.Authorization
        setUser(null)
        navigate('/login', { replace: true })
    }

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
