import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from './ui/card'
import { Label } from './ui/label'
import { Separator } from './ui/separator'

export default function LastShiftSummary({ shift }) {
    const {
        user,
        startTime,
        endTime,
        cashCounted = 0,
        cardCounted = 0,
        discrepancyNotes,
    } = shift

    const totalCounted = cashCounted + cardCounted

    return (
        <Card>
            <CardHeader>
                <CardTitle>Last Shift</CardTitle>
                <CardDescription><span className='underline underline-offset-4'>Bartender:</span> {user.firstName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-muted-foreground flex justify-between space-y-1 text-sm">
                    <div>
                        <Label>Started:</Label>{' '}
                        {new Date(startTime).toLocaleString('en-US')}
                    </div>
                    <div>
                        <Label>Ended:</Label>{' '}
                        {endTime
                            ? new Date(endTime).toLocaleString('en-US')
                            : '-'}
                    </div>
                </div>

                <Separator />

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>Cash:</span>
                        <span>${cashCounted.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Card:</span>
                        <span>${cardCounted.toFixed(2)}</span>
                    </div>
                </div>

                <Separator />

                <div className="space-y-2">
                    <div className="flex justify-between font-semibold">
                        <span>Shift's total:</span>
                        <span>${totalCounted.toFixed(2)}</span>
                    </div>
                </div>

                {discrepancyNotes && (
                    <>
                        <Separator />
                        <div className="space-y-1">
                            <Label>Notes:</Label>
                            <p className="text-sm">{discrepancyNotes}</p>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
