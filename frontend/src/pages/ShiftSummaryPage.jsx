import { StartShift } from '../components/StartShift'
import ActiveShift from '../components/ActiveShift'
import { useOpenShift } from '../hooks/useOpenShift'
import { useShifts } from '../hooks/useShifts'
import LastShiftSummary from '../components/LastShiftSummary'

export default function ShiftSummaryPage() {
    const { data: openData, isLoading: loadingOpen } = useOpenShift()
    const { data: allShifts = [], isLoading: loadingShifts } = useShifts()

    if (loadingOpen || (openData === null && loadingShifts)) {
        return (
            <div className="flex flex-1 items-center justify-center p-4">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        )
    }

    // If there's an active shift
    if (openData !== null) {
        return <ActiveShift shift={openData.shift} totals={openData.totals} />
    }

    // No open shift, find the last closed one
    const closedShifts = allShifts
        .filter((shift) => shift.closed)
        .sort(
            (a, b) =>
                new Date(b.endTime ?? 0).getTime() -
                new Date(a.endTime ?? 0).getTime()
        )

    const lastClosed = closedShifts[0] || null

    // Active shift data available
    return (
        <div className="space-y-6 p-4">
            {lastClosed && <LastShiftSummary shift={lastClosed} />}

            <StartShift />
        </div>
    )
}
