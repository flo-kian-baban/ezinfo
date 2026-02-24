import React from "react";
import Container from "@/components/Container";

export const metadata = {
    title: "Terms of Service | EZinfo",
    description: "EZinfo terms of service - the rules of using our platform.",
};

export default function TermsPage() {
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
                    Terms of Service
                </h1>
                <p className="text-sm text-muted mb-12">
                    Last updated: February 2026
                </p>

                <div className="prose-invert space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">1. Service Description</h2>
                        <p className="text-[15px] leading-relaxed text-muted">
                            EZinfo provides NFC + QR touchpoint cards and hosted landing pages for local businesses.
                            Our service helps businesses collect Google Reviews, surveys, private feedback, and direct
                            customers to relevant links. EZinfo does not write, post, or submit reviews on behalf of
                            any user or customer.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">2. Subscription & Billing</h2>
                        <p className="text-[15px] leading-relaxed text-muted">
                            EZinfo is offered as a monthly subscription. Your subscription includes one NFC + QR card
                            (with shipping), a hosted branded page, and ongoing support and updates. You may cancel
                            your subscription at any time, effective at the end of the current billing period.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">3. Review Compliance</h2>
                        <p className="text-[15px] leading-relaxed text-muted">
                            You agree not to use EZinfo to solicit fake, incentivized, or fraudulent reviews. EZinfo
                            is a tool that makes it easier for genuine customers to leave feedback - all reviews are
                            written and submitted by customers themselves on the Google platform. You are responsible
                            for ensuring your use of EZinfo complies with Google&apos;s review policies and all applicable
                            laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">4. Acceptable Use</h2>
                        <p className="text-[15px] leading-relaxed text-muted">
                            You agree to provide accurate business information when ordering your EZinfo card. You
                            may not use the service for any unlawful purpose or in violation of any applicable
                            regulations. We reserve the right to suspend or terminate accounts that violate these terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">5. Limitation of Liability</h2>
                        <p className="text-[15px] leading-relaxed text-muted">
                            EZinfo is provided &quot;as is&quot; without warranties of any kind. We are not liable for any
                            indirect, incidental, or consequential damages arising from your use of the service. Our
                            total liability shall not exceed the amount you paid for the service in the 12 months
                            preceding any claim.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">6. Changes to Terms</h2>
                        <p className="text-[15px] leading-relaxed text-muted">
                            We may update these terms from time to time. Continued use of the service after changes
                            constitutes acceptance of the new terms. We will notify you of material changes via email.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-3">7. Contact</h2>
                        <p className="text-[15px] leading-relaxed text-muted">
                            For questions about these terms, contact us at{" "}
                            <a href="mailto:support@ezinfo.co" className="text-accent hover:underline">
                                support@ezinfo.co
                            </a>.
                        </p>
                    </section>
                </div>
            </Container>
        </main>
    );
}
