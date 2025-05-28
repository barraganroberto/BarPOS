import { useQuery } from '@tanstack/react-query'
import { getShifts } from '../api/shifts'

export function useShifts() {
    return useQuery({ queryKey: ['shifts'], queryFn: getShifts })
}
