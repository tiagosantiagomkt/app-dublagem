import os
import asyncio
from pathlib import Path
import yt_dlp
import whisper
import ffmpeg
import argostranslate.package
import argostranslate.translate
from TTS.api import TTS
import torch

class DubbingService:
    def __init__(self):
        # Inicializar Whisper
        self.whisper_model = whisper.load_model("base")
        
        # Inicializar TTS
        self.tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
        
        # Configurar Argos Translate
        argostranslate.package.update_package_index()
        available_packages = argostranslate.package.get_available_packages()
        package_to_install = next(
            filter(
                lambda x: x.from_code == "en" and x.to_code == "pt",
                available_packages
            )
        )
        argostranslate.package.install_from_path(package_to_install.download())
    
    async def process_video(
        self,
        url: str,
        work_dir: Path,
        target_language: str,
        voice_id: str,
        remove_background_noise: bool,
        auto_sync: bool,
        progress_callback
    ) -> Path:
        try:
            # 1. Download do vídeo (10%)
            progress_callback(0)
            video_path = await self._download_video(url, work_dir)
            progress_callback(10)
            
            # 2. Extrair áudio (20%)
            audio_path = work_dir / "audio.wav"
            await self._extract_audio(video_path, audio_path, remove_background_noise)
            progress_callback(20)
            
            # 3. Transcrever áudio (40%)
            transcription = await self._transcribe_audio(audio_path)
            progress_callback(40)
            
            # 4. Traduzir texto (60%)
            translated_text = await self._translate_text(transcription["text"])
            progress_callback(60)
            
            # 5. Gerar áudio dublado (80%)
            dubbed_audio_path = work_dir / "dubbed_audio.wav"
            await self._generate_audio(translated_text, dubbed_audio_path, voice_id)
            progress_callback(80)
            
            # 6. Mesclar áudio com vídeo (100%)
            output_path = work_dir / "output.mp4"
            await self._merge_audio_video(video_path, dubbed_audio_path, output_path, auto_sync)
            progress_callback(100)
            
            return output_path
            
        except Exception as e:
            print(f"Erro no processo de dublagem: {str(e)}")
            raise
    
    async def _download_video(self, url: str, work_dir: Path) -> Path:
        output_path = work_dir / "video.mp4"
        ydl_opts = {
            'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
            'outtmpl': str(output_path),
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        
        return output_path
    
    async def _extract_audio(self, video_path: Path, output_path: Path, remove_noise: bool):
        # Extrair áudio com ffmpeg
        stream = ffmpeg.input(str(video_path))
        
        if remove_noise:
            # Aplicar filtros de redução de ruído
            stream = stream.filter('afftdn')  # Redução de ruído FFT
        
        stream = stream.output(str(output_path), acodec='pcm_s16le', ac=1, ar='16k')
        await asyncio.to_thread(ffmpeg.run, stream, overwrite_output=True)
    
    async def _transcribe_audio(self, audio_path: Path) -> dict:
        return await asyncio.to_thread(
            self.whisper_model.transcribe,
            str(audio_path),
            language="en"
        )
    
    async def _translate_text(self, text: str) -> str:
        # Usar Argos Translate para tradução
        translated = argostranslate.translate.translate(text, "en", "pt")
        return translated
    
    async def _generate_audio(self, text: str, output_path: Path, voice_id: str):
        # Gerar áudio com TTS
        await asyncio.to_thread(
            self.tts.tts_to_file,
            text=text,
            file_path=str(output_path),
            speaker_wav=f"voices/{voice_id}.wav",
            language="pt"
        )
    
    async def _merge_audio_video(
        self,
        video_path: Path,
        audio_path: Path,
        output_path: Path,
        auto_sync: bool
    ):
        video = ffmpeg.input(str(video_path))
        audio = ffmpeg.input(str(audio_path))
        
        if auto_sync:
            # Adicionar filtros para sincronização labial (simplificado)
            audio = audio.filter('aresample', 44100)
        
        stream = ffmpeg.output(
            video,
            audio,
            str(output_path),
            vcodec='copy',
            acodec='aac'
        )
        await asyncio.to_thread(ffmpeg.run, stream, overwrite_output=True) 