import client from './client'

// POST /api/users (admin only)
export async function createUser(payload) {
    const res = await client.post('/users', payload)
    return res.data
}

// GET /api/users (admin only)
export async function getAllUsers() {
    const res = await client.get('/users')
    return res.data
}

// GET /api/users/:id (admin only)
export async function getUser(id) {
    const res = await client.get(`/users/${id}`)
    return res.data
}

// PUT /api/users/:id (admin only)
export async function updateUser({ id, role }) {
    const res = await client.put(`/users/${id}`, { role })
    return res.data
}

// DELETE /api/users/:id (admin only)
export async function deleteUser(id) {
    const res = await client.delete(`/users/${id}`)
    return res.data
}

// GET /api/users/profile (private)
export async function getUserProfile() {
    const res = await client.get('/users/profile')
    return res.data
}

// PATCH /api/users/profile (private)
export async function updateProfile(payload) {
    const res = await client.patch('/users/profile', payload)
    return res.data
}

// PATCH /api/users/password (private)
export async function updatePassword({ newPassword }) {
    const res = await client.patch('/users/password', { newPassword })
    return res.data
}
