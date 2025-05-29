import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createProduct, deleteProduct, fetchProducts, updateProduct } from '../api/products'

// useProducts hook
// get all products
export function useProducts() {
    return useQuery({ queryKey: ['products'], queryFn: fetchProducts })
}

// useCreateProduct() hook
// create new product
export function useCreateProduct() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createProduct,
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['products'] }),
    })
}

// useUpdateProduct() hook
// update product
export function useUpdateProduct() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: updateProduct,
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['products'] }),
    })
}

// useDeleteProduct() hook
// delete product
export function useDeleteProduct() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteProduct,
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['products'] }),
    })
}