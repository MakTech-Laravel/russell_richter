import { Head, useForm } from '@inertiajs/react';
import { Camera, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    dashboardInputClass,
    dashboardLabelClass,
} from '@/components/dashboard/dashboard-ui';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useInitials } from '@/hooks/use-initials';
import UserLayout from '@/layouts/user-layout';
import { type User } from '@/types';

interface Props {
    user: User;
}

export default function EditProfile({ user }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        avatar: null as File | null,
        password: '',
        password_confirmation: '',
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const getInitials = useInitials();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('user-profile.update'), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Profile updated successfully!');
                setData('password', '');
                setData('password_confirmation', '');
            },
            onError: () => {
                toast.error('Failed to update profile. Please try again.');
            },
        });
    };

    return (
        <UserLayout title="Edit Profile" subtitle="Update your profile information">
            <Head title="Edit Profile" />

            <div className="mx-auto max-w-2xl">
                <DashboardCard>
                    <DashboardCardHeader title="Profile Settings" />
                    <DashboardCardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative">
                                    <Avatar className="h-24 w-24 border border-white/10">
                                        <AvatarImage
                                            src={previewUrl || user.avatar_url || user.avatar}
                                            alt={user.name}
                                        />
                                        <AvatarFallback className="bg-gold-500/20 text-2xl text-gold-400">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <label
                                        htmlFor="avatar"
                                        className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gold-500 text-ink-900 transition-colors hover:bg-gold-400"
                                    >
                                        <Camera className="h-4 w-4" />
                                    </label>
                                    <Input
                                        id="avatar"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-white">Profile Picture</p>
                                    <p className="text-xs text-slate-500">Click the camera icon to upload</p>
                                </div>
                                <InputError message={errors.avatar} />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="name" className={dashboardLabelClass()}>Name</label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={dashboardInputClass()}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className={dashboardLabelClass()}>Email</label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={dashboardInputClass()}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-4 border-t border-white/5 pt-6">
                                <h3 className="text-lg font-medium text-white">Change Password</h3>
                                <p className="text-sm text-slate-400">Leave blank if you don&apos;t want to change your password</p>

                                <div className="space-y-2">
                                    <label htmlFor="password" className={dashboardLabelClass()}>New Password</label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            autoComplete="new-password"
                                            className={`${dashboardInputClass()} pr-10`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="password_confirmation" className={dashboardLabelClass()}>Confirm New Password</label>
                                    <div className="relative">
                                        <Input
                                            id="password_confirmation"
                                            type={showPasswordConfirmation ? 'text' : 'password'}
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            autoComplete="new-password"
                                            className={`${dashboardInputClass()} pr-10`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                                        >
                                            {showPasswordConfirmation ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    <InputError message={errors.password_confirmation} />
                                </div>
                            </div>

                            <button type="submit" disabled={processing} className="ml-btn-primary inline-flex">
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </DashboardCardContent>
                </DashboardCard>
            </div>
        </UserLayout>
    );
}
