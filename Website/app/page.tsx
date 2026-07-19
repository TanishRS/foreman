import SceneMount from '@/components/three/SceneMount';
import ScrollProvider from '@/components/providers/ScrollProvider';
import Nav from '@/components/dom/Nav';
import Hero from '@/components/dom/Hero';
import Services from '@/components/dom/Services';
import Process from '@/components/dom/Process';
import Work from '@/components/dom/Work';
import TechStack from '@/components/dom/TechStack';
import SocialProof from '@/components/dom/SocialProof';
import About from '@/components/dom/About';
import Contact from '@/components/dom/Contact';
import Footer from '@/components/dom/Footer';

export default function Home() {
  return (
    <>
      {/* single persistent WebGL scene, fixed behind everything */}
      <SceneMount />
      <ScrollProvider />
      <Nav />
      <main className="site">
        <Hero />
        <Services />
        <Process />
        <Work />
        <TechStack />
        <SocialProof />
        <About />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
