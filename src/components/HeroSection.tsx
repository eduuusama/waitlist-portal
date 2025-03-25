import React from 'react';
import WaitlistForm from './WaitlistForm';
import PartnerLogos from './PartnerLogos';

interface HeroSectionProps {
  onJoinWaitlist: (email: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onJoinWaitlist }) => {
  return (
    <section className="py-20 px-4 max-w-4xl mx-auto flex flex-col items-center">
      <div className="text-center space-y-6 mb-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-balance animate-fade-in" style={{ animationDelay: '100ms' }}>
          Automate Everyday Shopify Tasks in One-Click
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance animate-fade-in" style={{ animationDelay: '200ms' }}>
          Join our exclusive waitlist to be among the first to experience AI for Shopify Automations.
        </p>
      </div>

      <WaitlistForm onSuccess={onJoinWaitlist} />

      <div className="mt-10 w-full animate-fade-in" style={{ animationDelay: '300ms' }}>
        <PartnerLogos />
      </div>
    </section>
  );
};

export default HeroSection;
