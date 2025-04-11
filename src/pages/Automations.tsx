
import React, { useState } from 'react';
import AutomationsHero from '../components/AutomationsHero';
import SuccessMessage from '../components/SuccessMessage';
import AnimatedBackground from '../components/AnimatedBackground';

const Automations = () => {
  const [joinedEmail, setJoinedEmail] = useState<string | null>(null);

  const handleJoinWaitlist = (email: string) => {
    setJoinedEmail(email);
  };

  const handleClose = () => {
    setJoinedEmail(null);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative">
      <AnimatedBackground />
      
      <main className="w-full">
        {joinedEmail ? (
          <SuccessMessage email={joinedEmail} onClose={handleClose} />
        ) : (
          <AutomationsHero onJoinWaitlist={handleJoinWaitlist} />
        )}
      </main>
    </div>
  );
};

export default Automations;
