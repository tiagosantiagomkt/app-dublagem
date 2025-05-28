import axios from 'axios';

// Ensure we're using the correct protocol based on the environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface DubbingRequest {
  url: string;
  target_language: string;
  voice_id: string;
  remove_background_noise: boolean;
  auto_sync: boolean;
}

export interface DubbingResponse {
  task_id: string;
  status: string;
  output_url: string | null;
  progress: number;
  error: string | null;
}

export class DubbingService {
  async startDubbing(request: DubbingRequest): Promise<DubbingResponse> {
    try {
      const response = await axios.post<DubbingResponse>(
        `${API_URL}/api/dub`,
        request,
        {
          // Add additional headers and configuration for better error handling
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 second timeout
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao iniciar dublagem:', error);
      if (axios.isAxiosError(error) && !error.response) {
        throw new Error('Erro de conexão com o servidor. Por favor, verifique se o servidor está rodando e tente novamente.');
      }
      throw error;
    }
  }

  async checkStatus(taskId: string): Promise<DubbingResponse> {
    try {
      const response = await axios.get<DubbingResponse>(
        `${API_URL}/api/dub/${taskId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 second timeout
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar status da dublagem:', error);
      if (axios.isAxiosError(error) && !error.response) {
        throw new Error('Erro de conexão com o servidor. Por favor, verifique se o servidor está rodando e tente novamente.');
      }
      throw error;
    }
  }
}