
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '../lib/utils';
import { supabase } from '../integrations/supabase/client';

interface WaitlistFormProps {
  onSuccess: (email: string) => void;
  buttonText?: string;
}

const WaitlistForm: React.FC<WaitlistFormProps> = ({ 
  onSuccess,
  buttonText = "Join Waitlist" 
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // Insert email into the 10automations table
      const { error: insertError } = await supabase
        .from('10automations')
        .insert([{ email }]);
      
      if (insertError) {
        console.error('Error saving email:', insertError);
        setError('Failed to join the waitlist. Please try again.');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(false);
      onSuccess(email);
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "w-full max-w-md mx-auto mt-6 animate-fade-in",
        { "animate-pulse": isLoading }
      )}
      style={{ animationDelay: '400ms' }}
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder="Enter your email"
          className="flex-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-[#8C74FF] hover:bg-[#6D56D7] text-white whitespace-nowrap"
        >
          {isLoading ? 'Processing...' : buttonText}
        </Button>
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </form>
  );
};

export default WaitlistForm;
