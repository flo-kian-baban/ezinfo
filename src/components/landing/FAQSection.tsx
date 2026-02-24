import React from "react";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";
import FAQAccordion from "@/components/FAQAccordion";
import ScrollReveal from "@/components/ScrollReveal";
import { FAQ_ITEMS } from "@/data/landing-data";

export default function FAQSection() {
    return (
        <section id="faq" className="scroll-mt-24 py-20 lg:py-32">
            <Container className="max-w-3xl">
                <ScrollReveal>
                    <SectionTitle
                        align="center"
                        badge="Data Bank"
                        title="Common Inquiries"
                        subtitle="Answers to operational and systemic queries."
                    />
                </ScrollReveal>

                <ScrollReveal className="mt-16">
                    <FAQAccordion items={FAQ_ITEMS} />
                </ScrollReveal>
            </Container>
        </section>
    );
}
