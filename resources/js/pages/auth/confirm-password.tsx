import { Form } from '@inertiajs/react';

import { authInputClass, AuthField } from '@/components/auth/auth-field';
import { PasswordInput } from '@/components/ui/password-input';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <AuthLayout
            title={
                <>
                    Confirm <span className="text-gold-grad">password</span>
                </>
            }
            description="This is a secure area. Please confirm your password before continuing."
            headTitle="Confirm password"
        >
            <Form {...store.form()} resetOnSuccess={['password']} className="space-y-4">
                {({ processing, errors }) => (
                    <>
                        <AuthField id="password" label="Password" error={errors.password}>
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                autoFocus
                                autoComplete="current-password"
                                placeholder="••••••••"
                                className={authInputClass()}
                            />
                        </AuthField>

                        <button
                            type="submit"
                            disabled={processing}
                            data-test="confirm-password-button"
                            className="ml-btn-primary flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm uppercase tracking-wider disabled:opacity-50"
                        >
                            {processing ? <Spinner className="h-4 w-4" /> : 'Confirm password'}
                        </button>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
