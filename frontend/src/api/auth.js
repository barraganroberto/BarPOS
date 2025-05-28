import client from './client'

export async function login({ username, password }) {
    const res = await client
        .post('/auth', { username, password })
    return res.data
}

export async function fetchProfile() {
    const res = await client
        .get('/users/profile')
    return res.data
}
