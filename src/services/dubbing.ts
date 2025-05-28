import axios from 'axios';

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
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: '/api', // Usando path relativo para trabalhar com o proxy do Vite
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  async startDubbing(request: DubbingRequest): Promise<DubbingResponse> {
    try {
      const response = await this.axiosInstance.post<DubbingResponse>(
        '/dub',
        request
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao iniciar dublagem:', error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new Error('Servidor não está respondendo. Verifique se o servidor Python está rodando.');
        }
        throw new Error(error.response.data?.message || 'Erro ao conectar com o servidor de dublagem');
      }
      throw new Error('Erro inesperado ao iniciar dublagem');
    }
  }

  async checkStatus(taskId: string): Promise<DubbingResponse> {
    try {
      const response = await this.axiosInstance.get<DubbingResponse>(
        `/dub/${taskId}`
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new Error('Servidor não está respondendo');
        }
        throw new Error(error.response.data?.message || 'Erro ao verificar status da dublagem');
      }
      throw new Error('Erro inesperado ao verificar status');
    }
  }
}