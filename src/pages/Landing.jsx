import Navbar from '../components/layout/Navbar';
import Hero from '../components/landing/Hero';
import TrustedBy from '../components/landing/TrustedBy';
import HowItWorks from '../components/landing/HowItWorks';
import DifferenceSection from '../components/landing/DifferenceSection';
import TargetAudience from '../components/landing/TargetAudience';
import Capabilities from '../components/landing/Capabilities';
import CitiesGrid from '../components/landing/CitiesGrid';
import Schedule from '../components/landing/Schedule';
import Footer from '../components/layout/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-background-neutral">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <TrustedBy />
        <HowItWorks />
        <DifferenceSection />
        <TargetAudience />
        <Capabilities />
        <CitiesGrid />
        <Schedule />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
