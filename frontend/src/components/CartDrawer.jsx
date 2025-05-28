import { useAtom, useAtomValue } from 'jotai'
import { cartAtom, totalAtom } from '../state/cartAtom'
import { useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from './ui/sheet'
import { FloatingCartButton } from './FloatingCartButton'
import { Card, CardContent } from './ui/card'
import { CreditCard, DollarSign, Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import {
    AlertDialog,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from './ui/alert-dialog'
import { useCreateSale } from '../hooks/useSales'
import { toast } from 'sonner'
import { useOpenShift } from '../hooks/useOpenShift'

export default function CartDrawer() {
    // Cart & sales state
    const [cart, setCart] = useAtom(cartAtom)
    const total = useAtomValue(totalAtom)

    // React Query mutation + current shift
    const createSale = useCreateSale()
    const { data: openData } = useOpenShift()
    const shiftId = openData?.shift?._id

    // Local UI state
    const [method, setMethod] = useState('cash')
    const [open, setOpen] = useState(false)

    const isBusy = createSale.isLoading

    // Quantity updater
    const updateQty = (id, delta) => {
        setCart((prev) =>
            prev
                .map((i) =>
                    i.id === id ? { ...i, quantity: i.quantity + delta } : i
                )
                .filter((i) => i.quantity > 0)
        )
    }

    // Empty cart
    const emptyCart = () => {
        if (isBusy) return
        setCart([])
        setOpen(false)
    }

    // Checkout -> record sale + clear cart + close drawer
    const handleCheckout = () => {
        if (!cart.length || isBusy || !shiftId) return

        // Build payload for API
        const items = cart.map((item) => ({
            product: item.id,
            quantity: item.quantity,
            priceAtSale: item.price,
        }))

        createSale.mutate(
            { items, method },
            {
                onSuccess: () => {
                    toast.success('Venta registrada')
                    setCart([])
                    setOpen(false)
                },
                onError: (err) => {
                    toast.error(err?.message || 'Error registrando venta')
                },
            }
        )
    }


    const formatSpanishDate = () => {
        const date = new Date()
        const days = [
            'Domingo',
            'Lunes',
            'Martes',
            'Miércoles',
            'Jueves',
            'Viernes',
            'Sábado',
        ]
        const dayName = days[date.getDay()]
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const mins = String(date.getMinutes()).padStart(2, '0')

        return `${dayName} ${day}/${month} - ${hours}:${mins}`
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <FloatingCartButton />
            </SheetTrigger>

            <SheetContent side="right" className="flex w-80 flex-col p-4 z-90">
                {/* Title */}
                <SheetHeader>
                    <SheetTitle>Pedido abierto</SheetTitle>
                    <SheetDescription>{formatSpanishDate()}</SheetDescription>
                </SheetHeader>

                {/* Product list */}
                <div className="my-2 flex-1 space-y-3 overflow-y-auto">
                    {cart.map((item) => (
                        <Card key={item.id}>
                            <CardContent className="flex items-center justify-between p-3">
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-muted-foreground text-sm">
                                        €{item.price.toFixed(2)} x {item.quantity}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="rounded-full"
                                        onClick={() => updateQty(item.id, -1)}
                                        disabled={isBusy}
                                    >
                                        <Minus className='size-4' />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="rounded-full"
                                        onClick={() => updateQty(item.id, +1)}
                                        disabled={isBusy}
                                    >
                                        <Plus className='size-4' />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Total */}
                <div className="mt-2 flex items-center justify-between text-base font-semibold">
                    <span>Total:</span>
                    <span>€{total.toFixed(2)}</span>
                </div>

                {/* Payment method buttons */}
                <div className="mt-4 flex space-x-2">
                    <Button
                        variant={method === 'cash' ? 'outline' : 'primary'}
                        className="flex flex-1 items-center justify-center"
                        onClick={() => setMethod('cash')}
                        disabled={isBusy}
                    >
                        <DollarSign className="mr-2 size-4" />
                        Cash
                    </Button>
                    <Button
                        variant={method === 'card' ? 'outline' : 'primary'}
                        className="flex flex-1 items-center justify-center"
                        onClick={() => setMethod('card')}
                        disabled={isBusy}
                    >
                        <CreditCard className="mr-2" />
                        Card
                    </Button>
                </div>

                {/* Checkout button */}
                <Button
                    className="mt-4 w-full"
                    onClick={handleCheckout}
                    disabled={isBusy || !cart.length}
                >
                    {isBusy ? 'Procesando...' : 'Cobrar'}
                </Button>

                {/* Empty cart with confirmation */}
                {cart.length > 0 && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="destructive"
                                className="mt-2 flex w-full items-center justify-center"
                                disabled={isBusy}
                            >
                                <Trash2 className="mr-2 size-4" /> Vaciar pedido
                            </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    ¿Vaciar pedido?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción eliminará todos los productos
                                    del carrito. ¿Estás seguro?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => {
                                        emptyCart()
                                        setOpen(false)
                                    }}
                                >
                                    Vaciar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </SheetContent>
        </Sheet>
    )
}
