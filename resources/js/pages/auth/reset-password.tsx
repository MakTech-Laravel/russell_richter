import { Form } from '@inertiajs/react';

import { authInputClass, AuthField } from '@/components/auth/auth-field';
import TextLink from '@/components/text-link';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { update } from '@/routes/password';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    return (
        <AuthLayout
            title={
                <>
                    Reset <span className="text-gold-grad">password</span>
                </>
            }
            description="Choose a new password for your account."
            headTitle="Reset password"
            backHref={login.url()}
        >
            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
                className="space-y-4"
            >
                {({ processing, errors }) => (
                    <>
                        <AuthField id="email" label="Email" error={errors.email}>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                readOnly
                                className={authInputClass('cursor-not-allowed opacity-70')}
                            />
                        </AuthField>

                        <AuthField id="password" label="New password" error={errors.password}>
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                autoFocus
                                autoComplete="new-password"
                                placeholder="Create a new password"
                                className={authInputClass()}
                            />
                        </AuthField>

                        <AuthField id="password_confirmation" label="Confirm password" error={errors.password_confirmation}>
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                required
                                autoComplete="new-password"
                                placeholder="Re-enter password"
                                className={authInputClass()}
                            />
                        </AuthField>

                        <button
                            type="submit"
                            disabled={processing}
                            data-test="reset-password-button"
                            className="ml-btn-primary flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm uppercase tracking-wider disabled:opacity-50"
                        >
                            {processing ? <Spinner className="h-4 w-4" /> : 'Reset password'}
                        </button>

                        <p className="text-center text-xs text-slate-500">
                            <TextLink href={login()} className="font-semibold text-gold-400">
                                ← Back to log in
                            </TextLink>
                        </p>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
