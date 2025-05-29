import { useState } from 'react'
import {
    useProducts,
    useCreateProduct,
    useUpdateProduct,
} from '@/hooks/useProducts'
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/ui/table'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../components/ui/alert-dialog'
import { useDeleteProduct } from '../hooks/useProducts'
import { Save, Trash2 } from 'lucide-react'

const CATEGORY_OPTIONS = [
    'shots',
    'soft drink',
    'beer',
    'wine',
    'cocktail',
    'happyHour',
]

export default function ProductsPage() {
    const { data: products = [], isLoading, isError, error } = useProducts()
    const createProduct = useCreateProduct()
    const updateProduct = useUpdateProduct()

    if (isLoading) return <p className="p-4 text-center">Cargando productos…</p>
    if (isError)
        return <p className="text-destructive p-4">Error: {error.message}</p>

    return (
        <div className="space-y-6 p-4">
            <h1 className="text-2xl font-bold">Productos</h1>

            {/* New Product Form */}
            <section className="bg-card border-border space-y-4 rounded-lg border p-4">
                <h2 className="text-lg font-semibold">Crear nuevo producto</h2>
                <NewProductForm
                    onSubmit={(data) =>
                        createProduct.mutate(data, {
                            onSuccess: () => {
                                createProduct.reset()
                            },
                        })
                    }
                    isLoading={createProduct.isLoading}
                />
            </section>

            {/* Products Table */}
            <section>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Imagen</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead className="text-right">
                                Precio (€)
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((p) => (
                            <ProductRow
                                key={p._id}
                                product={p}
                                onSave={(updates) =>
                                    updateProduct.mutate(
                                        { id: p._id, ...updates },
                                        {
                                            onSuccess: () =>
                                                updateProduct.reset(),
                                        }
                                    )
                                }
                                isSaving={updateProduct.isLoading}
                            />
                        ))}
                    </TableBody>
                </Table>
            </section>
        </div>
    )
}

// ——— NewProductForm ———
function NewProductForm({ onSubmit, isLoading }) {
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [price, setPrice] = useState('')
    const [imageUrl, setImageUrl] = useState('')

    const canSubmit = name && category && price && imageUrl

    const handle = (e) => {
        e.preventDefault()
        onSubmit({
            name,
            category,
            price: parseFloat(price),
            imageUrl,
        })
        setName('')
        setCategory('')
        setPrice('')
        setImageUrl('')
    }

    return (
        <form
            onSubmit={handle}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
            <div className="space-y-2">
                <Label htmlFor="new-name">Name</Label>
                <Input
                    id="new-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="new-category">Category</Label>
                {/* <Input id="new-category" value={category} onChange={(e) => setCategory(e.target.value)} required /> */}
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="new-category" className="w-full">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        {CATEGORY_OPTIONS.map((option) => (
                            <SelectItem
                                key={option}
                                value={option}
                                className="capitalize"
                            >
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="new-price">Price (€)</Label>
                <Input
                    id="new-price"
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="new-image">Image URL</Label>
                <Input
                    id="new-image"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
            </div>
            <div className="mt-2 md:col-span-2">
                <Button
                    type="submit"
                    className="w-full"
                    disabled={!canSubmit || isLoading}
                >
                    {isLoading ? 'Creando...' : 'Crear producto'}
                </Button>
            </div>
        </form>
    )
}

// ——— ProductRow with edit dialog ———
function ProductRow({ product }) {
    const updateProduct = useUpdateProduct()
    const deleteProduct = useDeleteProduct()
    const [open, setOpen] = useState(false)

    // local edit state
    const [name, setName] = useState(product.name)
    const [category, setCategory] = useState(product.category)
    const [price, setPrice] = useState(product.price)
    const [imageUrl, setImageUrl] = useState(product.imageUrl)

    const canSave = name && category && price && imageUrl

    const handleSave = () => {
        if (!canSave) return
        updateProduct.mutate(
            {
                id: product._id,
                name,
                category,
                price: parseFloat(price),
                imageUrl,
            },
            { onSuccess: () => setOpen(false) }
        )
    }

    const handleDelete = async () => {
        await deleteProduct.mutateAsync(product._id)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <TableRow className="hover:bg-muted/10 cursor-pointer">
                    <TableCell>
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={name}
                                className="h-8 w-8 rounded object-cover"
                            />
                        ) : (
                            <div className="bg-muted h-8 w-8 rounded" />
                        )}
                    </TableCell>
                    <TableCell>{name}</TableCell>
                    <TableCell className="capitalize">{category}</TableCell>
                    <TableCell className="text-right">€{price}</TableCell>
                </TableRow>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Editar producto</DialogTitle>
                    <DialogDescription>
                        Actualiza los datos y guarda.
                    </DialogDescription>
                </DialogHeader>

                {/* Image preview */}
                <div className="bg-muted mb-4 h-48 w-full overflow-hidden rounded">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="bg-muted h-full w-full" />
                    )}
                </div>

                {/* Edit form */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Nombre</Label>
                        <Input
                            id="edit-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-category">Categoría</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger
                                id="edit-category"
                                className="w-full capitalize"
                            >
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORY_OPTIONS.map((option) => (
                                    <SelectItem
                                        key={option}
                                        value={option}
                                        className="capitalize"
                                    >
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-price">Precio (€)</Label>
                        <Input
                            id="edit-price"
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-image">URL imagen</Label>
                        <Input
                            id="edit-image"
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
                    </div>
                </div>

                <Separator className="my-4" />

                {/* Actions */}
                <div className="flex w-full flex-col gap-4">
                    {/* Row 1: Cancel / Save */}
                    <div className="flex items-center justify-between gap-4">
                        <DialogClose asChild>
                            <Button variant="secondary" className="flex-1">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={handleSave}
                            disabled={!canSave || updateProduct.isLoading}
                        >
                            <Save className="h-4 w-4" />
                            Save
                        </Button>
                    </div>

                    {/* Row 2: Delete */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="lg">
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="z-60">
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    ¿Eliminar este producto?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción no se puede deshacer.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex justify-end space-x-2">
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-destructive hover:bg-destructive/90"
                                >
                                    Eliminar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </DialogContent>
        </Dialog>
    )
}
