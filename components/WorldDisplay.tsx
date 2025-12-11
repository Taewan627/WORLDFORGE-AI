import React from 'react';
import { World } from '../types';
import LocationCard from './LocationCard';
import PillarsList from './PillarsList';
import { Download } from 'lucide-react';

interface WorldDisplayProps {
  world: World;
  onGenerateImage: (id: string, prompt: string) => void;
  onExpandImage: (url: string, alt: string) => void;
}

const WorldDisplay: React.FC<WorldDisplayProps> = ({ world, onGenerateImage, onExpandImage }) => {
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(world, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${world.title.replace(/\s+/g, '_').toLowerCase()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header Section */}
      <div className="text-center mb-16 relative px-4">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-indigo-900/20 blur-3xl rounded-full -z-10"></div>
         
         <div className="mb-2">
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-indigo-200 cinematic-font tracking-tight">
                {world.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 cinematic-font mt-1">
                ({world.title_ko})
            </p>
         </div>

         <div className="max-w-2xl mx-auto mt-6">
            <p className="text-lg md:text-xl text-indigo-200/80 italic font-light">
                "{world.tagline}"
            </p>
            <p className="text-sm text-indigo-200/40 mt-1">
                ({world.tagline_ko})
            </p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-end mb-4 border-b border-gray-800 pb-2">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Core Pillars</h2>
            <button onClick={handleExport} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                <Download className="w-3 h-3" /> Export JSON
            </button>
        </div>
        <PillarsList pillars={world.pillars} />

        <div className="mb-6 border-b border-gray-800 pb-2 mt-12">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Key Locations</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
          {world.locations.map((location) => (
            <LocationCard 
              key={location.id} 
              location={location} 
              onGenerateImage={onGenerateImage}
              onExpandImage={onExpandImage}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorldDisplay;