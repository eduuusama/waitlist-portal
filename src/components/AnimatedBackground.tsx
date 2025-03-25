
import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-[500px] -left-[500px] w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-blue-50 to-transparent opacity-50 animate-pulse-subtle" />
      <div className="absolute -bottom-[300px] -right-[300px] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-gray-50 to-transparent opacity-40 animate-pulse-subtle" 
        style={{ animationDelay: '1s' }}
      />
      <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-50 to-transparent opacity-30 animate-pulse-subtle"
        style={{ animationDelay: '2s' }} 
      />
    </div>
  );
};

export default AnimatedBackground;
