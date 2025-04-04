
import React from 'react';
import WaitlistForm from './WaitlistForm';
import PartnerLogos from './PartnerLogos';

interface HeroSectionProps {
  onJoinWaitlist: (email: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onJoinWaitlist }) => {
  return (
    <section className="pt-10 pb-20 px-4 max-w-4xl mx-auto flex flex-col items-center">
      <div className="w-full animate-fade-in" style={{ animationDelay: '100ms' }}>
        <PartnerLogos />
      </div>

      <div className="text-center space-y-6 my-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-balance animate-fade-in" style={{ animationDelay: '200ms' }}>
          Join the Shopify AI community.
        </h1>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-balance animate-fade-in text-muted-foreground" style={{ animationDelay: '250ms' }}>
          You are most likely missing out on Revenue
        </h2>
        <p className="text-xl text-foreground max-w-2xl mx-auto text-balance animate-fade-in" style={{ animationDelay: '300ms' }}>
          Receive 3 ways to increase sales with our Free Audit.
        </p>
      </div>

      <WaitlistForm onSuccess={onJoinWaitlist} />
    </section>
  );
};

export default HeroSection;
