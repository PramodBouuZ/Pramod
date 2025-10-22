import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type, Chat, FunctionDeclaration, GenerateContentResponse } from "@google/genai";
import type { BANTAnalysis, User } from '../types';

interface ConversationalEnquiryFormProps {
  onFormSubmit: (analysis: BANTAnalysis) => void;
  user: User | null;
  isHomePage: boolean;
}

const submitEnquiryFunctionDeclaration: FunctionDeclaration = {
    name: 'submit_enquiry',
    description: 'Submits the user\'s requirement after all BANT details have been collected and confirmed by the user.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: 'A short, catchy title for the lead, created by the AI.' },
            budget: { type: Type.NUMBER, description: 'The estimated budget for the project.' },
            authority: { type: Type.STRING, description: 'The user\'s authority level (e.g., "Decision Maker", "Influencer").' },
            need: { type: Type.STRING, description: 'The urgency of the need (e.g., "High", "Medium", "Low").' },
            timeframe: { type: Type.STRING, description: 'The project timeframe (e.g., "Immediately", "1-3 Months").' },
            description: { type: Type.STRING, description: 'A detailed summary of the user\'s requirement, written by the AI.' },
        },
        required: ["title", "budget", "authority", "need", "timeframe", "description"]
    },
};

const ConversationalEnquiryForm: React.FC<ConversationalEnquiryFormProps> = ({ onFormSubmit, user, isHomePage }) => {
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model', text: string }[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatSessionRef = useRef<Chat | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const startChat = async () => {
        setError(null);
        setIsAwaitingResponse(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            chatSessionRef.current = ai.chats.create({
                model: 'gemini-2.5-pro',
                config: {
                    tools: [{ functionDeclarations: [submitEnquiryFunctionDeclaration] }],
                    systemInstruction: `You are a friendly and professional B2B lead qualification assistant for "BANT Confirm". Your goal is to gather a user's business requirement and qualify it using the BANT framework (Budget, Authority, Need, Timeframe).
    
1.  Start by greeting the user warmly. Your first message should be: "Hello! I'm here to help you post your business requirement. To start, could you please describe what you're looking for?"
2.  Analyze the user's responses. If any BANT criteria are missing, ask clarifying questions ONE AT A TIME. Be polite and conversational. For example:
    - If budget is missing: 'Got it. And what is your approximate budget for this project?'
    - If authority is missing: 'Thanks. Who will be the main decision-maker for this?'
    - If timeframe is missing: 'Understood. What is your ideal timeframe for getting this started?'
    - If need is unclear: 'How critical is this for your business right now?'
3.  Once you have gathered all necessary BANT details and a clear description, create a concise title for the lead.
4.  Before finishing, you MUST summarize the collected information (Title, Description, Budget, Authority, Need, Timeframe) and ask the user for final confirmation. Say 'Great, I have everything. Just to confirm, here's a summary of your requirement... Does that all look correct?'.
5.  If the user confirms, and ONLY if they confirm, you MUST call the 'submit_enquiry' function with all the collected details. Do not call the function without explicit user confirmation of the summary. Your final text response after calling the function should be "Thank you! Your enquiry has been submitted for review."
6.  If the user wants to change something, acknowledge it and continue the conversation to refine the details.
7.  If the user is not logged in, you must still gather all the information and call the function. The app will handle the login prompt.`,
                },
            });

            const initialResponse = await chatSessionRef.current.sendMessage({ message: "Hello" });
            setChatHistory([{ role: 'model', text: initialResponse.text }]);

        } catch (e) {
            console.error(e);
            setError('Failed to initialize the AI assistant. Please check your connection or API key setup.');
        } finally {
            setIsAwaitingResponse(false);
        }
    };
    
    useEffect(() => {
        startChat();
    }, []);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isAwaitingResponse || !chatSessionRef.current) return;

        const text = userInput;
        setUserInput('');
        setChatHistory(prev => [...prev, { role: 'user', text }]);
        setIsAwaitingResponse(true);

        try {
            const response: GenerateContentResponse = await chatSessionRef.current.sendMessage({ message: text });
            
            if (response.functionCalls && response.functionCalls.length > 0) {
                const fc = response.functionCalls[0];
                if (fc.name === 'submit_enquiry') {
                    const args = fc.args as any;
                    const analysis: BANTAnalysis = {
                        title: args.title,
                        budget: args.budget,
                        authority: args.authority,
                        need: args.need,
                        timeframe: args.timeframe,
                        reason: args.description,
                        isValid: true,
                    };
                    onFormSubmit(analysis);
                    setChatHistory([]);
                    startChat();
                }
            }
            
            setChatHistory(prev => [...prev, { role: 'model', text: response.text }]);

        } catch(e) {
            console.error(e);
            setError('Sorry, something went wrong. Please try sending your message again.');
            setChatHistory(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsAwaitingResponse(false);
        }
    };

    return (
        <div className={isHomePage ? "bg-white p-8 rounded-xl shadow-lg border border-slate-200 max-w-4xl mx-auto" : "bg-white p-8 rounded-xl shadow-lg border border-slate-200 max-w-2xl mx-auto"}>
            <h2 className={isHomePage ? "text-3xl font-bold text-slate-800 text-center mb-2" : "text-2xl font-bold text-slate-800 mb-2"}>
                {isHomePage ? 'Have a Requirement? Let AI Guide You.' : 'Post Your Business Requirement'}
            </h2>
            <p className={isHomePage ? "text-slate-500 text-center mb-6" : "text-slate-500 mb-6"}>
                Chat with our assistant to get your requirement posted in minutes.
            </p>

            <div className="border border-slate-200 rounded-lg overflow-hidden flex flex-col h-[500px]">
                <div ref={chatContainerRef} className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto bg-slate-50">
                    {chatHistory.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && <span className="flex-shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white font-bold">A</span>}
                            <div className={`max-w-[85%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-200 text-slate-800 rounded-bl-none'}`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isAwaitingResponse && chatHistory.length > 0 && (
                         <div className="flex items-end gap-2 justify-start">
                             <span className="flex-shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white font-bold">A</span>
                            <div className="bg-slate-200 p-3 rounded-2xl rounded-bl-none">
                                <div className="flex items-center space-x-1">
                                    <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                    <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                    <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-pulse"></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white">
                    {error && <p className="text-red-500 text-xs text-center mb-2">{error}</p>}
                    <div className="flex items-center space-x-3">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder={isAwaitingResponse ? "Waiting for response..." : "Type your message..."}
                            disabled={isAwaitingResponse}
                            className="w-full px-4 py-2 text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-slate-100"
                        />
                        <button
                            type="submit"
                            disabled={isAwaitingResponse || !userInput.trim()}
                            className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed flex-shrink-0"
                        >
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ConversationalEnquiryForm;
