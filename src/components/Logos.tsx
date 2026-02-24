import React from "react";

export const LogoOrbit = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 30" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <circle cx="15" cy="15" r="10" stroke="currentColor" strokeWidth="2" />
        <circle cx="15" cy="15" r="4" fill="currentColor" />
        <path d="M35 15h50M35 15l10-10M35 15l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="35" y="20" fill="currentColor" fontFamily="sans-serif" fontWeight="bold" fontSize="14" letterSpacing="0.1em">ORBIT</text>
    </svg>
);

export const LogoNexus = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 30" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="2" />
        <path d="M15 15l10 0M40 15h50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <text x="35" y="20" fill="currentColor" fontFamily="sans-serif" fontWeight="bold" fontSize="14" letterSpacing="0.1em">NEXUS</text>
    </svg>
);

export const LogoVertex = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 30" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M15 5l10 20H5L15 5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <text x="35" y="20" fill="currentColor" fontFamily="sans-serif" fontWeight="bold" fontSize="14" letterSpacing="0.1em">VERTEX</text>
    </svg>
);

export const LogoFlux = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 30" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M5 15c5-10 15-10 20 0s15 10 20 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <text x="35" y="20" fill="currentColor" fontFamily="sans-serif" fontWeight="bold" fontSize="14" letterSpacing="0.1em">FLUX</text>
    </svg>
);

export const LogoCore = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 30" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="20" height="20" stroke="currentColor" strokeWidth="2" />
        <rect x="10" y="10" width="10" height="10" fill="currentColor" />
        <text x="35" y="20" fill="currentColor" fontFamily="sans-serif" fontWeight="bold" fontSize="14" letterSpacing="0.1em">CORE</text>
    </svg>
);

export const LogoSpark = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 30" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M15 5v20M5 15h20M8 8l14 14M8 22L22 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <text x="35" y="20" fill="currentColor" fontFamily="sans-serif" fontWeight="bold" fontSize="14" letterSpacing="0.1em">SPARK</text>
    </svg>
);

export const LogoQuantum = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 120 30" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="15" cy="15" rx="10" ry="4" stroke="currentColor" strokeWidth="2" transform="rotate(45 15 15)" />
        <ellipse cx="15" cy="15" rx="10" ry="4" stroke="currentColor" strokeWidth="2" transform="rotate(-45 15 15)" />
        <text x="35" y="20" fill="currentColor" fontFamily="sans-serif" fontWeight="bold" fontSize="14" letterSpacing="0.1em">QUANTUM</text>
    </svg>
);

export const LogoEcho = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 30" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M5 15a10 10 0 0120 0M10 15a5 5 0 0110 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <text x="35" y="20" fill="currentColor" fontFamily="sans-serif" fontWeight="bold" fontSize="14" letterSpacing="0.1em">ECHO</text>
    </svg>
);
