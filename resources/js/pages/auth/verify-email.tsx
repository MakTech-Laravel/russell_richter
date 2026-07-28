import { Form, Link } from '@inertiajs/react';

import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout
            title={
                <>
                    Verify your <span className="text-gold-grad">email</span>
                </>
            }
            description="Almost there! Please check your inbox for a verification link."
            headTitle="Email verification"
        >
            {status === 'verification-link-sent' && (
                <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300">
                    A fresh link has been sent to your email address.
                </div>
            )}

            <Form {...send.form()} className="space-y-4">
                {({ processing }) => (
                    <>
                        <button
                            type="submit"
                            disabled={processing}
                            className="ml-btn-primary flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm uppercase tracking-wider disabled:opacity-50"
                        >
                            {processing ? <Spinner className="h-4 w-4" /> : 'Resend verification email'}
                        </button>

                        <p className="text-center text-xs text-slate-500">
                            <Link
                                href={logout()}
                                method="post"
                                as="button"
                                className="font-semibold text-gold-400 hover:text-gold-300"
                            >
                                Log out
                            </Link>
                        </p>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
