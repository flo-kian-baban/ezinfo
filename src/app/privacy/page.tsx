import React from "react";
import Container from "@/components/Container";

export const metadata = {
    title: "Privacy Policy | EZinfo",
    description: "EZinfo privacy policy - how we handle your data.",
};

export default function PrivacyPage() {
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
                    Privacy Policy
                </h1>
                <p className="text-sm text-muted mb-12">
                    Last updated: February 2026
                </p>

                <div className="prose-invert space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">1. Information We Collect</h2>
                        <p className="text-[15px] leading-relaxed text-muted">
                            When you order an EZinfo card, we collect your business name, contact name, email address,
                            Google Review link, and any optional information you provide (survey questions, feedback prompts,
                            extra links, brand color, logo, and welcome message). We use this information solely to create
                            and maintain your EZinfo touchpoint page and card.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">2. How We Use Your Information</h2>
                        <p className="text-[15px] leading-relaxed text-muted">
                            Your information is used to: set up your branded EZinfo page, configure your NFC + QR card,
                            communicate with you about your order and account, and provide customer support. We do not
                            sell, rent, or share your personal information with third parties for marketing purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">3. Customer Interaction Data</h2>
                        <p className="text-[15px] leading-relaxed text-muted">
                            When customers tap or scan your EZinfo card, we may collect anonymous interaction data
                            (such as tap counts and action selections) to provide you with usage insights. We do not
                            collect personal information from your customers unless they voluntarily submit it through
                            a survey or feedback form on your EZinfo page.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">4. Data Security</h2>
                        <p className="text-[15px] leading-relaxed text-muted">
                            We implement industry-standard security measures to protect your information. All data is
                            transmitted over encrypted connections (HTTPS) and stored securely. However, no method of
                            transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">5. Your Rights</h2>
                        <p className="text-[15px] leading-relaxed text-muted">
                            You may request access to, correction of, or deletion of your personal information at any
                            time by contacting us. If you cancel your subscription, we will delete your data within
                            30 days unless required by law to retain it.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">6. Contact</h2>
                        <p className="text-[15px] leading-relaxed text-muted">
                            For privacy-related questions, please contact us at{" "}
                            <a href="mailto:privacy@ezinfo.co" className="text-accent hover:underline">
                                privacy@ezinfo.co
                            </a>.
                        </p>
                    </section>
                </div>
            </Container>
        </main>
    );
}
