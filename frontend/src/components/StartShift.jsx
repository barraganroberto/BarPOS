import { useState } from 'react'
import { useOpenShift, useStartShift } from '../hooks/useOpenShift'
import { toast } from 'sonner'
import { Card, CardContent } from './ui/card'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'

export function StartShift() {
    const [cashInitial, setCashInitial] = useState(0)
    const [cardInitial, setCardInitial] = useState(0)
    const startShift = useStartShift()
    const openShift = useOpenShift()

    // If a shift just opened, don't render
    if (openShift.data !== null) return null

    const isBusy = startShift.isLoading

    const handleSubmit = () => {
        const cash = parseFloat(cashInitial)
        const card = parseFloat(cardInitial)
        startShift.mutate(
            { cashInitial: cash, cardInitial: card },
            {
                onSuccess: () => {
                    toast.success('Shift started')
                },
                onError: (err) => {
                    toast.error(err?.message || 'Error starting shift')
                },
            }
        )
    }

    return (
        <Card className="">
            <CardContent className="space-y-4">
                <h2 className="text-lg font-semibold">Start Shift</h2>

                <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="cashInitial">Initial Cash</Label>
                        <Input
                            id="cashInitial"
                            type="number"
                            placeholder="0.00"
                            value={cashInitial}
                            onChange={(e) =>
                                setCashInitial(parseFloat(e.target.value))
                            }
                            disabled={isBusy}
                            className="input input-bordered w-full max-w-xs"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="cardInitial">Initial Card</Label>
                        <Input
                            id="cardInitial"
                            type="number"
                            placeholder="0.00"
                            value={cardInitial}
                            onChange={(e) =>
                                setCardInitial(parseFloat(e.target.value))
                            }
                            disabled={isBusy}
                            className="input input-bordered w-full max-w-xs"
                        />
                    </div>
                </div>

                <Button
                    onClick={handleSubmit}
                    disabled={isBusy}
                    className="w-full"
                >
                    {isBusy ? 'Starting...' : 'Start Shift'}
                </Button>
            </CardContent>
        </Card>
    )
}
