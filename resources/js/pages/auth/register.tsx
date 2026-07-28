import { Form } from '@inertiajs/react';

import { authInputClass, AuthField } from '@/components/auth/auth-field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/register';

export default function Register() {
    return (
        <AuthLayout
            title={
                <>
                    Create your <span className="text-gold-grad">account</span>
                </>
            }
            description="Join drivers across Victoria County saving time with mobile service."
            context="register"
            headTitle="Register"
        >
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="space-y-4"
            >
                {({ processing, errors }) => (
                    <>
                        <AuthField id="name" label="Full name" error={errors.name}>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                required
                                autoFocus
                                autoComplete="name"
                                placeholder="Jane Doe"
                                className={authInputClass()}
                            />
                        </AuthField>

                        <AuthField id="email" label="Email" error={errors.email}>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="you@example.com"
                                className={authInputClass()}
                            />
                        </AuthField>

                        <AuthField id="phone" label="Phone number" error={errors.phone}>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                autoComplete="tel"
                                placeholder="(361) 555-0100"
                                className={authInputClass()}
                            />
                        </AuthField>

                        <AuthField id="address_line" label="Address" error={errors.address_line}>
                            <Input
                                id="address_line"
                                name="address_line"
                                type="text"
                                required
                                autoComplete="street-address"
                                placeholder="123 Main St"
                                className={authInputClass()}
                            />
                        </AuthField>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <AuthField id="city" label="City" error={errors.city}>
                                <Input
                                    id="city"
                                    name="city"
                                    type="text"
                                    required
                                    autoComplete="address-level2"
                                    placeholder="Victoria"
                                    className={authInputClass()}
                                />
                            </AuthField>

                            <AuthField id="state" label="State" error={errors.state}>
                                <Input
                                    id="state"
                                    name="state"
                                    type="text"
                                    required
                                    autoComplete="address-level1"
                                    placeholder="TX"
                                    maxLength={2}
                                    className={authInputClass()}
                                />
                            </AuthField>

                            <AuthField id="zip" label="ZIP" error={errors.zip}>
                                <Input
                                    id="zip"
                                    name="zip"
                                    type="text"
                                    required
                                    autoComplete="postal-code"
                                    placeholder="77901"
                                    maxLength={10}
                                    className={authInputClass()}
                                />
                            </AuthField>
                        </div>

                        <AuthField id="password" label="Password" error={errors.password}>
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                placeholder="Create a password"
                                className={authInputClass()}
                            />
                        </AuthField>

                        <AuthField id="password_confirmation" label="Confirm password">
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                required
                                placeholder="Re-enter password"
                                className={authInputClass()}
                            />
                        </AuthField>

                        <button
                            type="submit"
                            disabled={processing}
                            className="ml-btn-primary flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm uppercase tracking-wider disabled:opacity-50"
                        >
                            {processing ? <Spinner className="h-4 w-4" /> : 'Create account'}
                        </button>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
