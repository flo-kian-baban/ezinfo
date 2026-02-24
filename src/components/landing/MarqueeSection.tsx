import React from "react";
import InfiniteMarquee from "@/components/InfiniteMarquee";
import { LogoOrbit, LogoNexus, LogoVertex, LogoFlux, LogoCore, LogoSpark, LogoQuantum, LogoEcho } from "@/components/Logos";

export default function MarqueeSection() {
    return (
        <section className="py-12">
            <div className="w-full">
                <InfiniteMarquee items={[
                    <LogoOrbit key="1" className="h-12 w-auto" />,
                    <LogoNexus key="2" className="h-12 w-auto" />,
                    <LogoVertex key="3" className="h-12 w-auto" />,
                    <LogoFlux key="4" className="h-12 w-auto" />,
                    <LogoCore key="5" className="h-12 w-auto" />,
                    <LogoSpark key="6" className="h-12 w-auto" />,
                    <LogoQuantum key="7" className="h-12 w-auto" />,
                    <LogoEcho key="8" className="h-12 w-auto" />,
                ]} />
            </div>
        </section>
    );
}
