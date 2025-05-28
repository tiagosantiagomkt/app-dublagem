import os
import shutil
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional
from pathlib import Path
import uuid
import asyncio
from dubbing import DubbingService

# Criar diretórios necessários
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR = Path("output")
OUTPUT_DIR.mkdir(exist_ok=True)
VOICES_DIR = Path("voices")
VOICES_DIR.mkdir(exist_ok=True)

app = FastAPI(title="Video Dubbing API")

# Montar diretório de saída para servir os vídeos
app.mount("/output", StaticFiles(directory="output"), name="output")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique os domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DubbingRequest(BaseModel):
    url: str
    target_language: str = "pt-BR"
    voice_id: str
    remove_background_noise: bool = False
    auto_sync: bool = True

class DubbingResponse(BaseModel):
    task_id: str
    status: str
    output_url: Optional[str] = None
    progress: int = 0
    error: Optional[str] = None

# Armazenar tarefas em memória (em produção, use um banco de dados)
dubbing_tasks = {}
dubbing_service = None

@app.on_event("startup")
async def startup_event():
    global dubbing_service
    dubbing_service = DubbingService()

@app.post("/api/dub", response_model=DubbingResponse)
async def start_dubbing(request: DubbingRequest):
    task_id = str(uuid.uuid4())
    dubbing_tasks[task_id] = {
        "status": "processing",
        "progress": 0,
        "output_url": None,
        "error": None
    }
    
    # Iniciar processo de dublagem em background
    asyncio.create_task(process_dubbing(task_id, request))
    
    return DubbingResponse(
        task_id=task_id,
        status="processing",
        progress=0
    )

@app.get("/api/dub/{task_id}", response_model=DubbingResponse)
async def get_dubbing_status(task_id: str):
    if task_id not in dubbing_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = dubbing_tasks[task_id]
    return DubbingResponse(
        task_id=task_id,
        status=task["status"],
        output_url=task["output_url"],
        progress=task["progress"],
        error=task["error"]
    )

async def process_dubbing(task_id: str, request: DubbingRequest):
    try:
        # Criar diretório temporário para este trabalho
        work_dir = UPLOAD_DIR / task_id
        work_dir.mkdir(exist_ok=True)
        
        def update_progress(progress: int):
            dubbing_tasks[task_id]["progress"] = progress
        
        # Processar dublagem
        output_path = await dubbing_service.process_video(
            request.url,
            work_dir,
            request.target_language,
            request.voice_id,
            request.remove_background_noise,
            request.auto_sync,
            update_progress
        )
        
        # Mover arquivo para diretório de saída
        final_path = OUTPUT_DIR / f"{task_id}.mp4"
        shutil.move(output_path, final_path)
        
        # Atualizar status
        dubbing_tasks[task_id].update({
            "status": "completed",
            "progress": 100,
            "output_url": f"/output/{task_id}.mp4"
        })
        
    except Exception as e:
        print(f"Erro no processo de dublagem: {str(e)}")
        dubbing_tasks[task_id].update({
            "status": "failed",
            "error": str(e)
        })
    finally:
        # Limpar arquivos temporários
        if work_dir.exists():
            shutil.rmtree(work_dir)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 