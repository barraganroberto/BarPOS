import { useMemo, useState } from 'react'
import { useShifts } from '../hooks/useShifts'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../components/ui/dialog'
import { Separator } from '../components/ui/separator'
import { Button } from '../components/ui/button'

export default function ShiftsPage() {
    const { data: shifts = [], isLoading, isError, error } = useShifts()
    const [activeId, setActiveId] = useState(null)

    // Only closed shifts, sorted by endTime descending
    const closed = useMemo(() => {
        return shifts
            .filter((s) => s.closed)
            .sort((a, b) => {
                return (
                    new Date(b.endTime ?? 0).getTime() -
                    new Date(a.endTime ?? 0).getTime()
                )
            })
    }, [shifts])

    if (isLoading) {
        return (
            <div className="flex flex-1 items-center justify-center p-4">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        )
    }
    if (isError) {
        return (
            <div className="text-destructive p-4">
                Error loading shifts: {error.message}
            </div>
        )
    }
    if (closed.length === 0)
        return (
            <div className="flex flex-1 items-center justify-center p-4">
                <p className="text-muted-foreground">No closed shifts</p>
            </div>
        )

    // console.log(shifts)

    return (
        <div className="space-y-4 p-4">
            <h1 className="text-2xl font-bold">Shifts History</h1>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Bartender</TableHead>
                        <TableHead className="text-right">Cash (€)</TableHead>
                        <TableHead className="text-right">Card (€)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {closed.map((shift) => (
                        <ShiftRow
                            key={shift._id}
                            shift={shift}
                            isOpen={activeId === shift._id}
                            onOpenChange={(open) =>
                                setActiveId(open ? shift._id : null)
                            }
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

function ShiftRow({ shift, isOpen, onOpenChange }) {
    const {
        cashInitial = 0,
        cardInitial = 0,
        cashCounted = 0,
        cardCounted = 0,
        discrepancyNotes,
        user,
        endTime,
        startTime,
    } = shift

    const formatted = useMemo(() => {
        const date = new Date(endTime ?? startTime)
        return date.toLocaleString('en-US', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        })
    }, [endTime, startTime])
    const name = `${user.firstName} ${user.lastName || ''}`.trim()

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <TableRow className="hover:bg-muted/10 cursor-pointer">
                    <TableCell>{formatted}</TableCell>
                    <TableCell>{name}</TableCell>
                    <TableCell className="text-right">
                        {shift.cashCounted.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                        {shift.cardCounted.toFixed(2)}
                    </TableCell>
                </TableRow>
            </DialogTrigger>

            <ShiftDetailDialog
                cashInitial={cashInitial}
                cardInitial={cardInitial}
                cashCounted={cashCounted}
                cardCounted={cardCounted}
                discrepancyNotes={discrepancyNotes}
                formatted={formatted}
                name={name}
            />
        </Dialog>
    )
}

function ShiftDetailDialog({
    cashInitial,
    cardInitial,
    cashCounted,
    cardCounted,
    discrepancyNotes,
    formatted,
    name,
}) {
    return (
        <DialogContent className="max-w-lg">
            <DialogHeader>
                <DialogTitle>Shift Details: {formatted}</DialogTitle>
                <DialogDescription>
                    Bartender: <strong>{name}</strong>
                </DialogDescription>
            </DialogHeader>

            {/* Shift details */}
            <div className="space-y-2 py-4">
                <div className="flex justify-between">
                    <span>Initial cash:</span>
                    <span>€ {cashInitial.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Initial card:</span>
                    <span>€ {cardInitial.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                    <span>Counted cash:</span>
                    <span>€ {cashCounted.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                    <span>Counted card:</span>
                    <span>€ {cardCounted.toFixed(2)}</span>
                </div>
                {discrepancyNotes && (
                    <>
                        <Separator className="my-2" />
                        <div>
                            <span className="font-medium">Notes:</span>
                            <p className="mt-1 text-sm">{discrepancyNotes}</p>
                        </div>
                    </>
                )}
            </div>

            <DialogFooter>
                <DialogClose asChild>
                    <Button className="w-full">Close</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )
}
