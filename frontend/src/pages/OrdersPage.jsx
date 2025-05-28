import { DialogClose } from '@radix-ui/react-dialog'
import { Card, CardContent } from '../components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../components/ui/dialog'
import { Separator } from '../components/ui/separator'
import { useOpenShift } from '../hooks/useOpenShift'
import { useShifts } from '../hooks/useShifts'
import { useShiftSales } from '../hooks/useShiftSales'
import { Button } from '../components/ui/button'
import { useMemo } from 'react'

export default function OrdersPage() {
    const { data: openData, isLoading: loadingOpen } = useOpenShift()
    const { data: shifts = [], isLoading: loadingShifts } = useShifts()

    // Determine which shift to show
    const shiftId = useMemo(() => {
        if (openData?.shift?._id) return openData.shift._id
        const lastClosed = shifts.find((s) => s.closed)
        return lastClosed?._id ?? null
    }, [openData, shifts])

    // Fetch only that shift's sales
    const {
        data: sales = [],
        isLoading: loadingSales,
        isError,
        error,
    } = useShiftSales(shiftId)

    // Loading guard
    if (
        loadingOpen ||
        (!shiftId && loadingShifts) ||
        (shiftId && loadingSales)
    ) {
        return (
            <div className="flex flex-1 items-center justify-center p-4">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        )
    }

    // No shift at all
    if (!shiftId) {
        return (
            <div className="flex flex-1 items-center justify-center p-4">
                <p className="text-muted-foreground">No open or closed shift</p>
            </div>
        )
    }

    // Sales API error
    if (isError) {
        return (
            <div className="flex flex-1 items-center justify-center p-4">
                <p className="text-muted-foreground">{error.message}</p>
            </div>
        )
    }

    // Empty sales list
    if (sales.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center p-4">
                <p className="text-muted-foreground">
                    No orders found for this shift.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4 p-4">
            <h2 className="text-lg font-semibold">
                {openData?.shift?._id
                    ? 'Current Shift Orders'
                    : 'Last Shift Orders'}
            </h2>
            {sales.map((sale) => {
                const dateStr = new Date(sale.time).toLocaleString('en-US', {
                    weekday: 'short',
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                })
                return (
                    <Dialog key={sale._id}>
                        <DialogTrigger asChild>
                            <Card className="hover:bg-muted/10 cursor-pointer">
                                <CardContent className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{dateStr}</p>
                                        <p className="text-sm capitalize">
                                            {sale.method}
                                        </p>
                                    </div>
                                    <p className="font-semibold">
                                        €{sale.total.toFixed(2)}
                                    </p>
                                </CardContent>
                            </Card>
                        </DialogTrigger>

                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Order Details</DialogTitle>
                                <DialogDescription>
                                    Method: {sale.method} --{' '}
                                    {new Date(sale.time).toLocaleString(
                                        'en-US'
                                    )}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="mt-4 space-y-2">
                                {sale.items.map((item, idx) => (
                                    <div
                                        className="flex justify-between text-sm"
                                        key={idx}
                                    >
                                        <span>{item.product.name}</span>
                                        <span>
                                            {item.quantity} x €
                                            {item.priceAtSale.toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-4" />

                            <div className="flex justify-between font-semibold">
                                <span>Total</span>
                                <span>€{sale.total.toFixed(2)}</span>
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button className="mt-6 w-full">
                                        Close
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )
            })}
        </div>
    )
}
