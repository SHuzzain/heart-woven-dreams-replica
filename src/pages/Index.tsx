import { useState } from "react";
import { Hero } from "@/components/wedding/Hero";
import { Welcome } from "@/components/wedding/Welcome";
import { Story } from "@/components/wedding/Story";
import { Gallery } from "@/components/wedding/Gallery";
import { Events } from "@/components/wedding/Events";
import { Location } from "@/components/wedding/Location";
import { Countdown } from "@/components/wedding/Countdown";
import { RSVP } from "@/components/wedding/RSVP";
import { Footer } from "@/components/wedding/Footer";
import { MusicToggle } from "@/components/wedding/MusicToggle";
import { IntroOverlay } from "@/components/wedding/IntroOverlay";
import { FloatingPetals, Fireworks } from "@/components/wedding/Effects";

const Index = () => {
  const [introVisible, setIntroVisible] = useState(true);

  const scrollToWelcome = () => {
    document.getElementById("welcome")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="relative bg-ivory text-cocoa overflow-x-hidden">
      <IntroOverlay visible={introVisible} onDone={() => setIntroVisible(false)} />
      <FloatingPetals />
      <Fireworks />
      {/* <MusicToggle /> */}

      <Hero onEnter={scrollToWelcome} />
      <div id="welcome">
        <Welcome />
      </div>
      <Story />
      <Countdown />
      <Gallery />
      <Events />
      <Location />
      <RSVP />
      <Footer />
    </main>
  );
};

export default Index;
