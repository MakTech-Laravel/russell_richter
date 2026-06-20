import { useEffect, useState } from 'react';

export function useScrollSpy(sectionIds: readonly string[], headerSelector = '[data-frontend-header]'): string {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const resolveActiveSection = (): void => {
            const header = document.querySelector(headerSelector);
            const offset = (header?.getBoundingClientRect().height ?? 120) + 16;

            let current = '';

            for (const id of sectionIds) {
                const element = document.getElementById(id);

                if (element && window.scrollY + offset >= element.offsetTop) {
                    current = id;
                }
            }

            setActiveId(current);
        };

        resolveActiveSection();
        window.addEventListener('scroll', resolveActiveSection, { passive: true });
        window.addEventListener('resize', resolveActiveSection);

        return () => {
            window.removeEventListener('scroll', resolveActiveSection);
            window.removeEventListener('resize', resolveActiveSection);
        };
    }, [sectionIds, headerSelector]);

    return activeId;
}
