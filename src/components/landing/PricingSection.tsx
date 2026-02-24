import React from "react";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";
import PricingCard from "@/components/PricingCard";
import ScrollReveal from "@/components/ScrollReveal";
import { PRICING_FEATURES } from "@/data/landing-data";

export default function PricingSection() {
    return (
        <section id="pricing" className="scroll-mt-24 py-20 lg:py-32">
            <Container>
                <ScrollReveal>
                    <SectionTitle
                        align="center"
                        badge="Investment"
                        title="Transparent Pricing"
                        subtitle="Complete system access. No hidden variables."
                    />
                </ScrollReveal>

                <ScrollReveal className="mt-20">
                    <PricingCard
                        price="$29.99"
                        period="mo"
                        features={PRICING_FEATURES}
                        badge="RECOMMENDED"
                        ctaText="Initialize Order"
                        ctaHref="#order"
                    />
                </ScrollReveal>
            </Container>
        </section>
    );
}
