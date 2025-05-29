import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    createUser,
    deleteUser,
    getAllUsers,
    getUserProfile,
    updatePassword,
    updateProfile,
    updateUser,
} from '../api/users'

// useUsers hook
// get all users
export function useUsers() {
    return useQuery({ queryKey: ['users'], queryFn: getAllUsers })
}

// useCreateUser hook
// create new user
export function useCreateUser() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createUser,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    })
}

// useUpdateUser hook
// update user
export function useUpdateUser() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, role }) => updateUser({ id, role }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    })
}

// useUserProfile hook
// get user profile
export function useUserProfile() {
    return useQuery({ queryKey: ['user', 'profile'], queryFn: getUserProfile })
}

// useUpdateProfile hook
// update user profile
export function useUpdateProfile() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data) => updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', 'profile'] })
            queryClient.invalidateQueries({ queryKey: ['users'] }) // if admin list needs to be updated
        },
    })
}

// useUpdatePassword hook
// update user password
export function useUpdatePassword() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ newPassword }) => updatePassword({ newPassword }),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['user', 'profile'] }),
    })
}

// useDeleteUser hook
// delete user
export function useDeleteUser() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id) => deleteUser(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    })
}
