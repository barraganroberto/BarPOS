import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchProfile, login } from '../api/auth'
import client from '../api/client'
import { STORAGE_TOKEN_KEY, STORAGE_USER_KEY } from '../lib/constants.js'
import { AuthContext } from './AuthContext.js'

export function AuthProvider({ children }) {
    const navigate = useNavigate()
    const [user, setUser] = useState(() =>
        JSON.parse(localStorage.getItem(STORAGE_USER_KEY))
    )
    const [authLoading, setAuthLoading] = useState(false)
    const [profileLoading, setProfileLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        const token = localStorage.getItem(STORAGE_TOKEN_KEY)
        if (token && !user) {
            client.defaults.headers.Authorization = `Bearer ${token}`
            fetchProfile()
                .then((profile) => {
                    if (!mounted) return
                    setUser(profile)
                    localStorage.setItem(
                        STORAGE_USER_KEY,
                        JSON.stringify(profile)
                    )
                })
                .catch(() => {
                    localStorage.removeItem(STORAGE_TOKEN_KEY)
                    localStorage.removeItem(STORAGE_USER_KEY)
                    delete client.defaults.headers.Authorization
                    if (mounted) setUser(null)
                })
                .finally(() => {
                    if (mounted) setProfileLoading(false)
                })
        } else {
            setProfileLoading(false)
        }

        return () => {
            mounted = false
        }
    }, [user])

    const signIn = useCallback(
        async ({ username, password }) => {
            setAuthLoading(true)
            try {
                const data = await login({ username, password })
                localStorage.setItem(STORAGE_TOKEN_KEY, data.token)
                localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data))
                client.defaults.headers.Authorization = `Bearer ${data.token}`
                setUser(data)
                navigate('/pos', { replace: true })
            } catch (error) {
                setAuthLoading(false)
                throw error
            } finally {
                setAuthLoading(false)
            }
        },
        [navigate]
    )

    const signOut = useCallback(() => {
        localStorage.removeItem(STORAGE_TOKEN_KEY)
        localStorage.removeItem(STORAGE_USER_KEY)
        delete client.defaults.headers.Authorization
        setUser(null)
        navigate('/login', { replace: true })
    }, [navigate])

    const value = useMemo(
        () => ({ user, authLoading, profileLoading, signIn, signOut }),
        [user, authLoading, profileLoading, signIn, signOut]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
