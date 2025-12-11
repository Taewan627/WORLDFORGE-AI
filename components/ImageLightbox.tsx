import React, { useEffect } from 'react';
import { X, Download } from 'lucide-react';

interface ImageLightboxProps {
  isOpen: boolean;
  imageUrl: string | null;
  altText: string;
  onClose: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ isOpen, imageUrl, altText, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `worldforge-ai-${altText.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10 z-[101]"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Container restricted to 960px as per requirements */}
      <div 
        className="relative max-w-[960px] w-full mx-4"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="relative group overflow-hidden rounded-lg shadow-2xl shadow-indigo-500/10 border border-gray-800 bg-gray-900">
          <img 
            src={imageUrl} 
            alt={altText} 
            className="w-full h-auto object-contain"
          />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-end">
             <div className="text-white">
                <p className="font-bold text-lg font-cinzel">{altText}</p>
                <p className="text-xs text-gray-300">Generated with Gemini</p>
             </div>
             <button
               onClick={handleDownload}
               className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95"
             >
               <Download className="w-4 h-4" />
               Download
             </button>
          </div>
        </div>
        
        {/* Mobile-friendly download button when hover isn't available */}
        <div className="flex md:hidden justify-center mt-6">
             <button
               onClick={handleDownload}
               className="flex items-center gap-2 px-8 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg font-medium shadow-lg active:bg-gray-700"
             >
               <Download className="w-5 h-5" />
               Download Image
             </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLightbox;