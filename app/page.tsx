import Header from '@/components/Header';
import Hero from '@/components/Hero';
import HeroVideo from '@/components/HeroVideo';
import WhyThisExists from '@/components/WhyThisExists';
import Details from '@/components/Details';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import ColorBlobs from '@/components/ColorBlobs';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <ColorBlobs />
      <Header />
      <Hero />
      <HeroVideo />
      <WhyThisExists />
      <Details />
      <ContactForm />
      <Footer />
    </main>
  );
}
