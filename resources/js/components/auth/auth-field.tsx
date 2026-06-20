import * as React from 'react';

import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface AuthFieldProps {
    id: string;
    label: string;
    error?: string;
    children: React.ReactNode;
    action?: React.ReactNode;
}

export function AuthField({ id, label, error, children, action }: AuthFieldProps) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    {label}
                </Label>
                {action}
            </div>
            {children}
            <InputError message={error} className="text-rose-300" />
        </div>
    );
}

export function authInputClass(className?: string): string {
    return cn('ml-auth-input h-11', className);
}
