import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchOpenShift, startShift, closeShift } from '../api/shifts'

export function useOpenShift() {
    return useQuery({
        queryKey: ['shifts', 'open'],
        queryFn: fetchOpenShift,
        retry: false,
        keepPreviousData: false,
    })
}

export function useStartShift() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: startShift,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shifts', 'open'] })
        },
    })
}

export function useCloseShift() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, cashCounted, cardCounted, discrepancyNotes }) =>
            closeShift({ id, cashCounted, cardCounted, discrepancyNotes }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shifts', 'open'] })
            queryClient.invalidateQueries({ queryKey: ['shifts'] })
        },
    })
}
