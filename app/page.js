import HeroSection from '@/components/home/HeroSection';
import AboutSnippet from '@/components/home/AboutSnippet';
import MissionVision from '@/components/home/MissionVision';
import FocusAreas from '@/components/home/FocusAreas';
import PartnersMarquee from '@/components/PartnersMarquee/PartnersMarquee';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import ImpactSection from '@/components/home/ImpactSection';
import Testimonials from '@/components/Testimonials/Testimonials';
import PillarHighlights from '@/components/home/PillarHighlights';
import LatestUpdates from '@/components/home/LatestUpdates';
import DonationCta from '@/components/home/DonationCta';

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSnippet />
      <MissionVision />
      <FocusAreas />
      <PartnersMarquee />
      <FeaturedProjects />
      <ImpactSection />
      <Testimonials />
      <PillarHighlights />
      <LatestUpdates />
      <DonationCta />
    </>
  );
}

