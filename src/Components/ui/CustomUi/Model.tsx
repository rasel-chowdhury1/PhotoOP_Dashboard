"use client";

import { IoClose } from "react-icons/io5";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl" | "full";
    footer?: React.ReactNode;
    hideCloseButton?: boolean;
}

const sizeClasses: Record<NonNullable<ModalProps["size"]>, string> = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[95vw]",
};

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
    footer,
    hideCloseButton = false,
}: ModalProps) => {
    // Lock body scroll while open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const modalContent = (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
        >
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity"
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={`relative w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-xl animate-in fade-in zoom-in-95 duration-150`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {(title || !hideCloseButton) && (
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 shrink-0">
                        {title ? (
                            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
                        ) : (
                            <span />
                        )}
                        {!hideCloseButton && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                                aria-label="Close modal"
                            >
                                <IoClose className="text-xl" />
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className="overflow-y-auto px-5 py-4 grow">{children}</div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-3 shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );

    // Portal to body so it isn't clipped by parent overflow/z-index
    if (typeof window === "undefined") return null;
    return createPortal(modalContent, document.body);
};

export default Modal;