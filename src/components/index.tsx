import React from 'react';
import 'react-tooltip/dist/react-tooltip.css';

const Index: React.FC = () => {

  return (
    <div className="bg-blue-900 flex items-center justify-center min-h-screen">
      <div className="relative w-80 h-80 text-white grid place-items-center">
          <div className="absolute">
              <div className="logo-container">
                <img 
                  src="/nillion-tools-logo.png" 
                  alt="Logo" 
                  width={200}
                  className="logo"
                />
              </div>
          </div>
      </div>
    </div>
  );
};

export default Index;