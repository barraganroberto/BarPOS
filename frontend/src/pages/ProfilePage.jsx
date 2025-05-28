import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Separator } from '../components/ui/separator'
import {
    useUserProfile,
    useUpdateProfile,
    useUpdatePassword,
} from '../hooks/useUsers'
import { toast } from 'sonner'

export default function ProfilePage() {
    // 1) Load existing profile
    const { data: profile, isLoading: loadingProfile } = useUserProfile()

    // 2) Local form state
    const [email, setEmail] = useState('')
    const [birthdate, setBirthdate] = useState('')
    const [whatsappNumber, setWhatsappNumber] = useState('')
    const [profilePicURL, setProfilePicURL] = useState('')

    // Password form state
    const [newPassword, setNewPassword] = useState('')

    // 3) Mutations
    const updateProfile = useUpdateProfile()
    const updatePassword = useUpdatePassword()

    // 4) When profile loads, seed the form
    useEffect(() => {
        if (profile) {
            setEmail(profile.email || '')
            setBirthdate(profile.birthdate?.slice(0, 10) || '')
            setWhatsappNumber(profile.whatsappNumber || '')
            setProfilePicURL(profile.profilePicURL || '')
        }
    }, [profile])

    if (loadingProfile) {
        return <p className="p-4 text-center">Loading...</p>
    }

    // 5a) Handle profile submit
    const onSubmitProfile = (e) => {
        e.preventDefault()
        updateProfile.mutate(
            { email, birthdate, whatsappNumber, profilePicURL },
            {
                onSuccess: () => {
                    toast.success('Profile updated')
                },
                onError: (err) => {
                    toast.error(err?.message || 'Error updating profile')
                },
            }
        )
    }

    // 5b) Handle password submit
    const onSubmitPassword = (e) => {
        e.preventDefault()
        if (!newPassword) {
            toast.error('Please enter a new password')
            return
        }
        updatePassword.mutate(
            { newPassword },
            {
                onSuccess: () => {
                    toast.success('Password updated')
                    setNewPassword('')
                },
                onError: (err) => {
                    toast.error(err?.message || 'Error updating password')
                },
            }
        )
    }

    return (
        <div className="mx-auto max-w-md space-y-6 p-4">
            {/* Profile Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmitProfile} className="space-y-4">
                        <div className="space-y-1">
                            <Label>User</Label>
                            <p className="text-muted-foreground text-sm">
                                {profile.username}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={updateProfile.isLoading}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="birthdate">Birthdate</Label>
                            <Input
                                id="birthdate"
                                type="date"
                                value={birthdate}
                                onChange={(e) => setBirthdate(e.target.value)}
                                disabled={updateProfile.isLoading}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="whatsappNumber">WhatsApp</Label>
                            <Input
                                id="whatsappNumber"
                                type="tel"
                                value={whatsappNumber}
                                onChange={(e) =>
                                    setWhatsappNumber(e.target.value)
                                }
                                disabled={updateProfile.isLoading}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="profilePicURL">
                                Profile Pic URL
                            </Label>
                            <Input
                                id="profilePicURL"
                                type="text"
                                value={profilePicURL}
                                onChange={(e) =>
                                    setProfilePicURL(e.target.value)
                                }
                                disabled={updateProfile.isLoading}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={updateProfile.isLoading}
                        >
                            {updateProfile.isLoading ? 'Saving...' : 'Save'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Separator />

            {/* Change password */}
            <Card>
                <CardHeader>
                    <CardTitle>Change password</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmitPassword} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="newPassword">New password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={updatePassword.isLoading}
                                minLength={6}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={updatePassword.isLoading}
                        >
                            {updatePassword.isLoading ? 'Saving...' : 'Save'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
