import client from './client'

// export async function fetchOpenShift() {
//     const res = await client.get('/shifts/current')
//     return res.data
// }

export async function fetchOpenShift() {
    try {
        const { data } = await client.get('/shifts/current')
        return data
    } catch (error) {
        if (error.response.status === 404) return null
        throw error
    }
}

export async function startShift({ cashInitial, cardInitial }) {
    const res = await client.post('/shifts', { cashInitial, cardInitial })
    return res.data
}

export async function closeShift({
    id,
    cashCounted,
    cardCounted,
    discrepancyNotes,
}) {
    const res = await client.post(`/shifts/${id}`, {
        cashCounted,
        cardCounted,
        discrepancyNotes,
    })
    return res.data
}

export async function getShifts() {
    const res = await client.get('/shifts')
    return res.data
}

export async function getShiftSales(id) {
    const res = await client.get(`/shifts/${id}/sales`)
    return res.data
}

export async function createSale({ shiftId, items, method }) {
    const { data } = await client.post(`/shifts/${shiftId}/sales`, {
        items,
        method,
    })
    return data
}
