import Hero from "../components/Hero";
import WeddingDetails from "../components/sections/WeddingDetails";
import Countdown from "../components/sections/Countdown";
import Timeline from "../components/sections/Timeline";
import PremiumGallery from "../components/sections/PremiumGallery";
import Venue from "../components/sections/Venue";
import RSVP from "../components/sections/RSVP";
import MusicButton from "../components/shared/MusicButton";
import ShareButton from "../components/shared/ShareButton";
import ScrollProgress from "../components/shared/ScrollProgress";
import SectionDivider from "../components/shared/SectionDivider";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#09070D]">
      <ScrollProgress />
      <MusicButton />
      <ShareButton />
      <Hero />
      <SectionDivider />
      <WeddingDetails />
      <SectionDivider />
      <Countdown />
      <SectionDivider />
      <Timeline />
      <SectionDivider />
      <PremiumGallery />
      <SectionDivider />
      <Venue />
      <SectionDivider />
      <RSVP />
      <Footer />
    </main>
  );
}