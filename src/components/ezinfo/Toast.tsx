"use client";

import { useEffect } from "react";

export default function Toast({ message, onDone }: { message: string; onDone: () => void }) {
    useEffect(() => {
        const t = setTimeout(onDone, 2000);
        return () => clearTimeout(t);
    }, [onDone]);
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-spotlight">
            <div className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-md">{message}</div>
        </div>
    );
}
