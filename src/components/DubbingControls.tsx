import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, Languages, Download, AlertCircle } from 'lucide-react';
import { VoiceOption } from '../types';

interface DubbingControlsProps {
  onStartDubbing: () => void;
  isDubbing: boolean;
  progress: number;
  selectedVoice: VoiceOption;
  onVoiceChange: (voice: VoiceOption) => void;
  dubbedVideoUrl: string | null;
  error: string | null;
}

const DubbingControls: React.FC<DubbingControlsProps> = ({
  onStartDubbing,
  isDubbing,
  progress,
  selectedVoice,
  onVoiceChange,
  dubbedVideoUrl,
  error
}) => {
  const voiceOptions: VoiceOption[] = [
    { id: 'default', name: 'Voz Padrão', language: 'pt-BR' },
    { id: 'male1', name: 'Voz Masculina 1', language: 'pt-BR' },
    { id: 'female1', name: 'Voz Feminina 1', language: 'pt-BR' },
    { id: 'female2', name: 'Voz Feminina 2', language: 'pt-BR' },
    { id: 'male_es', name: 'Voz Masculina Espanhol', language: 'es-ES' },
    { id: 'female_fr', name: 'Voz Feminina Francês', language: 'fr-FR' },
  ];

  return (
    <div className="bg-light-100 rounded-lg p-4 sm:p-5 shadow-md border border-gray-200">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center text-gray-800">
        <Volume2 className="mr-2 text-primary-400" size={20} />
        Opções de Dublagem
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center">
            <Languages className="mr-2 text-secondary-400" size={16} />
            Selecionar Voz
          </label>
          <select
            value={selectedVoice.id}
            onChange={(e) => {
              const selected = voiceOptions.find(v => v.id === e.target.value);
              if (selected) onVoiceChange(selected);
            }}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 outline-none text-gray-800 text-sm sm:text-base"
            disabled={isDubbing}
          >
            {voiceOptions.map(voice => (
              <option key={voice.id} value={voice.id}>
                {voice.name} ({voice.language})
              </option>
            ))}
          </select>
        </div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm flex items-start"
          >
            <AlertCircle className="mr-2 flex-shrink-0 mt-0.5" size={16} />
            <span>{error}</span>
          </motion.div>
        )}
        
        {isDubbing ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Dublagem em andamento...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full"
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs text-gray-500 italic">Por favor, aguarde enquanto processamos seu vídeo</p>
          </div>
        ) : dubbedVideoUrl ? (
          <div className="space-y-3 sm:space-y-4">
            <p className="text-green-600 font-medium text-sm sm:text-base flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Dublagem concluída!
            </p>
            
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={dubbedVideoUrl}
              download="video-dublado.mp4"
              className="w-full flex items-center justify-center bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base"
            >
              <Download className="mr-2" size={16} />
              Baixar Vídeo Dublado
            </motion.a>
            
            <button
              onClick={onStartDubbing}
              className="w-full py-2 sm:py-2.5 px-3 sm:px-4 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors duration-200 text-sm sm:text-base"
            >
              Dublar Novamente
            </button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartDubbing}
            className="w-full flex items-center justify-center bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base"
          >
            <Volume2 className="mr-2" size={16} />
            Iniciar Dublagem
          </motion.button>
        )}
        
        <div className="pt-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Opções Adicionais</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="remove-background"
                type="checkbox"
                className="w-4 h-4 rounded bg-white border-gray-300 text-primary-600 focus:ring-primary-500"
                disabled={isDubbing}
                defaultChecked
              />
              <label htmlFor="remove-background" className="ml-2 text-sm text-gray-600">
                Remover ruído de fundo
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="auto-sync"
                type="checkbox"
                className="w-4 h-4 rounded bg-white border-gray-300 text-primary-600 focus:ring-primary-500"
                defaultChecked
                disabled={isDubbing}
              />
              <label htmlFor="auto-sync" className="ml-2 text-sm text-gray-600">
                Sincronizar automaticamente com movimentos labiais
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DubbingControls;