
import React, { useState } from 'react';
import AutomationsHero from '../components/AutomationsHero';
import SuccessMessage from '../components/SuccessMessage';
import AnimatedBackground from '../components/AnimatedBackground';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Automations = () => {
  const [joinedEmail, setJoinedEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinWaitlist = async (email: string) => {
    setIsLoading(true);
    
    try {
      // Call the edge function to send the automations
      const { error } = await supabase.functions.invoke('send-automations', {
        body: { email }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      setJoinedEmail(email);
    } catch (error) {
      console.error('Error sending automations:', error);
      toast({
        title: "Error",
        description: "We couldn't send your automations. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setJoinedEmail(null);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative">
      <AnimatedBackground />
      
      <main className="w-full">
        {joinedEmail ? (
          <SuccessMessage email={joinedEmail} onClose={handleClose} isAutomationsPage={true} />
        ) : (
          <AutomationsHero onJoinWaitlist={handleJoinWaitlist} />
        )}
      </main>
    </div>
  );
};

export default Automations;
