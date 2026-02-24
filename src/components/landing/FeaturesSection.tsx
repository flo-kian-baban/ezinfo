import React from "react";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";
import FeatureCard from "@/components/FeatureCard";
import ScrollReveal from "@/components/ScrollReveal";
import { FEATURES } from "@/data/landing-data";

export default function FeaturesSection() {
    return (
        <section id="features" className="relative scroll-mt-24 py-20 lg:py-32">
            <Container>
                <ScrollReveal>
                    <SectionTitle
                        align="center"
                        badge="Capabilities"
                        title="One Device. Every Vector."
                        subtitle="Consolidate customer touchpoints seamlessly."
                    />
                </ScrollReveal>

                <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map((f, i) => (
                        <ScrollReveal key={i} className={f.span}>
                            <FeatureCard
                                icon={f.icon}
                                title={f.title}
                                description={f.description}
                                className="h-full"
                            >
                                {f.children}
                            </FeatureCard>
                        </ScrollReveal>
                    ))}
                </div>
            </Container>
        </section>
    );
}
