import React, { useState } from 'react';
import { Location } from '../types';
import { Camera, RefreshCw, MapPin, Maximize2, Settings2 } from 'lucide-react';

interface LocationCardProps {
  location: Location;
  onGenerateImage: (id: string, prompt: string) => void;
  onExpandImage: (url: string, alt: string) => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, onGenerateImage, onExpandImage }) => {
  const { 
    id, name, name_ko, role, role_ko, mood, mood_ko, 
    story_hint, story_hint_ko, image_prompt_long, generatedImage, isGeneratingImage 
  } = location;

  const [customPrompt, setCustomPrompt] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const handleGenerate = () => {
    const finalPrompt = customPrompt.trim() 
      ? `${image_prompt_long}. Additional details and refinements: ${customPrompt.trim()}`
      : image_prompt_long;
    
    onGenerateImage(id, finalPrompt);
  };

  return (
    <div className="group relative bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:border-gray-700 hover:shadow-2xl hover:shadow-indigo-900/20">
      
      {/* Image Area */}
      <div className="relative w-full aspect-video bg-gray-950 overflow-hidden">
        {generatedImage ? (
          <div 
            className="relative w-full h-full cursor-zoom-in group/image"
            onClick={() => onExpandImage(generatedImage, name)}
          >
            <img 
              src={generatedImage} 
              alt={name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
              <Maximize2 className="w-8 h-8 text-white opacity-80" />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
            {isGeneratingImage ? (
              <div className="flex flex-col items-center animate-pulse">
                 <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
                 <span className="text-xs text-indigo-400 uppercase tracking-widest font-semibold">Rendering...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-600 group-hover:text-gray-500 transition-colors">
                 <Camera className="w-10 h-10 mb-2 opacity-50" />
                 <span className="text-xs uppercase tracking-widest font-semibold">No Visual Data</span>
              </div>
            )}
          </div>
        )}
        
        {/* Mood Overlay - Simplified */}
        <div className="absolute top-0 left-0 p-3 pointer-events-none">
             <span className="text-[10px] uppercase tracking-wider text-indigo-300 font-bold bg-black/60 px-2 py-1 rounded backdrop-blur-md border border-white/10">
                {id}
             </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col relative z-10 bg-gray-900">
        <div className="mb-3">
             <h3 className="text-xl font-bold text-white cinematic-font group-hover:text-indigo-300 transition-colors leading-tight">{name}</h3>
             <span className="text-sm text-gray-500 font-normal">({name_ko})</span>
        </div>
        
        <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold flex flex-col gap-1 mb-4">
             <span className="flex items-center gap-1 text-gray-300"><MapPin className="w-3 h-3" /> {role}</span>
             <span className="text-[10px] text-gray-600 pl-4">({role_ko})</span>
        </div>

        <div className="mb-4">
           <p className="text-sm text-gray-400 italic border-l-2 border-indigo-900 pl-3 leading-relaxed">
             "{story_hint}"
           </p>
           <p className="text-xs text-gray-600 pl-3.5 mt-1">
             ({story_hint_ko})
           </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-2">
            {mood.split('/').map((m, idx) => (
              <span key={idx} className="text-[10px] px-2 py-1 bg-gray-800 rounded-full text-gray-300 border border-gray-700">
                {m.trim()}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-gray-600">({mood_ko})</p>
        </div>

        <div className="mt-auto space-y-3">
          {showSettings && (
             <div className="animate-in slide-in-from-bottom-2 fade-in duration-200">
                <textarea
                   value={customPrompt}
                   onChange={(e) => setCustomPrompt(e.target.value)}
                   placeholder="Add specific details (e.g. raining, night)...&#13;&#10;추가할 디테일을 입력하세요..."
                   className="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-xs text-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none h-20 placeholder:text-gray-600 leading-relaxed"
                />
             </div>
          )}
          
          <div className="flex gap-2">
             <button
               onClick={handleGenerate}
               disabled={isGeneratingImage}
               className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-bold tracking-wide transition-all duration-200 uppercase
                 ${isGeneratingImage 
                   ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                   : generatedImage 
                     ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white'
                     : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                 } active:scale-[0.98]`}
             >
               {isGeneratingImage ? (
                 <>Generating... <RefreshCw className="w-3 h-3 animate-spin"/></>
               ) : generatedImage ? (
                 <>Re-Imagine <RefreshCw className="w-3 h-3"/></>
               ) : (
                 <>Visualize <Camera className="w-3 h-3"/></>
               )}
             </button>

             <button
                 onClick={() => setShowSettings(!showSettings)}
                 className={`px-3 rounded-lg border transition-all duration-200 flex items-center justify-center ${
                     showSettings 
                     ? 'bg-indigo-900/30 border-indigo-500 text-indigo-400' 
                     : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-600'
                 }`}
                 title="Refine Prompt (디테일 추가)"
             >
                 <Settings2 className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;