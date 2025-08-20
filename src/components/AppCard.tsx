import React from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';

interface AppCardProps {
  title: string;
  description: string;
  href: string;
  isExternal?: boolean;
  onClick?: () => void;
}

const AppCard: React.FC<AppCardProps> = ({ 
  title, 
  description, 
  href, 
  isExternal = false,
  onClick 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (isExternal) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = href;
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:shadow-xl hover:scale-105 transform"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-white group-hover:text-blue-100 transition-colors">
          {title}
        </h3>
        <div className="flex-shrink-0 ml-3">
          {isExternal ? (
            <ExternalLink 
              size={18} 
              className="text-white/60 group-hover:text-white/80 transition-colors" 
            />
          ) : (
            <ArrowRight 
              size={18} 
              className="text-white/60 group-hover:text-white/80 group-hover:translate-x-1 transition-all" 
            />
          )}
        </div>
      </div>
      
      <p className="text-white/70 text-sm leading-relaxed group-hover:text-white/90 transition-colors">
        {description}
      </p>
      
      <div className="mt-4 flex items-center text-xs text-white/50 group-hover:text-white/70 transition-colors">
        <div className={`w-2 h-2 rounded-full mr-2 ${isExternal ? 'bg-orange-400' : 'bg-green-400'}`}></div>
        {isExternal ? 'Opens in new window' : 'Opens in same window'}
      </div>
    </div>
  );
};

export default AppCard;