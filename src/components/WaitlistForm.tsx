
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface WaitlistFormProps {
  onSuccess: (email: string) => void;
}

const WaitlistForm: React.FC<WaitlistFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
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
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(email);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto animate-fade-in-delay">
      <div className="glass flex items-center p-2 rounded-full">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-transparent border-0 focus:ring-0 text-foreground px-4 py-3 placeholder:text-muted-foreground"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="ml-2 flex items-center justify-center rounded-full bg-foreground text-background h-12 w-12 transition-all duration-300 hover:bg-gray-800"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
          ) : (
            <ArrowRight className="w-5 h-5" />
          )}
        </button>
      </div>
      <p className="text-xs text-center text-muted-foreground mt-3">
        We'll never share your email with anyone else.
      </p>
    </form>
  );
};

export default WaitlistForm;
