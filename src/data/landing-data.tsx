import React from "react";

/* ─── Features ─────────────────────────────────────────── */

export const FEATURES = [
    {
        icon: (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
            </svg>
        ),
        title: "NFC + QR Hybrid",
        description: (
            <span className="block max-w-[65%]">Tap or scan. Your customers get instant access to your branded interface with zero friction. Works with every modern smartphone, no app downloads required.</span>
        ),
        span: "col-span-1 md:col-span-2 lg:col-span-2",
        children: (
            <div className="absolute -top-12 -right-26 pointer-events-none opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                <svg className="h-72 w-72 text-accent/100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="0.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.652a3.75 3.75 0 010-5.304m5.304 0a3.75 3.75 0 010 5.304m-7.425 2.121a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
            </div>
        ),
    },
    {
        icon: (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
        ),
        title: "Primary Directive: Reviews",
        description:
            "Direct neural pathway to your Google Review page.",
        span: "col-span-1 md:col-span-1 lg:col-span-1",
        children: (
            <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-0 pointer-events-none opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="w-18 h-18 text-accent/15 fill-accent/100" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        ),
    },
    {
        icon: (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
        ),
        title: "Limitless Vectors",
        description:
            "Your card, your rules. Reviews, bookings, directions, menus, contact info, gift cards, and anything else you need. No limits on what you can link.",
        span: "col-span-1 md:col-span-1 lg:col-span-1",
    },
    {
        icon: (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
        ),
        title: "Feedback Modules",
        description: (
            <span className="block max-w-[65%]">Deploy custom surveys, gather private feedback, and monitor customer sentiment in real time. All managed through your command dashboard with instant analytics and exportable reports.</span>
        ),
        span: "col-span-1 md:col-span-2 lg:col-span-2",
        children: (
            <div className="absolute bottom-14 -right-22 pointer-events-none opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                <svg className="h-66 w-66 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="0.6">
                    {/* Survey answer boxes */}
                    <rect x="3" y="3" width="18" height="4" rx="1.5" />
                    <circle cx="5.5" cy="5" r="1.2" fill="currentColor" opacity="0.1" />
                    <circle cx="5.5" cy="5" r="0.8" fill="currentColor" opacity="0.3" />
                    <circle cx="5.5" cy="5" r="0.4" fill="currentColor" opacity="1" />
                    <rect x="3" y="10" width="18" height="4" rx="1.5" />
                    <circle cx="5.5" cy="12" r="1.2" fill="currentColor" opacity="0.1" />
                    <circle cx="5.5" cy="12" r="0.8" fill="currentColor" opacity="0.3" />
                    <circle cx="5.5" cy="12" r="0.4" fill="currentColor" opacity="1" />
                    <rect x="3" y="17" width="18" height="4" rx="1.5" />
                    <circle cx="5.5" cy="19" r="1.2" fill="currentColor" opacity="0.1" />
                    <circle cx="5.5" cy="19" r="0.8" fill="currentColor" opacity="0.3" />
                    <circle cx="5.5" cy="19" r="0.4" fill="currentColor" opacity="1" />
                </svg>
            </div>
        ),
    },
];

/* ─── How It Works Steps ─── */

export const STEPS = [
    {
        number: "01",
        title: "Initialize Order",
        description: "Input your business parameters via our secure portal. The automated setup protocol completes in under 120 seconds.",
    },
    {
        number: "02",
        title: "System Generation",
        description: "Our engine compiles your custom interface instantly. You attain full access to the Command Dashboard to configure vectors.",
    },
    {
        number: "03",
        title: "Hardware Deployment",
        description: "Deploy your pre-configured device at the point of sale. Customer interaction begins immediately, bridging the physical gap.",
    },
];

/* ─── Pricing ─── */

export const PRICING_FEATURES = [
    "1 NFC + QR Module (Hardware)",
    "Hosted EZinfo Interface",
    "Google Reviews Primary Directive",
    "Command Dashboard Access",
    "Unlimited Sub-Vector Configuration",
    "Maintenance & Updates Included",
    "Priority Signal Support",
    "Monthly Data Transmission",
];

/* ─── Perfect For ─── */

export const PERFECT_FOR = [
    "DENTAL CLINICS",
    "SALONS & SPAS",
    "HOSPITALITY",
    "FITNESS CENTRES",
    "LOCAL SERVICES",
    "AUTOMOTIVE",
    "MEDICAL",
    "RETAIL",
];

/* ─── FAQ ─── */

export const FAQ_ITEMS = [
    {
        question: "Is client-side software required?",
        answer:
            "Negative. The system operates on standard protocols. Users simply interact with the device to load your interface instantly. No installation required.",
    },
    {
        question: "Is the Google Reviews directive mandatory?",
        answer:
            "Affirmative for optimal performance. It serves as the primary engagement vector. Secondary vectors are optional.",
    },
    {
        question: "Can I reconfigure vectors post-deployment?",
        answer:
            "Yes. Access your Command Dashboard to modify surveys, feedback channels, or secondary links in real-time. Changes propagate instantly.",
    },
    {
        question: "Is configuration required at purchase?",
        answer:
            "No. Initial protocol only requires essential business data. Advanced configuration occurs via the dashboard after system generation.",
    },
    {
        question: "Does the system generate content automatically?",
        answer:
            "No. The system facilitates the pathway. Users generate and submit their own content directly to the review platform.",
    },
];
