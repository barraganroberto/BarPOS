import { useQuery } from '@tanstack/react-query'
import { getShiftSales } from '../api/shifts'

export function useShiftSales(shiftId) {
    return useQuery({
        queryKey: ['shifts', shiftId, 'sales'],
        queryFn: () => getShiftSales(shiftId),
        enabled: Boolean(shiftId),
    })
}
