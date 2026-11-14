import Header from "@/components/home/Header";
import HeroBento from "@/components/home/heroes/HeroBento";
import Anatomy from "@/components/home/sections/Anatomy";
import Pipeline from "@/components/home/sections/Pipeline";
import DayRuler from "@/components/home/sections/DayRuler";
import Channels from "@/components/home/sections/Channels";
import Pricing from "@/components/home/sections/Pricing";
import Faq from "@/components/home/sections/Faq";
import Features from "@/components/home/sections/Features";
import FinalCta from "@/components/home/sections/FinalCta";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroBento />
        <Anatomy />
        <Pipeline />
        <DayRuler />
        <Channels />
        <Pricing />
        <Features />
        <Faq />
      </main>
      <FinalCta />
    </>
  );
}
