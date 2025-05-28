# App de Dublagem Automática

Este é um aplicativo web que permite dublar vídeos automaticamente usando inteligência artificial.

## Funcionalidades

- Upload de vídeos via URL (YouTube, Vimeo, etc.)
- Transcrição automática usando Whisper
- Tradução automática para português
- Geração de voz usando TTS (Text-to-Speech)
- Sincronização labial automática
- Redução de ruído de fundo
- Interface moderna e responsiva

## Pré-requisitos

- Node.js 18+
- Python 3.8+
- FFmpeg instalado no sistema

## Instalação

### Backend (Python)

1. Entre no diretório do backend:
```bash
cd backend
```

2. Crie um ambiente virtual:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Inicie o servidor:
```bash
uvicorn main:app --reload
```

### Frontend (React/TypeScript)

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Uso

1. Acesse o aplicativo em `http://localhost:5173`
2. Cole o link do vídeo que deseja dublar
3. Selecione a voz desejada
4. Clique em "Iniciar Dublagem"
5. Aguarde o processamento
6. Baixe o vídeo dublado

## Estrutura do Projeto

```
.
├── backend/
│   ├── main.py           # API FastAPI
│   ├── dubbing.py        # Serviço de dublagem
│   └── requirements.txt  # Dependências Python
├── src/
│   ├── components/       # Componentes React
│   ├── services/        # Serviços de API
│   └── types/          # Tipos TypeScript
└── README.md
```

## Tecnologias Utilizadas

- Frontend:
  - React
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - Axios

- Backend:
  - FastAPI
  - Whisper (OpenAI)
  - Argos Translate
  - Coqui TTS
  - FFmpeg
  - yt-dlp

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes. 