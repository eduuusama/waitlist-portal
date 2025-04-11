
import React, { useState } from 'react';
import HeroSection from '../components/HeroSection';
import SuccessMessage from '../components/SuccessMessage';
import AnimatedBackground from '../components/AnimatedBackground';
import { Link } from 'react-router-dom';

const Index = () => {
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
      
      <div className="absolute top-4 right-4 z-10">
        <Link 
          to="/automations" 
          className="px-4 py-2 rounded-full bg-[#8C74FF] text-white font-medium hover:bg-opacity-90 transition-all shadow-lg"
        >
          Get 10 Automations →
        </Link>
      </div>
      
      <main className="w-full">
        {joinedEmail ? (
          <SuccessMessage email={joinedEmail} onClose={handleClose} />
        ) : (
          <HeroSection onJoinWaitlist={handleJoinWaitlist} />
        )}
      </main>
    </div>
  );
};

export default Index;
