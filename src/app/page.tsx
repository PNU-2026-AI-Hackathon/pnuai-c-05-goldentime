import Hero from '@/components/Hero';
import MissionCards from '@/components/MissionCards';

export default function Home() {
  return (
    <>
      <Hero />
      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-24">
        <MissionCards />
      </section>
    </>
  );
}
