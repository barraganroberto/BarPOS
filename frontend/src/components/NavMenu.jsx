import {
    Box,
    Calendar,
    DollarSign,
    LayoutDashboard,
    Milk,
    ShoppingCart,
    Users,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuContent
} from './ui/dropdown-menu'
import { NavLink } from 'react-router-dom'
import { Button } from './ui/button'

export default function NavMenu() {
    const { user } = useAuth()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Open navigation"
                >
                    <LayoutDashboard className="text-foreground size-5" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="bg-card border-border w-48 rounded-md border p-1 shadow-md z-90"
            >
                {/* Bar section */}
                <DropdownMenuLabel className="text-muted-foreground px-3 text-sm uppercase">
                    Bar
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <NavLink
                        to="/pos"
                        className="hover:bg-muted/10 flex items-center space-x-2 rounded-sm px-3 py-1"
                    >
                        <ShoppingCart className="size-4" />
                        <span>POS</span>
                    </NavLink>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <NavLink
                        to="/orders"
                        className="hover:bg-muted/10 flex items-center space-x-2 rounded-sm px-3 py-1"
                    >
                        <Box className="size-4" />
                        <span>Orders</span>
                    </NavLink>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <NavLink
                        to="/shift"
                        className="hover:bg-muted/10 flex items-center space-x-2 rounded-sm px-3 py-1"
                    >
                        <DollarSign className="size-4" />
                        <span>Shift</span>
                    </NavLink>
                </DropdownMenuItem>

                {/* Admin section */}
                {user?.role === 'admin' && (
                    <>
                        <DropdownMenuSeparator className="my-1" />

                        <DropdownMenuLabel className="text-muted-foreground px-3 text-sm uppercase">
                            Admin
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                            <NavLink
                                to="/users"
                                className="hover:bg-muted/10 flex items-center space-x-2 rounded-sm px-3 py-1"
                            >
                                <Users className="size-4" />
                                <span>Users</span>
                            </NavLink>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                            <NavLink
                                to="/shifts"
                                className="hover:bg-muted/10 flex items-center space-x-2 rounded-sm px-3 py-1"
                            >
                                <Calendar className="size-4" />
                                <span>Shifts</span>
                            </NavLink>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                            <NavLink
                                to="/products"
                                className="hover:bg-muted/10 flex items-center space-x-2 rounded-sm px-3 py-1"
                            >
                                <Milk className="size-4" />
                                <span>Products</span>
                            </NavLink>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
