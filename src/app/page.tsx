import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SectionObserver from "@/components/SectionObserver";
import ScrollIndicator from "@/components/ScrollIndicator";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import NossoEspaco from "@/components/sections/NossoEspaco";
import Profissionais from "@/components/sections/Profissionais";
import ServicosPreview from "@/components/sections/ServicosPreview";
import Localizacao from "@/components/sections/Localizacao";

export default function Home() {
  return (
    <main>
      <ScrollIndicator />
      <Header />
      <Hero />
      <Features />
      <NossoEspaco />
      <Profissionais />
      <ServicosPreview />
      <Localizacao />
      <Footer />
      <WhatsAppButton />
      <SectionObserver />
    </main>
  );
}
