import { useState } from 'react'
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from '../hooks/useUsers'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group'
import { Button } from '../components/ui/button'
import { toast } from 'sonner'
import {
    Dialog,
    DialogClose,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../components/ui/dialog'
import { DialogContent } from '@radix-ui/react-dialog'
import { AlertDialog } from '@radix-ui/react-alert-dialog'
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog'
import { Trash2 } from 'lucide-react'

export default function UsersPage() {
    const { data: users = [], isLoading, isError, error } = useUsers()
    const createUser = useCreateUser()
    const updateUserRole = useUpdateUser()
    const deleteUser = useDeleteUser()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [role, setRole] = useState('bartender')

    // Track which user is being edited
    const [editingUserId, setEditingUserId] = useState(null)
    const [selectedRole, setSelectedRole] = useState('bartender')

    // Create new user handler
    const onCreate = (e) => {
        e.preventDefault()
        createUser.mutate(
            { firstName, lastName, role },
            {
                onSuccess: () => {
                    setFirstName('')
                    setLastName('')
                    setRole('bartender')
                },
            }
        )
    }

    // Delete user
    const handleDelete = async () => {
        await deleteUser.mutateAsync(editingUserId)
        setEditingUserId(null)
    }

    if (isLoading) return <p className="p-4 text-center">Loading...</p>
    if (isError)
        return <p className="text-destructive p-4">Error: {error?.message}</p>

    return (
        <div className="space-y-8 p-4">
            {/* List existing users */}
            <section className="space-y-2">
                <h1 className="text-xl font-bold">Active Users</h1>
                <div className="grid gap-4 md:grid-cols-2">
                    {users.map((u) => (
                        <Dialog
                            key={u._id}
                            open={editingUserId === u._id}
                            onOpenChange={(open) =>
                                !open && setEditingUserId(null)
                            }
                        >
                            {/* Card triggers the dialog */}
                            <DialogTrigger asChild>
                                <Card
                                    className="hover:bg-muted/10 cursor-pointer"
                                    onClick={() => {
                                        setEditingUserId(u._id)
                                        setSelectedRole(u.role)
                                    }}
                                >
                                    <CardHeader>
                                        <CardTitle>
                                            {u.firstName} {u.lastName} (
                                            {u.username})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm">
                                        <div>Role: {u.role}</div>
                                        {u.email && <div>Email: {u.email}</div>}
                                    </CardContent>
                                </Card>
                            </DialogTrigger>

                            {/* Edit-role dialog */}
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Change user role</DialogTitle>
                                    <DialogDescription>
                                        Change the role for{' '}
                                        <strong>
                                            {u.firstName} {u.lastName}
                                        </strong>
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="py-4">
                                    <Label className="mb-2">Select role:</Label>
                                    <RadioGroup
                                        value={selectedRole}
                                        onValueChange={setSelectedRole}
                                        className="flex space-x-4"
                                    >
                                        <div className="flex items-center space-x-1">
                                            <RadioGroupItem
                                                id={`role-${u._id}-bartender`}
                                                value="bartender"
                                            />
                                            <Label
                                                className="text-sm"
                                                htmlFor={`role-${u._id}-bartender`}
                                            >
                                                Bartender
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <RadioGroupItem
                                                id={`role-${u._id}-admin`}
                                                value="admin"
                                            />
                                            <Label
                                                className="text-sm"
                                                htmlFor={`role-${u._id}-admin`}
                                            >
                                                Admin
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setEditingUserId(null)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                    </DialogClose>

                                    <Button
                                        onClick={() =>
                                            updateUserRole.mutate(
                                                {
                                                    id: u._id,
                                                    role: selectedRole,
                                                },
                                                {
                                                    onSuccess: () => {
                                                        toast.success(
                                                            'User role updated'
                                                        )
                                                        setEditingUserId(null)
                                                    },
                                                    onError: (error) => {
                                                        toast.error(
                                                            'Error updating user role: ' +
                                                                error.message
                                                        )
                                                    },
                                                }
                                            )
                                        }
                                    >
                                        {updateUserRole.isLoading
                                            ? 'Updating...'
                                            : 'Update Role'}
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive">
                                                <Trash2 className='size-4' />
                                                Delete user
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>¿Delete this user?</AlertDialogTitle>
                                                <AlertDialogDescription>This action can't be undone!</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter className="flex justify-end space-x-2">
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>

                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
            </section>

            {/* Create new user form */}
            <section>
                <h2 className="mb-4 text-lg font-semibold">Create User</h2>
                <form
                    // Create new user handler
                    onSubmit={onCreate}
                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                >
                    <div className="space-y-1">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <div className="mt-4 space-y-4 md:col-span-2">
                        <Label className="text-lg font-semibold">Role</Label>
                        <RadioGroup
                            value={role}
                            onValueChange={setRole}
                            className="flex space-x-4"
                        >
                            <Label htmlFor="role-bartender">Bartender</Label>
                            <RadioGroupItem
                                value="bartender"
                                id="role-bartender"
                            />

                            <RadioGroupItem value="admin" id="role-admin" />
                            <Label htmlFor="role-admin">Admin</Label>
                        </RadioGroup>
                    </div>
                    <div className="md:col-span-2">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={createUser.isLoading}
                        >
                            {createUser.isLoading
                                ? 'Creating...'
                                : 'Create User'}
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    )
}
