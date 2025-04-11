
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '../lib/utils';
import { supabase } from '../integrations/supabase/client';
import { toast } from './ui/use-toast';

interface WaitlistFormProps {
  onSuccess: (email: string) => void;
  buttonText?: string;
}

const WaitlistForm: React.FC<WaitlistFormProps> = ({ 
  onSuccess,
  buttonText = "Join Waitlist" 
}) => {
  const [email, setEmail] = useState('');
  const [shopifyUrl, setShopifyUrl] = useState('');
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
      // Save the email to Supabase using the 10automations table
      const { error: supabaseError } = await supabase
        .from('10automations')
        .insert([{ 
          email, 
          shopify_url: shopifyUrl || null,
          document_sent: false
        }]);

      if (supabaseError) {
        // If it's a unique violation, that means the email already exists
        if (supabaseError.code === '23505') {
          // This is okay - they're just submitting again
          console.log('Email already exists, continuing with success flow');
        } else {
          throw supabaseError;
        }
      }

      // Show success toast
      toast({
        title: "Success!",
        description: "Your automations are on the way to your inbox!",
      });

      // Call the success handler
      onSuccess(email);
    } catch (err) {
      console.error('Error saving email:', err);
      setError('Something went wrong. Please try again.');
    } finally {
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
      <div className="flex flex-col gap-3">
        <Input
          type="email"
          placeholder="Enter your email"
          className="w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
        <Input
          type="text"
          placeholder="Shopify store URL (optional)"
          className="w-full"
          value={shopifyUrl}
          onChange={(e) => setShopifyUrl(e.target.value)}
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-[#8C74FF] hover:bg-[#6D56D7] text-white"
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
