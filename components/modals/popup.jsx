"use client";

import { useEffect } from "react";

export default function Popup({
    open = false,
    onClose = () => { },
    title = null,
    children,
    className = "",
    closeOnOverlay = true,
    closeOnEsc = true,
    maxWidth = "max-w-lg",
}) {
    useEffect(() => {
        if (!open || !closeOnEsc) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, closeOnEsc, onClose]);

    if (!open) return null;

    return (
        <div
            className="w-full h-screen fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={closeOnOverlay ? onClose : undefined}
            aria-hidden={!open}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? "popup-title" : undefined}
                className={`relative w-full ${maxWidth} rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/10 ${className}`}
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    aria-label="Close popup"
                    onClick={onClose}
                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                >
                    ×
                </button>

                {title && (
                    <h2
                        id="popup-title"
                        className="pr-10 text-xl font-semibold text-slate-900"
                    >
                        {title}
                    </h2>
                )}

                <div className="mt-4 text-slate-700">{children}</div>
            </div>
        </div>
    );
}