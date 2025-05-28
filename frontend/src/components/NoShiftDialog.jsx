import { useEffect, useState } from 'react'
import { useOpenShift } from '../hooks/useOpenShift'
import { useNavigate } from 'react-router-dom'
import {
    Dialog,
    DialogHeader,
    DialogContent,
    DialogTitle,
    DialogFooter,
    DialogDescription,
    DialogOverlay,
} from './ui/dialog'
import { Button } from './ui/button'

export default function NoShiftDialog() {
    const { data, isLoading } = useOpenShift()
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoading && data === null) {
            setOpen(true)
        }
    }, [data, isLoading])

    if (isLoading) return null

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => setOpen(open)}
        >
            <DialogContent className="mx-auto my-20 max-w-md p-6">
                <DialogHeader>
                    <DialogTitle>There's no open shift</DialogTitle>
                    <DialogDescription>
                        You can start a new shift by clicking the button below.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        className="mt-4 w-full"
                        onClick={() => navigate('/shift')}
                    >
                        Go to shifts
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
