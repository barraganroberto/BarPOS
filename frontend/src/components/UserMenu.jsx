import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import { LogOut, Moon, Settings, Sun, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function UserMenu() {
    const { signOut } = useAuth()
    const [theme, setTheme] = useState('light')

    // Initialize theme
    useEffect(() => {
        const stored = localStorage.getItem('barpos-theme')
        const prefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)'
        ).matches
        const initial =
            stored === 'dark' || (!stored && prefersDark) ? 'dark' : 'light'
        document.documentElement.classList.toggle('dark', initial === 'dark')
        setTheme(initial)
    }, [])

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark'
        setTheme(next)
        localStorage.setItem('barpos-theme', next)
        document.documentElement.classList.toggle('dark', next === 'dark')
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" aria-label="User menu">
                    <User className="text-foreground size-5" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="bg-card border-border w-48 rounded-md border p-1 shadow-md z-90"
            >
                {/* User section */}
                <DropdownMenuLabel className="text-muted-foreground px-3 text-sm uppercase">
                    User
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Theme toggle */}
                <DropdownMenuItem
                    onSelect={toggleTheme}
                    className="hover:bg-muted/10 flex items-center space-x-2 rounded-sm px-3 py-1"
                >
                    {theme === 'dark' ? (
                        <Sun className="size-4" />
                    ) : (
                        <Moon className="size-4" />
                    )}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1" />

                {/* Profile */}
                <DropdownMenuItem asChild>
                    <NavLink
                        to="/profile"
                        className="hover:bg-muted/10 flex items-center space-x-2 rounded-sm px-3 py-1"
                    >
                        <User className="size-4" />
                        <span>Profile</span>
                    </NavLink>
                </DropdownMenuItem>

                {/* Settings */}
                <DropdownMenuItem asChild>
                    <NavLink
                        to="/profile"
                        className="hover:bg-muted/10 flex items-center space-x-2 rounded-sm px-3 py-1"
                    >
                        <Settings className="size-4" />
                        <span>Settings</span>
                    </NavLink>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1" />

                {/* Logout */}
                <DropdownMenuItem asChild>
                    <Button
                        variant="ghost"
                        className="hover:bg-muted/10 flex w-full items-center justify-start space-x-2 rounded-sm px-3 py-1"
                        onClick={signOut}
                    >
                        <LogOut className="size-4" />
                        <span>Logout</span>
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
