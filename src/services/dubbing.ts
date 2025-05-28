import axios from 'axios';

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
        request
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao iniciar dublagem:', error);
      throw error;
    }
  }

  async checkStatus(taskId: string): Promise<DubbingResponse> {
    try {
      const response = await axios.get<DubbingResponse>(
        `${API_URL}/api/dub/${taskId}`
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar status da dublagem:', error);
      throw error;
    }
  }
} 