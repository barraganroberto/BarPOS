import Logo from './Logo'
import NavMenu from './NavMenu'
import UserMenu from './UserMenu'

export default function Navbar() {
    return (
        <header className="z-80 bg-card border-border fixed inset-x-0 top-0 flex h-14 items-center justify-between border-b px-4">
            {/* Left: logo */}
            <Logo />

            {/* Right: page nav + user dropdown */}
            <div className="flex items-center space-x-2">
                <NavMenu />
                <UserMenu />
            </div>
        </header>
    )
}
