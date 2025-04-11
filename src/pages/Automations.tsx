
import React, { useState } from 'react';
import AutomationsHero from '../components/AutomationsHero';
import SuccessMessage from '../components/SuccessMessage';
import AnimatedBackground from '../components/AnimatedBackground';
import { supabase } from '../integrations/supabase/client';
import { Toaster } from '../components/ui/toaster';
import { toast } from '../components/ui/use-toast';

const Automations = () => {
  const [joinedEmail, setJoinedEmail] = useState<string | null>(null);

  const handleJoinWaitlist = async (email: string) => {
    try {
      // Call our Edge Function to send the automations document
      const { data, error } = await supabase.functions.invoke('send-automations', {
        body: { email }
      });

      if (error) {
        console.error("Error sending automations:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was a problem sending your automations. We'll fix this and get back to you.",
        });
      } else {
        console.log("Automations sent successfully:", data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      // We already show a success message via the state change,
      // so we'll just log this error rather than showing another toast
    }

    // Set the email in state to show the success message
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
      
      <Toaster />
    </div>
  );
};

export default Automations;
