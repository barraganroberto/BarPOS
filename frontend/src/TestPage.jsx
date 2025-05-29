import { Button } from './components/ui/button'

export default function TestPage() {
    return (
        <div className="mx-auto mt-4 flex max-w-md flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
                <Button variant="secondary" className="flex-1">
                    Cancel
                </Button>
                <Button variant="outline" className="flex-1">
                    Save
                </Button>
            </div>
            <Button variant="destructive">Delete</Button>
        </div>
    )
}

{
    /* <DialogFooter className="flex items-center justify-between space-x-2">
    <div className="flex space-x-2">
        <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
        </DialogClose>
        <Button
            onClick={handleSave}
            disabled={!canSave || updateProduct.isLoading}
        >
            {updateProduct.isLoading ? 'Guardando…' : 'Guardar'}
        </Button>
    </div>

    <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button variant="destructive" size="lg" className="inline-block">
                Eliminar
            </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="z-60">
            <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar este producto?</AlertDialogTitle>
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
</DialogFooter> */
}
