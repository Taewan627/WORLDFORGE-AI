import React, { useState } from 'react';
import { World } from './types';
import { generateWorldData, generateLocationImage } from './services/geminiService';
import WorldDisplay from './components/WorldDisplay';
import ImageLightbox from './components/ImageLightbox';
import { Zap, Globe, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [seed, setSeed] = useState('');
  const [world, setWorld] = useState<World | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<{ url: string; alt: string } | null>(null);

  const handleGenerateWorld = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seed.trim()) return;

    setLoading(true);
    setError(null);
    setWorld(null);

    try {
      const data = await generateWorldData(seed);
      setWorld(data);
    } catch (err: any) {
      setError("Failed to forge the world. The ether is disrupted. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async (locationId: string, prompt: string) => {
    if (!world) return;

    // Update state to show loading for this specific location
    setWorld(prevWorld => {
      if (!prevWorld) return null;
      return {
        ...prevWorld,
        locations: prevWorld.locations.map(loc => 
          loc.id === locationId ? { ...loc, isGeneratingImage: true } : loc
        )
      };
    });

    try {
      const base64Image = await generateLocationImage(prompt);
      
      setWorld(prevWorld => {
        if (!prevWorld) return null;
        return {
          ...prevWorld,
          locations: prevWorld.locations.map(loc => 
            loc.id === locationId ? { ...loc, isGeneratingImage: false, generatedImage: base64Image } : loc
          )
        };
      });
    } catch (err) {
      console.error("Failed to generate image", err);
      // Reset loading state on error
      setWorld(prevWorld => {
        if (!prevWorld) return null;
        return {
          ...prevWorld,
          locations: prevWorld.locations.map(loc => 
            loc.id === locationId ? { ...loc, isGeneratingImage: false } : loc
          )
        };
      });
      alert("Visual generation failed. The signal was lost.");
    }
  };

  const handleExpandImage = (url: string, alt: string) => {
    setExpandedImage({ url, alt });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-indigo-500" />
            <span className="text-xl font-bold tracking-tight cinematic-font">WORLDFORGE AI</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        {/* Hero / Input Section */}
        {!world && !loading && (
          <div className="flex-grow flex flex-col items-center justify-center p-4">
             <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-bold cinematic-font text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">
                    Dream Worlds.
                  </h1>
                  <p className="text-lg text-gray-400 font-light">
                    Enter a seed concept. We will forge the lore, the locations, and the visuals.
                  </p>
                </div>

                <form onSubmit={handleGenerateWorld} className="relative max-w-xl mx-auto w-full">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative flex items-stretch">
                      <input
                        type="text"
                        value={seed}
                        onChange={(e) => setSeed(e.target.value)}
                        placeholder="e.g., A cyberpunk city built inside a giant dead robot..."
                        className="block w-full rounded-l-lg border-0 bg-gray-900 py-4 pl-4 pr-4 text-white ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 shadow-2xl"
                      />
                      <button
                        type="submit"
                        disabled={!seed.trim()}
                        className="flex items-center gap-2 rounded-r-lg bg-indigo-600 px-6 py-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <Zap className="w-4 h-4 fill-current" />
                        Forge
                      </button>
                    </div>
                  </div>
                </form>

                <div className="grid grid-cols-3 gap-4 text-xs text-gray-600 mt-12 max-w-lg mx-auto">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center">1</div>
                        <span>Input Seed</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center">2</div>
                        <span>Generate Lore</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center">3</div>
                        <span>Visualize</span>
                    </div>
                </div>
             </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex-grow flex flex-col items-center justify-center p-8 space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-indigo-500/20 rounded-full blur-md animate-pulse"></div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold cinematic-font animate-pulse">Constructing Reality...</h2>
              <p className="text-gray-500 text-sm">Weaving history, geography, and atmosphere.</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex-grow flex items-center justify-center p-4">
            <div className="bg-red-950/30 border border-red-900/50 p-6 rounded-lg max-w-md text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-red-200 mb-2">Generation Failed</h3>
              <p className="text-red-400 text-sm mb-4">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="px-4 py-2 bg-red-900/50 hover:bg-red-800/50 text-red-200 rounded border border-red-800 transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Results Display */}
        {world && !loading && (
           <div className="pt-8">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
                <button 
                  onClick={() => setWorld(null)}
                  className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2"
                >
                  ← Forge New World
                </button>
             </div>
             <WorldDisplay 
               world={world} 
               onGenerateImage={handleGenerateImage} 
               onExpandImage={handleExpandImage}
             />
           </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-6 mt-12 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} WorldForge AI. Built with Gemini AI.</p>
        </div>
      </footer>

      {/* Lightbox */}
      <ImageLightbox 
        isOpen={!!expandedImage}
        imageUrl={expandedImage?.url || null}
        altText={expandedImage?.alt || ''}
        onClose={() => setExpandedImage(null)}
      />
    </div>
  );
};

export default App;