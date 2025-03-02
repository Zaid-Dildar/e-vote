import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import About from "../components/landing/About";
import Priorities from "../components/landing/Priorities";
import Security from "../components/landing/Security";
import Structure from "../components/landing/Structure";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Security />
      <Structure />
      <Priorities />
      <About />
    </div>
  );
}
