import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FloatingVideo from '@/components/FloatingVideo';
import Hero2 from '@/components/Hero2';
import InfoCarousel from '@/components/InfoCarousel';
import SocialProof from '@/components/SocialProof';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import ColorBlobs from '@/components/ColorBlobs';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <ColorBlobs />
      <Header />
      <Hero />
      <FloatingVideo />
      <Hero2 />
      <InfoCarousel />
      <SocialProof />
      <ContactForm />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
