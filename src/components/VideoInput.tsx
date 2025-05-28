import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LinkIcon, SearchIcon } from 'lucide-react';
import { VideoLinkData } from '../types';
import { validateVideoUrl } from '../utils/videoUtils';

interface VideoInputProps {
  onSubmit: (data: VideoLinkData) => void;
}

const VideoInput: React.FC<VideoInputProps> = ({ onSubmit }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!videoUrl.trim()) {
      setError('Por favor, insira uma URL de vídeo');
      return;
    }
    
    // Validate the URL format
    if (!validateVideoUrl(videoUrl)) {
      setError('URL de vídeo inválida. Por favor, insira um link válido do YouTube, Vimeo ou outro serviço de vídeo.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, we would fetch video metadata here
      // For now, we'll simulate a short delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in a real app, this would come from an API
      const videoData: VideoLinkData = {
        url: videoUrl,
        title: 'Título do Vídeo',
        duration: 120,
        thumbnailUrl: 'https://images.pexels.com/photos/2833366/pexels-photo-2833366.jpeg?auto=compress&cs=tinysrgb&w=600'
      };
      
      onSubmit(videoData);
    } catch (err) {
      setError('Falha ao processar o vídeo. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Cole o link do seu vídeo</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LinkIcon className="h-5 w-5 text-gray-400" />
          </div>
          
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 outline-none text-gray-800 placeholder-gray-400 text-sm sm:text-base"
          />
        </div>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm"
          >
            {error}
          </motion.p>
        )}
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium transition-all duration-200 disabled:opacity-70 text-sm sm:text-base"
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            </div>
          ) : (
            <div className="flex items-center">
              <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Processar Vídeo
            </div>
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default VideoInput;