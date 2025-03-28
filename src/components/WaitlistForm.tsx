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

    // Remove URL validation - accept any text
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
      <div className="glass flex flex-col gap-3 p-3">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/90 dark:bg-white/10 border border-gray-200 dark:border-white/10 focus:border-[#8C74FF] focus:ring-1 focus:ring-[#8C74FF] text-foreground px-4 py-3 placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-lg shadow-sm transition-colors"
          disabled={isSubmitting}
        />
        <input
          type="text"
          placeholder="(optional) www.samplestore.com"
          value={shopifyUrl}
          onChange={(e) => setShopifyUrl(e.target.value)}
          className="w-full bg-white/90 dark:bg-white/10 border border-gray-200 dark:border-white/10 focus:border-[#8C74FF] focus:ring-1 focus:ring-[#8C74FF] text-foreground px-4 py-3 placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-lg shadow-sm transition-colors"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center rounded-lg bg-[#8C74FF] text-white h-12 transition-all duration-300 hover:bg-[#7B61FF] shadow-sm"
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
