import { Form } from '@inertiajs/react';

import { authInputClass, AuthField } from '@/components/auth/auth-field';
import TextLink from '@/components/text-link';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <AuthLayout
            title={
                <>
                    Forgot <span className="text-gold-grad">password</span>
                </>
            }
            description="We'll send you a link to reset your password."
            headTitle="Forgot password"
            backHref={login.url()}
        >
            {status && (
                <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300">
                    {status}
                </div>
            )}

            <Form {...email.form()} className="space-y-4">
                {({ processing, errors }) => (
                    <>
                        <AuthField id="email" label="Email address" error={errors.email}>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoFocus
                                autoComplete="email"
                                placeholder="you@example.com"
                                className={authInputClass()}
                            />
                        </AuthField>

                        <button
                            type="submit"
                            disabled={processing}
                            className="ml-btn-primary flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm uppercase tracking-wider disabled:opacity-50"
                        >
                            {processing ? <Spinner className="h-4 w-4" /> : 'Send reset link'}
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
