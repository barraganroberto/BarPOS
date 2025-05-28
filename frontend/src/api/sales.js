import client from './client'

export async function fetchSales() {
    const res = await client.get('/sales')
    return res.data
}

// export async function createSale(payload) {
//     const res = await client.post('/sales', payload)
//     return res.data
// }
