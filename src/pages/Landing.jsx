import Navbar from '../components/layout/Navbar';
import Hero from '../components/landing/Hero';
import HowItWorks from '../components/landing/HowItWorks';
import DifferenceSection from '../components/landing/DifferenceSection';
import TargetAudience from '../components/landing/TargetAudience';
import RelocationServices from '../components/landing/RelocationServices';
import Capabilities from '../components/landing/Capabilities';
import CitiesGrid from '../components/landing/CitiesGrid';
import ScheduleTeaser from '../components/landing/ScheduleTeaser';
import Footer from '../components/layout/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-background-neutral">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <DifferenceSection />
        <TargetAudience />
        <RelocationServices />
        <Capabilities />
        <CitiesGrid />
        <ScheduleTeaser />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
