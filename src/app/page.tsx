import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Expertise } from "@/components/sections/Expertise";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Mindset } from "@/components/sections/Mindset";
import { Process } from "@/components/sections/Process";
import { Team } from "@/components/sections/Team";
import { Technologies } from "@/components/sections/Technologies";
import { Work } from "@/components/sections/Work";
import { CosmicCanvas } from "@/components/three/CosmicCanvas";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <CosmicCanvas />
      <main id="conteudo" tabIndex={-1} className="relative outline-none">
        <Hero />
        <Expertise />
        <Work />
        <Process />
        <Mindset />
        <Technologies />
        <Team />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
