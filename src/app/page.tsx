import React from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";
import ScrollReveal from "@/components/ScrollReveal";
import OrderForm from "@/components/OrderForm";
import HeroSection from "@/components/landing/HeroSection";
import MarqueeSection from "@/components/landing/MarqueeSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";

/* ─── Page ─────────────────────────────────────────────── */

export default function Home() {
  return (
    <main className="relative min-h-screen selection:bg-accent selection:text-white">

      <Header />

      <HeroSection />

      <MarqueeSection />

      <FeaturesSection />

      <HowItWorksSection />

      <PricingSection />

      <FAQSection />

      {/* ─── ORDER FORM ───────────────────────────── */}
      <section id="order" className="relative scroll-mt-24 py-20 lg:py-32 overflow-hidden">
        <Container className="relative z-10">
          <ScrollReveal>
            <SectionTitle
              align="center"
              badge="Initialization"
              title="Begin Sequence"
              subtitle="Input essential parameters to initiate your custom build."
            />
          </ScrollReveal>

          <ScrollReveal className="mt-20">
            <OrderForm />
          </ScrollReveal>
        </Container>
      </section>

      {/* ─── FOOTER ──────────────────────────────── */}
      <footer className="border-t border-white/5 py-12">
        <Container>
          <div className="flex flex-col items-center justify-center gap-6">
            <Image
              src="/EZInfo.png"
              alt="EZinfo"
              width={80}
              height={40}
              className="h-[24px] w-auto opacity-40 hover:opacity-100 transition-opacity duration-500"
            />
            <p className="text-[10px] text-muted/30 uppercase tracking-[0.2em]">
              &copy; {new Date().getFullYear()} EZinfo Systems. All rights reserved.
            </p>
          </div>
        </Container>
      </footer>
    </main>
  );
}
