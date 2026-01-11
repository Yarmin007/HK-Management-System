import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { encodeAudio, decodeAudio, decodeAudioData } from '../services/geminiService';

const Talk: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close?.();
      sessionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    setIsActive(false);
    setIsConnecting(false);
  }, []);

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = {
                data: encodeAudio(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then((session) => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputCtx) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decodeAudio(base64Audio), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
            if (message.serverContent?.outputTranscription) {
              setTranscript(prev => [...prev, `AI: ${message.serverContent?.outputTranscription?.text}`]);
            }
            if (message.serverContent?.inputTranscription) {
              setTranscript(prev => [...prev, `Manager: ${message.serverContent?.inputTranscription?.text}`]);
            }
          },
          onerror: (e) => stopSession(),
          onclose: () => stopSession()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
          },
          systemInstruction: "You are the Housekeeping Supervisor Assistant for the Management System. Speak professionally.",
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    return () => stopSession();
  }, [stopSession]);

  return (
    <div className="h-full flex flex-col items-center justify-center p-10 space-y-12 animate-in zoom-in-95 duration-500">
      <div className="relative flex flex-col items-center space-y-12 w-full max-w-2xl">
        <header className="text-center space-y-4">
          <div className="inline-block px-5 py-2 bg-purple-50 text-[#702052] rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-100 mb-2">
            AI Operations Voice Link
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">
            Supervisor Link
          </h1>
          <p className="text-slate-500 font-bold max-w-sm mx-auto uppercase text-[10px] tracking-widest leading-relaxed">Natural language interaction for floor operations and audit tracking.</p>
        </header>

        <div className="relative">
          <div className={`absolute -inset-14 bg-[#702052]/10 rounded-full blur-[100px] transition-opacity duration-1000 ${isActive ? 'opacity-100 scale-150 animate-pulse' : 'opacity-0'}`}></div>
          <button
            onClick={isActive ? stopSession : startSession}
            disabled={isConnecting}
            className={`relative z-10 w-60 h-60 rounded-[64px] flex flex-col items-center justify-center gap-6 transition-all duration-500 border-8 shadow-2xl ${
              isActive 
                ? 'bg-[#702052] border-white text-white rotate-12 scale-110' 
                : 'bg-white border-slate-50 text-[#702052] hover:scale-105'
            }`}
          >
            {isConnecting ? (
              <div className="w-20 h-20 border-8 border-[#702052]/20 border-t-[#702052] rounded-full animate-spin"></div>
            ) : (
              <>
                <div className={`p-6 rounded-[32px] ${isActive ? 'bg-white/20' : 'bg-purple-50'}`}>
                    <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
                    {isActive ? (
                        <path d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zM17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                    )}
                    </svg>
                </div>
                <span className="font-black text-[11px] uppercase tracking-[0.4em]">{isActive ? 'ACTIVE' : 'START LINK'}</span>
              </>
            )}
          </button>
        </div>

        <div className="w-full bg-white border border-slate-200 rounded-[48px] p-12 min-h-[200px] max-h-[400px] overflow-y-auto shadow-sm">
          {transcript.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-4 opacity-40">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <p className="text-xs font-black uppercase tracking-[0.3em] italic">System Ready for Voice Command</p>
            </div>
          ) : (
            <div className="space-y-6">
                {transcript.map((line, i) => (
                <div key={i} className={`flex gap-4 items-start ${line.startsWith('Manager:') ? 'justify-end' : ''}`}>
                    <div className={`px-6 py-4 rounded-[28px] text-[13px] font-bold ${line.startsWith('Manager:') ? 'bg-[#702052] text-white rounded-tr-none shadow-lg shadow-[#702052]/20' : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'}`}>
                        {line.split(': ')[1]}
                    </div>
                </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Talk;