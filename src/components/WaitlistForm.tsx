import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

interface WaitlistFormProps {
  onSuccess: (email: string) => void;
}

const WaitlistForm: React.FC<WaitlistFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [shopifyUrl, setShopifyUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email');
      return;
    }

    // Validate Shopify URL if provided
    if (shopifyUrl.trim() && !/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/.test(shopifyUrl.trim())) {
      toast.error('Please enter a valid URL');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Insert the email and shopify URL into the Supabase table
      const { error } = await supabase
        .from('emails')
        .insert({ 
          email: email.trim(),
          shopify_url: shopifyUrl.trim() || null // Store null if no URL provided
        });
      
      if (error) {
        if (error.code === '23505') {
          // This is the PostgreSQL error code for unique constraint violation
          toast.error('This email is already on our waitlist!');
        } else {
          console.error('Error submitting email:', error);
          toast.error('Failed to join waitlist. Please try again.');
        }
        setIsSubmitting(false);
        return;
      }
      
      // Success
      onSuccess(email);
      setEmail('');
      setShopifyUrl('');
    } catch (error) {
      console.error('Error submitting email:', error);
      toast.error('Failed to join waitlist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto animate-fade-in-delay">
      <div className="glass flex flex-col gap-2 p-2 rounded-2xl">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent border-0 focus:ring-0 text-foreground px-4 py-3 placeholder:text-muted-foreground rounded-full"
          disabled={isSubmitting}
        />
        <input
          type="url"
          placeholder="Your Shopify store URL (optional) e.g. www.sampleshop.com"
          value={shopifyUrl}
          onChange={(e) => setShopifyUrl(e.target.value)}
          className="w-full bg-transparent border-0 focus:ring-0 text-foreground px-4 py-3 placeholder:text-muted-foreground rounded-full"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center rounded-full bg-foreground text-background h-12 transition-all duration-300 hover:bg-gray-800"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
          ) : (
            <div className="flex items-center gap-2">
              <span>Join Waitlist</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          )}
        </button>
      </div>
      <p className="text-xs text-center text-muted-foreground mt-3">
        We'll never share your information with anyone else.
      </p>
    </form>
  );
};

export default WaitlistForm;
