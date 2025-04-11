
import React from 'react';
import WaitlistForm from './WaitlistForm';
import PartnerLogos from './PartnerLogos';

interface AutomationsHeroProps {
  onJoinWaitlist: (email: string) => void;
  isLoading?: boolean;
}

const AutomationsHero: React.FC<AutomationsHeroProps> = ({ onJoinWaitlist, isLoading = false }) => {
  return (
    <section className="pt-10 pb-20 px-4 max-w-4xl mx-auto flex flex-col items-center">
      <div className="w-full animate-fade-in" style={{ animationDelay: '100ms' }}>
        <PartnerLogos />
      </div>

      <div className="text-center space-y-6 my-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-balance animate-fade-in" style={{ animationDelay: '200ms', whiteSpace: 'nowrap' }}>
          Get 10 Powerful Shopify Automations
        </h1>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-balance animate-fade-in text-muted-foreground" style={{ animationDelay: '250ms' }}>
          Save 20+ Hours Every Week
        </h2>
        <p className="text-xl text-foreground max-w-2xl mx-auto text-balance animate-fade-in" style={{ animationDelay: '300ms' }}>
          Receive 10 time-saving automations that have helped merchants like you reclaim their time.
        </p>
      </div>

      <WaitlistForm 
        onSuccess={onJoinWaitlist} 
        buttonText="Get 10 Automations now" 
        tableName="10automations" 
        isLoading={isLoading}
      />
    </section>
  );
};

export default AutomationsHero;
