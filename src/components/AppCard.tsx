import React from 'react';
import { ExternalLink, ArrowRight, Wrench, BookOpen, Github, CircuitBoard, Code, Coins } from 'lucide-react';

export interface AppData {
  title: string;
  description: string;
  href: string;
  isExternal?: boolean;
  icon?: 'tool' | 'documentation' | 'github' | 'circuit-board' | 'code-xml' | 'coins';
  language?: string;
  areas?: string[];
}

interface AppCardProps {
  app: AppData;
  onClick?: () => void;
}

const AppCard: React.FC<AppCardProps> = ({ 
  app,
  onClick 
}) => {
  const { title, description, href, isExternal = false, icon = 'tool', language, areas } = app;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (isExternal) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = href;
    }
  };

  const getIcon = () => {
    switch (icon) {
      case 'tool':
        return <Wrench size={24} className="text-orange-300" />;
      case 'documentation':
        return <BookOpen size={24} className="text-blue-300" />;
      case 'github':
        return <Github size={24} className="text-purple-300" />;
      case 'circuit-board':
        return <CircuitBoard size={24} className="text-red-300" />;
      case 'code':
        return <Code size={24} className="text-yellow-300" />;
      case 'coins':
        return <Coins size={24} className="text-green-300" />;
      default:
        return <Wrench size={24} className="text-blue-300" />;
    }
  };
  return (
    <div 
      onClick={handleClick}
      className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:shadow-xl hover:scale-105 transform"
    >
      <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-4 group-hover:bg-white/20 transition-colors">
        {getIcon()}
      </div>
      
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
      
      {/* Tags for language and area */}
      {(language || (areas && areas.length > 0)) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {language && (
            <span className="inline-flex items-center px-2 py-1 bg-blue-500/20 text-blue-200 rounded-md text-xs font-medium border border-blue-400/30">
              {language}
            </span>
          )}
          {areas && areas.map((area) => (
            <span key={area} className="inline-flex items-center px-2 py-1 bg-green-500/20 text-green-200 rounded-md text-xs font-medium border border-green-400/30">
              {area}
            </span>
          ))}
        </div>
      )}
      
      <div className="mt-4 flex items-center text-xs text-white/50 group-hover:text-white/70 transition-colors">
        <div className={`w-2 h-2 rounded-full mr-2 ${isExternal ? 'bg-orange-400' : 'bg-green-400'}`}></div>
        {isExternal ? 'Opens in new window' : 'Opens in same window'}
      </div>
    </div>
  );
};

export default AppCard;