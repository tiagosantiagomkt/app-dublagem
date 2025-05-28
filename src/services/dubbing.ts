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

    // Adicionar interceptor para melhor tratamento de erros
    this.axiosInstance.interceptors.response.use(
      response => response,
      error => {
        if (axios.isAxiosError(error)) {
          if (!error.response) {
            throw new Error('Servidor não está respondendo. Verifique se o servidor Python está rodando em http://localhost:8000');
          }
          const message = error.response.data?.error || error.response.data?.message || error.message;
          throw new Error(`Erro na requisição: ${message}`);
        }
        throw error;
      }
    );
  }

  async startDubbing(request: DubbingRequest): Promise<DubbingResponse> {
    try {
      // Verificar se o servidor está online antes de fazer a requisição
      await this.checkServerHealth();
      
      const response = await this.axiosInstance.post<DubbingResponse>(
        '/api/dub',
        request
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao iniciar dublagem:', error);
      throw new Error(error instanceof Error ? error.message : 'Erro ao iniciar processo de dublagem');
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
      throw new Error(error instanceof Error ? error.message : 'Erro ao verificar status da dublagem');
    }
  }

  private async checkServerHealth(): Promise<void> {
    try {
      await this.axiosInstance.get('/health');
    } catch (error) {
      throw new Error('Servidor de dublagem não está acessível. Certifique-se que o servidor Python está rodando com o comando: python backend/main.py');
    }
  }
}