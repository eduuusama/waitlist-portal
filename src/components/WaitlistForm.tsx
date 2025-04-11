
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '../lib/utils';
import { supabase } from '../integrations/supabase/client';

interface WaitlistFormProps {
  onSuccess: (email: string) => void;
  buttonText?: string;
  tableName?: 'emails' | '10automations';
  isLoading?: boolean;
}

const WaitlistForm: React.FC<WaitlistFormProps> = ({ 
  onSuccess,
  buttonText = "Join Waitlist",
  tableName = '10automations',
  isLoading: externalLoading = false
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
      // We'll let the parent component handle the database and email sending
      // This simplifies this component's responsibility
      onSuccess(email);
    } catch (err) {
      console.error('Error:', err);
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
        { "animate-pulse": isLoading || externalLoading }
      )}
      style={{ animationDelay: '400ms' }}
    >
      <div className="flex flex-col gap-3">
        <Input
          type="email"
          placeholder="Enter your email"
          className="flex-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading || externalLoading}
          required
        />
        
        <Input
          type="url"
          placeholder="Your Shopify store URL (optional)"
          className="flex-1"
          value={shopifyUrl}
          onChange={(e) => setShopifyUrl(e.target.value)}
          disabled={isLoading || externalLoading}
        />
        
        <Button 
          type="submit" 
          disabled={isLoading || externalLoading}
          className="bg-[#8C74FF] hover:bg-[#6D56D7] text-white w-full"
        >
          {isLoading || externalLoading ? 'Processing...' : buttonText}
        </Button>
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </form>
  );
};

export default WaitlistForm;
