import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import VideoInput from './VideoInput';
import VideoPlayer from './VideoPlayer';
import DubbingControls from './DubbingControls';
import SignupModal from './SignupModal';
import LoginModal from './LoginModal';
import SubscriptionModal from './SubscriptionModal';
import { VideoLinkData, VoiceOption } from '../types';
import { authService } from '../services/auth';
import { paymentService } from '../services/payment';
import { DubbingService } from '../services/dubbing';

const dubbingService = new DubbingService();

const VideoSection: React.FC = () => {
  const [videoData, setVideoData] = useState<VideoLinkData | null>(null);
  const [isDubbing, setIsDubbing] = useState(false);
  const [dubbingProgress, setDubbingProgress] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>({
    id: 'default',
    name: 'Voz Padrão',
    language: 'pt-BR'
  });
  const [dubbedVideoUrl, setDubbedVideoUrl] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVideoLinkSubmit = (data: VideoLinkData) => {
    setVideoData(data);
    setDubbedVideoUrl(null);
    setError(null);
  };

  const handleStartDubbing = async () => {
    if (!videoData) return;

    const user = await authService.getCurrentUser();
    
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    setIsDubbing(true);
    setDubbingProgress(0);
    setError(null);
    
    try {
      // Iniciar processo de dublagem
      const response = await dubbingService.startDubbing({
        url: videoData.url,
        target_language: selectedVoice.language,
        voice_id: selectedVoice.id,
        remove_background_noise: true,
        auto_sync: true
      });

      setCurrentTaskId(response.task_id);

      // Iniciar polling do status
      const pollInterval = setInterval(async () => {
        try {
          const status = await dubbingService.checkStatus(response.task_id);
          setDubbingProgress(status.progress);

          if (status.status === 'completed') {
            clearInterval(pollInterval);
            setIsDubbing(false);
            setDubbedVideoUrl(status.output_url);
          } else if (status.status === 'failed') {
            clearInterval(pollInterval);
            setIsDubbing(false);
            setError(status.error || 'Erro ao processar o vídeo');
          }
        } catch (error) {
          clearInterval(pollInterval);
          setIsDubbing(false);
          setError('Erro ao verificar status da dublagem');
        }
      }, 2000);

    } catch (error) {
      console.error('Erro ao processar o vídeo:', error);
      setIsDubbing(false);
      setError('Erro ao iniciar processo de dublagem');
    }
  };

  const handleSignup = async (email: string, password: string) => {
    try {
      await authService.signup(email, password);
      setShowSignupModal(false);
      handleStartDubbing();
    } catch (error) {
      throw error;
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      await authService.login(email, password);
      setShowLoginModal(false);
      handleStartDubbing();
    } catch (error) {
      throw error;
    }
  };

  const handleSubscribe = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        await paymentService.startSubscription(user.id);
        setShowSubscriptionModal(false);
      }
    } catch (error) {
      console.error('Erro ao iniciar assinatura:', error);
    }
  };

  const switchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  const switchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  // Limpar intervalos ao desmontar
  useEffect(() => {
    return () => {
      if (currentTaskId) {
        // Aqui você pode implementar uma lógica para cancelar a tarefa no backend se necessário
      }
    };
  }, [currentTaskId]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-light-200 rounded-xl overflow-hidden shadow-lg border border-gray-200"
      >
        <div className="p-4 sm:p-6">
          <VideoInput onSubmit={handleVideoLinkSubmit} />
        </div>
        
        {videoData && (
          <div className="px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-light-100 rounded-lg overflow-hidden shadow-md"
                >
                  <VideoPlayer url={dubbedVideoUrl || videoData.url} />
                </motion.div>
              </div>
              
              <div className="w-full lg:w-1/3">
                <DubbingControls
                  onStartDubbing={handleStartDubbing}
                  isDubbing={isDubbing}
                  progress={dubbingProgress}
                  selectedVoice={selectedVoice}
                  onVoiceChange={setSelectedVoice}
                  dubbedVideoUrl={dubbedVideoUrl}
                  error={error}
                />
              </div>
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Recent history section - would be populated in a real app */}
      {videoData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 sm:mt-10"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800 px-4 sm:px-0">Dublagens Recentes</h2>
          <div className="bg-light-200 rounded-lg p-4 border border-gray-200">
            <p className="text-gray-600 text-center py-2">Suas dublagens recentes aparecerão aqui</p>
          </div>
        </motion.div>
      )}

      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSubmit={handleSignup}
        onSwitchToLogin={switchToLogin}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onSwitchToSignup={switchToSignup}
      />

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onSubscribe={handleSubscribe}
      />
    </div>
  );
};

export default VideoSection;