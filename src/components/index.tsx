import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppCard, { AppData } from './AppCard';
import FilterBar, { FilterOptions } from './FilterBar';
import 'react-tooltip/dist/react-tooltip.css';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = React.useState<string | null>(null);
  const [selectedArea, setSelectedArea] = React.useState<string | null>(null);

  const apps: AppData[] = [
    {
      title: 'NUC Viewer',
      description: 'Decode and inspect NUC (Nillion User Credential) tokens instantly. View token chains, signatures, and payload details.',
      href: '/nuc-viewer',
      isExternal: false,
      icon: 'tool' as const,
      language: 'TypeScript',
      area: 'Authentication'
    },
    {
      title: 'Nillion Documentation',
      description: 'Official documentation for Nillion network, including guides, API references, and developer resources.',
      href: 'https://docs.nillion.com',
      isExternal: true,
      icon: 'documentation' as const,
      area: 'Documentation'
    },
    {
      title: 'Storage Tools',
      description: 'Builder tools for creating and managing Nillion Private Storage schemas, collections, and records.',
      href: 'https://nillion-storage-tools.vercel.app/',
      isExternal: true,
      icon: 'tool' as const,
      language: 'TypeScript',
      area: 'Storage'
    },
    {
      title: 'Blindfold Tool',
      description: 'Blindfold supports store, match, and sum operations across single-node and multi-node configurations with various cryptographic implementations.',
      href: 'https://blindfold-demos.vercel.app/',
      isExternal: true,
      icon: 'tool' as const,
      language: 'TypeScript',
      area: 'Cryptography'
    }
  ];

  // Extract unique languages and areas for filter options
  const availableFilters: FilterOptions = React.useMemo(() => {
    const languages = [...new Set(apps.map(app => app.language).filter(Boolean))].sort();
    const areas = [...new Set(apps.map(app => app.area).filter(Boolean))].sort();
    return { languages, areas };
  }, [apps]);

  // Filter apps based on selected filters
  const filteredApps = React.useMemo(() => {
    return apps.filter(app => {
      const matchesLanguage = !selectedLanguage || app.language === selectedLanguage;
      const matchesArea = !selectedArea || app.area === selectedArea;
      return matchesLanguage && matchesArea;
    });
  }, [apps, selectedLanguage, selectedArea]);

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

        {/* Filter Bar */}
        <FilterBar
          selectedLanguage={selectedLanguage}
          selectedArea={selectedArea}
          onLanguageChange={setSelectedLanguage}
          onAreaChange={setSelectedArea}
          availableFilters={availableFilters}
        />

        {/* App Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredApps.length > 0 ? (
            filteredApps.map((app, index) => (
              <AppCard
                key={index}
                app={app}
                onClick={!app.isExternal ? () => navigate(app.href) : undefined}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-2">No tools found</h3>
                <p className="text-white/70">
                  No tools match your current filter criteria. Try adjusting your filters or clearing them to see all available tools.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        {(selectedLanguage || selectedArea) && (
          <div className="text-center mb-8">
            <p className="text-white/70 text-sm">
              Showing {filteredApps.length} of {apps.length} tools
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center">
          <p className="text-white/60 text-sm">
            Built for the Nillion developer community
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;