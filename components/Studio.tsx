
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { ImageResult } from '../types';

const Studio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<ImageResult[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const url = await generateImage(prompt);
      if (url) {
        setHistory([{
          id: Date.now().toString(),
          url,
          prompt,
          createdAt: Date.now()
        }, ...history]);
      }
    } catch (error) {
      console.error("Image generation failed", error);
    } finally {
      setIsGenerating(false);
      setPrompt('');
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-bold">Creative Studio</h1>
        <p className="text-slate-400 mt-1">Transform your ideas into stunning visuals instantly.</p>
      </header>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
        <div className="flex gap-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A surreal landscape where mountains are made of stacked books, bioluminescent rivers flowing between them..."
            className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] resize-none text-white"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 px-8 rounded-xl font-bold transition-all h-auto flex flex-col items-center justify-center gap-2 w-40 text-white shadow-lg shadow-indigo-500/20"
          >
            {isGenerating ? (
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Generate</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((img) => (
          <div key={img.id} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden group hover:border-indigo-500/50 transition-all shadow-xl">
            <div className="aspect-square relative overflow-hidden bg-slate-900">
              <img src={img.url} alt={img.prompt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end gap-3">
                <p className="text-sm text-slate-200 line-clamp-3 italic">"{img.prompt}"</p>
                <button 
                  onClick={() => handleDownload(img.url, `aura-art-${img.id}.png`)}
                  className="bg-white text-slate-950 font-bold py-2 px-4 rounded-xl text-xs hover:bg-slate-200 transition-colors w-full flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export PNG
                </button>
              </div>
            </div>
          </div>
        ))}

        {history.length === 0 && !isGenerating && (
          <div className="col-span-full py-32 flex flex-col items-center opacity-30 border-2 border-dashed border-slate-700 rounded-3xl">
            <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xl font-medium tracking-tight">Your creative canvas awaits</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Studio;
