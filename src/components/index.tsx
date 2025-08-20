import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppCard from './AppCard';
import 'react-tooltip/dist/react-tooltip.css';

const Index: React.FC = () => {
  const navigate = useNavigate();

  const apps = [
    {
      title: 'NUC Viewer',
      description: 'Decode and inspect NUC (Nillion User Credential) tokens instantly. View token chains, signatures, and payload details.',
      href: '/nuc-viewer',
      isExternal: false
    },
    {
      title: 'Nillion Documentation',
      description: 'Official documentation for Nillion network, including guides, API references, and developer resources.',
      href: 'https://docs.nillion.com',
      isExternal: true
    },
    {
      title: 'Nillion GitHub',
      description: 'Explore the open-source repositories, SDKs, and tools for building on the Nillion network.',
      href: 'https://github.com/nillionnetwork',
      isExternal: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-500 to-indigo-600 py-12 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-black/60 backdrop-blur-sm rounded-full mb-6">
            <img 
              src="/nillion-tools-logo.png" 
              alt="Logo" 
              className="logo"
            />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Nillion Tools</h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg leading-relaxed">
            A collection of useful tools for working with Nillion's privacy-preserving technology stack.
          </p>
        </div>

        {/* App Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {apps.map((app, index) => (
            <AppCard
              key={index}
              title={app.title}
              description={app.description}
              href={app.href}
              isExternal={app.isExternal}
              onClick={!app.isExternal ? () => navigate(app.href) : undefined}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-white/60 text-sm">
            Built for the Nillion developer community
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;