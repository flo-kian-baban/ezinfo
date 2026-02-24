import React from "react";
import Container from "@/components/Container";

export const metadata = {
    title: "Contact | EZinfo",
    description: "Get in touch with the EZinfo team.",
};

export default function ContactPage() {
    return (
        <main className="min-h-screen pt-32 pb-24">
            <Container className="max-w-3xl">
                <a
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
                >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to home
                </a>

                <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
                    Contact Us
                </h1>
                <p className="text-base text-muted leading-relaxed mb-12 max-w-xl">
                    Have a question about EZinfo? We&apos;d love to hear from you.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="rounded-[24px] border border-white/5 bg-surface p-8 transition-all duration-300 hover:border-white/10 hover:shadow-lg">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-accent">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">Email</h3>
                        <p className="text-sm text-muted mb-4">For general questions and support</p>
                        <a
                            href="mailto:hello@ezinfo.co"
                            className="text-sm font-medium text-accent hover:underline"
                        >
                            hello@ezinfo.co
                        </a>
                    </div>

                    <div className="rounded-[24px] border border-white/5 bg-surface p-8 transition-all duration-300 hover:border-white/10 hover:shadow-lg">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-accent">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">Response Time</h3>
                        <p className="text-sm text-muted mb-4">We typically respond within</p>
                        <span className="text-sm font-medium text-foreground">
                            24 hours
                        </span>
                    </div>
                </div>

                <div className="mt-12 rounded-[24px] border border-white/5 bg-surface p-8">
                    <h3 className="text-lg font-bold text-foreground mb-2">Ready to order?</h3>
                    <p className="text-sm text-muted mb-4">
                        Skip the email and order your EZinfo card directly.
                    </p>
                    <a
                        href="/#order"
                        className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent-hover hover:-translate-y-0.5 shadow-[0_0_20px_-5px_rgba(241,90,45,0.4)]"
                    >
                        Order EZinfo
                    </a>
                </div>
            </Container>
        </main>
    );
}
