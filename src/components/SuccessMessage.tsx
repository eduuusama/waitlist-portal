
import React from 'react';
import { Check } from 'lucide-react';

interface SuccessMessageProps {
  email: string;
  onClose: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ email, onClose }) => {
  return (
    <div className="glass p-8 max-w-md mx-auto rounded-2xl animate-fade-in">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-medium">You're on the list!</h3>
        <p className="text-muted-foreground">
          Thank you for joining. We've sent a confirmation to <span className="font-medium text-foreground">{email}</span>
        </p>
        <button 
          onClick={onClose}
          className="mt-4 px-6 py-2 text-sm font-medium text-primary border border-input rounded-full hover:bg-secondary transition-colors duration-300"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;
