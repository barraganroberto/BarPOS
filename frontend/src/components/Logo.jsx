import { Beer } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Logo() {
    return (
        <Link
            to="/pos"
            className="text-foreground flex items-center space-x-2 transition hover:opacity-80"
        >
            <Beer className="size-6" />
            <span className="text-lg font-bold">BarPOS</span>
        </Link>
    )
}
