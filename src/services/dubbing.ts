import axios from 'axios';

const API_URL = 'http://localhost:8000';

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
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  async startDubbing(request: DubbingRequest): Promise<DubbingResponse> {
    try {
      // Primeiro, verifica se o servidor está online
      await this.checkServerHealth();
      
      const response = await this.axiosInstance.post<DubbingResponse>(
        '/api/dub',
        request
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao iniciar dublagem:', error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new Error('Servidor não está respondendo. Verifique se o servidor backend está rodando em http://localhost:8000');
        }
        if (error.response.status === 404) {
          throw new Error('API de dublagem não encontrada. Verifique se o servidor está configurado corretamente.');
        }
        throw new Error(`Erro ao iniciar dublagem: ${error.response.data?.message || error.message}`);
      }
      throw new Error('Erro inesperado ao iniciar dublagem');
    }
  }

  async checkStatus(taskId: string): Promise<DubbingResponse> {
    try {
      const response = await this.axiosInstance.get<DubbingResponse>(
        `/api/dub/${taskId}`
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new Error('Servidor não está respondendo');
        }
        throw new Error(`Erro ao verificar status: ${error.response.data?.message || error.message}`);
      }
      throw new Error('Erro inesperado ao verificar status');
    }
  }

  private async checkServerHealth(): Promise<void> {
    try {
      await this.axiosInstance.get('/health', { timeout: 5000 });
    } catch (error) {
      throw new Error('Servidor de dublagem não está acessível. Verifique se o servidor backend está rodando.');
    }
  }
}