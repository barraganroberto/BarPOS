import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchSales } from '../api/sales'
import { useOpenShift } from './useOpenShift'
import { createSale } from '../api/shifts'

export function useSales() {
    return useQuery({
        queryKey: ['sales'],
        queryFn: fetchSales,
    })
}

export function useCreateSale() {
    const queryClient = useQueryClient()
    const { data: openData } = useOpenShift()

    return useMutation({
        mutationFn: ({ items, method }) =>
            createSale({
                shiftId: openData.shift._id,
                items,
                method,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['shifts', openData.shift._id, 'sales'],
            })
            queryClient.invalidateQueries({ queryKey: ['shifts', 'open'] })
        },
    })
}
