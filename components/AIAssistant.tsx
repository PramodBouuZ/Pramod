import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Type, FunctionDeclaration, Blob } from '@google/genai';
import { decode, encode, decodeAudioData } from '../utils/audio';
import MicrophoneIcon from './icons/MicrophoneIcon';
import CloseIcon from './icons/CloseIcon';
import type { Lead } from '../types';

interface AIAssistantProps {
  onAIGeneratedLead: (lead: Omit<Lead, 'id' | 'postedAt' | 'status' | 'unlocked'>) => void;
}

type TranscriptItem = {
  type: 'user' | 'model' | 'status' | 'error';
  text: string;
  timestamp: Date;
};

const AIAssistant: React.FC<AIAssistantProps> = ({ onAIGeneratedLead }) => {
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [sessionState, setSessionState] = useState<'inactive' | 'connecting' | 'active' | 'error'>('inactive');
  const [statusText, setStatusText] = useState('Idle');
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  
  const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef(0);

  const addTranscript = (type: TranscriptItem['type'], text: string) => {
    if (text.trim() === '') return;
    setTranscript(prev => [...prev, { type, text, timestamp: new Date() }]);
  };

  useEffect(() => {
    const transcriptPanel = document.getElementById('transcript-panel');
    if (transcriptPanel) {
      transcriptPanel.scrollTop = transcriptPanel.scrollHeight;
    }
  }, [transcript]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSession();
    };
  }, []);

  const stopSession = () => {
    if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => session.close());
        sessionPromiseRef.current = null;
    }
    if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current = null;
    }
    if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
    }
    if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
        outputAudioContextRef.current.close();
        outputAudioContextRef.current = null;
    }
    setSessionState('inactive');
    setStatusText('Idle');
    setTranscript([]);
  };

  const startSession = async () => {
    if (sessionState !== 'inactive') return;

    setSessionState('connecting');
    setStatusText('Connecting...');
    addTranscript('status', 'Initializing AI Assistant...');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      outputAudioContextRef.current = new AudioContext({ sampleRate: 24000 });
      nextStartTimeRef.current = 0;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const captureLeadFunction: FunctionDeclaration = {
          name: 'captureLeadDetails',
          description: 'Captures the user\'s contact and BANT details after they have confirmed them. This is the final step.',
          parameters: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: 'The full name of the user.' },
              companyName: { type: Type.STRING, description: 'The user\'s company name.' },
              email: { type: Type.STRING, description: 'The user\'s email address.' },
              phone: { type: Type.STRING, description: 'The user\'s phone number.' },
              title: { type: Type.STRING, description: 'A concise title for the user\'s requirement.' },
              description: { type: Type.STRING, description: 'A summary of the user\'s requirement.' },
              budget: { type: Type.NUMBER, description: 'The user\'s budget for the project.' },
              authority: { type: Type.STRING, description: 'The user\'s decision-making authority (e.g., Decision Maker, Influencer).' },
              need: { type: Type.STRING, description: 'The urgency of the user\'s need (e.g., High, Medium).' },
              timeframe: { type: Type.STRING, description: 'The project timeframe (e.g., Immediately, 1-3 Months).' },
            },
            required: ['name', 'companyName', 'email', 'phone', 'title', 'description', 'budget', 'authority', 'need', 'timeframe']
          }
      };

      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          tools: [{ functionDeclarations: [captureLeadFunction] }],
          systemInstruction: `You are a friendly and professional sales assistant for "BANT Confirm". Your primary goal is to qualify a user's business requirement by analyzing it against BANT criteria (Budget, Authority, Need, Timeframe) and then capture their details to create a lead.

Your conversation flow MUST follow these steps precisely:
1.  **Greeting & Initial Query**: Greet the user warmly and ask about their business requirement.
2.  **Requirement Gathering**: Listen carefully to the user's needs. Ask clarifying questions to fully understand the scope, but avoid asking about BANT parameters directly at this stage.
3.  **BANT Analysis & Confirmation (CRITICAL STEP)**: After you have gathered enough information, you MUST summarize what you've understood in terms of BANT. For example, say: "Okay, based on what you've told me, here's what I've understood. Your budget is around X, you are the decision-maker, this is a high-priority need, and you're looking to implement this within Y months. Is that correct?". You MUST wait for the user to explicitly confirm ("yes", "that's right", etc.) before proceeding. Do NOT move to the next step without this confirmation.
4.  **Request Contact Details**: ONLY AFTER the user has confirmed the BANT summary, you can then ask for their contact information. Say something like: "Great! To create a formal enquiry for you, I'll just need a few details. Could you please provide your full name, company name, email address, and phone number?".
5.  **Function Call**: Once you have all the required contact details and the confirmed BANT information, call the 'captureLeadDetails' function with all the collected information.
6.  **Closing**: Thank the user and let them know their enquiry has been submitted for review.`
        },
        callbacks: {
          onopen: () => {
            setSessionState('active');
            setStatusText('Listening...');
            addTranscript('status', 'Connected. I\'m listening...');
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            scriptProcessorRef.current = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob: Blob = {
                data: encode(new Uint8Array(new Int16Array(inputData.map(f => f * 32768)).buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromiseRef.current?.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessorRef.current);
            scriptProcessorRef.current.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              addTranscript('user', message.serverContent.inputTranscription.text);
            }
            if (message.serverContent?.outputTranscription) {
              setStatusText('Thinking...');
              addTranscript('model', message.serverContent.outputTranscription.text);
            }
             if (message.serverContent?.modelTurn?.parts[0]?.inlineData.data) {
                const audioData = message.serverContent.modelTurn.parts[0].inlineData.data;
                const audioBuffer = await decodeAudioData(decode(audioData), outputAudioContextRef.current!, 24000, 1);
                const source = outputAudioContextRef.current!.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputAudioContextRef.current!.destination);
                
                let nextStartTime = Math.max(nextStartTimeRef.current, outputAudioContextRef.current!.currentTime);
                source.start(nextStartTime);
                nextStartTimeRef.current = nextStartTime + audioBuffer.duration;

                source.onended = () => {
                   if (statusText === 'Thinking...') setStatusText('Listening...');
                };
             }
             if (message.toolCall?.functionCalls) {
                for (const fc of message.toolCall.functionCalls) {
                    if (fc.name === 'captureLeadDetails') {
                        const args = fc.args as any;
                        onAIGeneratedLead({
                            title: args.title,
                            description: args.description,
                            companyName: args.companyName,
                            budget: args.budget,
                            authority: args.authority,
                            need: args.need,
                            timeframe: args.timeframe,
                            postedBy: args.name,
                            email: args.email,
                            phone: args.phone
                        });
                        sessionPromiseRef.current?.then(session => {
                            session.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: { result: "Successfully captured lead details." } }});
                        });
                    }
                }
             }
          },
          onclose: () => {
            addTranscript('status', 'Connection closed.');
            setSessionState('inactive');
            setStatusText('Idle');
          },
          onerror: (e: ErrorEvent) => {
            console.error('Live session error:', e);
            addTranscript('error', `An error occurred with the connection: ${e.message}. This could be due to a missing API key in your deployment environment or network issues.`);
            setSessionState('error');
            setStatusText('Error');
            stopSession();
          },
        },
      });
    } catch (err) {
      console.error(err);
      let errorMessage = 'Could not access the microphone. Please check your browser permissions.';
      if (window.location.protocol !== 'https:') {
        errorMessage = 'Microphone access requires a secure connection (HTTPS). Your site is currently on HTTP, which blocks microphone access in most browsers after deployment.';
      }
      addTranscript('error', errorMessage);
      setSessionState('error');
      setStatusText('Mic Error');
    }
  };

  const statusIndicator = () => {
    switch (sessionState) {
        case 'connecting': return <span className="text-yellow-500">{statusText}</span>;
        case 'active': return <span className="text-green-500">{statusText}</span>;
        case 'error': return <span className="text-red-500">{statusText}</span>;
        default: return <span className="text-slate-500">{statusText}</span>;
    }
  };

  const renderPanelContent = () => {
    if (sessionState === 'inactive' || sessionState === 'error') {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <MicrophoneIcon className="h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-800">Ready to Help</h3>
            <p className="text-slate-500 mt-2 mb-6">Click the button below to start a conversation with our AI assistant.</p>
            <button
              onClick={startSession}
              className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Start Audio Chat
            </button>
        </div>
      );
    }

    return (
        <>
            <div id="transcript-panel" className="flex-1 p-4 overflow-y-auto bg-slate-50">
                <div className="space-y-4">
                {transcript.map((item, index) => (
                    <div key={index} className={`flex ${item.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {item.type === 'status' || item.type === 'error' ? (
                        <div className={`text-center w-full text-xs ${item.type === 'error' ? 'text-red-500' : 'text-slate-400'}`}>
                            {item.text}
                        </div>
                    ) : (
                        <div className={`max-w-[80%] p-3 rounded-xl ${
                        item.type === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-200 text-slate-800'
                        }`}>
                        <p className="text-sm">{item.text}</p>
                        </div>
                    )}
                    </div>
                ))}
                </div>
            </div>
            <footer className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
                <div className="text-sm font-medium">{statusIndicator()}</div>
                 <button 
                    onClick={stopSession}
                    className="bg-red-500 text-white text-xs font-bold py-1 px-3 rounded-md hover:bg-red-600 transition"
                 >
                    End Chat
                 </button>
            </footer>
        </>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsPanelVisible(true)}
        className={`fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 z-50 flex items-center space-x-0 sm:space-x-3 ${isPanelVisible ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}
        aria-label="Open AI Assistant"
      >
        <MicrophoneIcon className="h-7 w-7" />
        <span className="font-semibold hidden sm:inline">AI Assistant</span>
        {sessionState === 'active' && <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white animate-pulse"></span>}
      </button>

      <div className={`fixed bottom-4 right-4 w-[calc(100%-2rem)] sm:w-[380px] max-w-sm h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-slate-300 transition-all duration-300 ease-in-out ${isPanelVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          <header className="flex items-center justify-between p-4 bg-slate-100 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                  <MicrophoneIcon className="h-6 w-6 text-blue-600"/>
                  <h3 className="text-lg font-bold text-slate-800">AI Assistant</h3>
              </div>
              <button onClick={() => setIsPanelVisible(false)} className="text-slate-500 hover:text-slate-800" aria-label="Hide Assistant">
              <CloseIcon className="h-6 w-6" />
              </button>
          </header>
          {renderPanelContent()}
      </div>
    </>
  );
};

export default AIAssistant;