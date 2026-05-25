import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import Metrics from '@/components/Metrics';
import InteractiveDemo from '@/components/InteractiveDemo';
import DoctorChallenge from '@/components/DoctorChallenge';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Metrics />
        <InteractiveDemo />
        <DoctorChallenge />
      </main>
      <Footer />
    </>
  );
}
