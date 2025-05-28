import { useState } from 'react'
import { useCloseShift } from '../hooks/useOpenShift'
import { ScrollArea } from './ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { Input } from './ui/input'

export default function ActiveShift({ shift, totals }) {
    const { cash: initialCash, card: initialCard } = totals.initial

    const [countedCash, setCountedCash] = useState(0)
    const [countedCard, setCountedCard] = useState(0)
    const [notes, setNotes] = useState('')
    const closeShift = useCloseShift()

    const isBusy = closeShift.isLoading

    const {
        cash: actualCash,
        card: actualCard,
        total: actualTotal,
    } = totals.actual

    const cashDiff = countedCash - actualCash - initialCash
    const cardDiff = countedCard - actualCard - initialCard
    const hasDiff = cashDiff !== 0 || cardDiff !== 0

    const handleClose = () => {
        closeShift.mutate(
            {
                id: shift._id,
                cashCounted: Number(actualCash),
                cardCounted: Number(actualCard),
                discrepancyNotes: notes || '',
            },
            {
                onSuccess: () => {
                    toast.success('Shift closed')
                },
                onError: (err) => {
                    toast.error(err?.message || 'Error closing shift')
                },
            }
        )
    }

    return (
        <ScrollArea className="h-full p-4">
            {/* Expected totals */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Opening Float</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex justify-between">
                        <span>Initial cash:</span>
                        <span>${initialCash.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Initial card:</span>
                        <span>${initialCard.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                        <span>Total float:</span>
                        <span>${(initialCash + initialCard).toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Actual sales */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Sales Totals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex justify-between">
                        <span>Cash sales:</span>
                        <span>${actualCash.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Card sales:</span>
                        <span>${actualCard.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                        <span>Total sales:</span>
                        <span>${actualTotal.toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Close shift form */}
            <Card>
                <CardHeader>
                    <CardTitle>Close shift</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="counted-cash">Counted cash</Label>
                        <Input
                            id="counted-cash"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={countedCash}
                            onChange={(e) => setCountedCash(e.target.value)}
                            disabled={isBusy}
                        />
                        {cashDiff !== 0 && (
                            <p
                                className={
                                    cashDiff > 0
                                        ? 'text-muted-foreground'
                                        : 'text-destructive'
                                }
                                style={{ marginBottom: '1rem' }}
                            >
                                ${cashDiff.toFixed(2)}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="counted-card">Counted card</Label>
                        <Input
                            id="counted-card"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={countedCard}
                            onChange={(e) => setCountedCard(e.target.value)}
                            disabled={isBusy}
                        />
                        {cardDiff !== 0 && (
                            <p
                                className={
                                    cardDiff > 0
                                        ? 'text-muted-foreground'
                                        : 'text-destructive'
                                }
                                style={{ marginBottom: '1rem' }}
                            >
                                ${cardDiff.toFixed(2)}
                            </p>
                        )}
                    </div>

                    {hasDiff && (
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                rows={3}
                                placeholder="Notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                disabled={isBusy}
                            />
                        </div>
                    )}

                    <Button
                        onClick={handleClose}
                        disabled={isBusy}
                        className="w-full"
                    >
                        {isBusy ? 'Closing shift...' : 'Close shift'}
                    </Button>
                </CardContent>
            </Card>
        </ScrollArea>
    )
}
