import React from 'react';
import { Sparkles } from 'lucide-react';
import { Pillar } from '../types';

interface PillarsListProps {
  pillars: Pillar[];
}

const PillarsList: React.FC<PillarsListProps> = ({ pillars }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {pillars.map((pillar, index) => (
        <div 
          key={index} 
          className="bg-gray-900/50 border border-gray-800 p-4 rounded-lg backdrop-blur-sm hover:border-indigo-500/50 transition-colors duration-300"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
            <div className="flex flex-col">
              <p className="text-gray-300 leading-relaxed text-sm font-medium">{pillar.en}</p>
              <p className="text-gray-500 text-xs mt-1">({pillar.ko})</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PillarsList;