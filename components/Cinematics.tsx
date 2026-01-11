
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { VideoResult } from '../types';

// The window.aistudio global declaration is removed to avoid conflict with the environment's existing AIStudio type definition.

const Cinematics: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [videos, setVideos] = useState<VideoResult[]>([]);
  const [showKeyPrompt, setShowKeyPrompt] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      // Use existing global aistudio provided by the environment
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      setShowKeyPrompt(!hasKey);
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    // Open the key selection dialog and immediately proceed to avoid race conditions
    await (window as any).aistudio.openSelectKey();
    setShowKeyPrompt(false);
  };

  const generateVideo = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setStatusMessage('Initiating cinematic render...');
    
    try {
      // Create a fresh instance to ensure the most up-to-date API key is used
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const statusUpdates = [
        'Directing the scene...',
        'Synthesizing temporal frames...',
        'Applying motion vectors...',
        'Polishing lighting and atmosphere...',
        'Finalizing render output...'
      ];

      let updateIdx = 0;
      const interval = setInterval(() => {
        setStatusMessage(statusUpdates[updateIdx % statusUpdates.length]);
        updateIdx++;
      }, 8000);

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      clearInterval(interval);
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      
      if (downloadLink) {
        // Must append API key when fetching from the download link
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        setVideos([{
          id: Date.now().toString(),
          url,
          prompt,
          createdAt: Date.now()
        }, ...videos]);
      }
    } catch (error: any) {
      console.error("Video generation failed", error);
      // Reset the key selection prompt if the API key is invalid or from an unpaid project
      if (error?.message?.includes("Requested entity was not found")) {
        setShowKeyPrompt(true);
      }
      setStatusMessage('Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
      setPrompt('');
    }
  };

  if (showKeyPrompt) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center text-indigo-400">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-bold">Premium Feature Access</h2>
          <p className="text-slate-400">Cinematic video generation requires a paid API key from a Google Cloud Project with billing enabled.</p>
          <p className="text-xs text-slate-500">Visit <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline hover:text-indigo-400">billing documentation</a> for details.</p>
        </div>
        <button
          onClick={handleSelectKey}
          className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-xl font-bold transition-all"
        >
          Select Billing Key
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-bold">Aura Cinematics</h1>
        <p className="text-slate-400 mt-1">High-fidelity video synthesis powered by Veo 3.1.</p>
      </header>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex gap-4 relative z-10">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A cinematic drone shot of a misty pine forest at sunrise, 4k, hyper-realistic..."
            className="flex-1 bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] resize-none text-white"
          />
          <button
            onClick={generateVideo}
            disabled={isGenerating || !prompt.trim()}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 px-8 rounded-xl font-bold transition-all h-auto flex flex-col items-center justify-center gap-2 w-40"
          >
            {isGenerating ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Render</span>
              </>
            )}
          </button>
        </div>
        {isGenerating && (
          <div className="mt-4 flex items-center gap-3 text-indigo-400 animate-pulse">
            <span className="text-sm font-medium">{statusMessage}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {videos.map((vid) => (
          <div key={vid.id} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden group hover:border-indigo-500/50 transition-all shadow-xl">
            <div className="aspect-video relative bg-black">
              <video 
                src={vid.url} 
                className="w-full h-full object-contain" 
                controls 
                autoPlay 
                loop 
                muted
              />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                  href={vid.url} 
                  download={`aura-video-${vid.id}.mp4`}
                  className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="p-4 bg-slate-900/50">
              <p className="text-sm text-slate-300 line-clamp-1 italic">"{vid.prompt}"</p>
              <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">Generated via Veo 3.1 Fast</p>
            </div>
          </div>
        ))}

        {videos.length === 0 && !isGenerating && (
          <div className="col-span-full py-24 flex flex-col items-center opacity-30 border-2 border-dashed border-slate-700 rounded-3xl">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg font-medium">No cinematic renders yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cinematics;
