import { CERTIFICATIONS } from "@/lib/data";
import { SmoothScroll } from "@/lib/scroll";
import Hero from "./hero/Hero";
import Navigation from "./Navigation";
import About from "./sections/About";
import Achievements from "./sections/Achievements";
import Certifications from "./sections/Certifications";
import Contact from "./sections/Contact";
import Experience from "./sections/Experience";
import Footer from "./sections/Footer";
import Skills from "./sections/Skills";
import Work from "./sections/Work";
import { RevealObserver } from "./ui/RevealObserver";

export default function App() {
  return (
    <>
      <SmoothScroll />
      <RevealObserver />
      <Navigation />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Skills />
        <Work />
        {CERTIFICATIONS.length > 0 && <Certifications />}
        <Experience />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
