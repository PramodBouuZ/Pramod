import React, { useState } from 'react';
// FIX: Import GoogleGenAI and Type from @google/genai.
import { GoogleGenAI, Type } from "@google/genai";
import type { BANTAnalysis, User } from '../types';

interface RequirementFormProps {
  onFormSubmit: (analysis: BANTAnalysis) => void;
  user: User | null;
}

const RequirementForm: React.FC<RequirementFormProps> = ({ onFormSubmit, user }) => {
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<BANTAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!description.trim()) {
      setError('Please describe your requirement.');
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      // FIX: Use new GoogleGenAI with apiKey from environment variables.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const prompt = `
        Analyze the following business requirement and extract BANT (Budget, Authority, Need, Timeframe) details.
        Also, suggest a concise title for this lead.
        Provide the output in a JSON object.

        Requirement: "${description}"

        JSON Schema:
        {
          "title": "A short, catchy title for the lead",
          "budget": "Estimated budget as a number, or 0 if not mentioned",
          "authority": "Should be one of: 'Decision Maker', 'Influencer', 'Researcher'. Infer from job titles or seniority.",
          "need": "Should be one of: 'High', 'Medium', 'Low'. Based on urgency or problem description.",
          "timeframe": "Should be one of: 'Immediately', '1-3 Months', '3-6 Months'.",
          "isValid": "boolean, true if at least 3 of BANT criteria are reasonably inferred, otherwise false.",
          "reason": "A brief explanation for your analysis and why it is or isn't a valid lead."
        }
      `;
      
      // FIX: Use ai.models.generateContent to query the model.
      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro", // Using a powerful model for analysis
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          // FIX: Define the response schema for reliable JSON output.
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              budget: { type: Type.NUMBER },
              authority: { type: Type.STRING },
              need: { type: Type.STRING },
              timeframe: { type: Type.STRING },
              isValid: { type: Type.BOOLEAN },
              reason: { type: Type.STRING },
            },
            required: ["title", "budget", "authority", "need", "timeframe", "isValid", "reason"]
          },
        },
      });

      // FIX: Access the response text directly.
      const jsonText = response.text.trim();
      const result = JSON.parse(jsonText) as BANTAnalysis;
      setAnalysisResult(result);

    } catch (e) {
      console.error(e);
      setError('Failed to analyze the requirement. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = () => {
    if (analysisResult) {
      onFormSubmit(analysisResult);
      // Reset form
      setDescription('');
      setAnalysisResult(null);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Post Your Business Requirement</h2>
      <p className="text-slate-500 mb-6">Describe what you need, and our AI will qualify it for vendors.</p>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
            Requirement Details
          </label>
          <textarea
            id="description"
            rows={8}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            placeholder="e.g., 'We are a logistics company in Mumbai looking for a CRM solution to manage our 50-person sales team. We need features like lead tracking, sales pipeline management, and integration with our existing accounting software. Our budget is around 5 lakhs and we want to go live within the next 2 months. The decision will be made by our Sales Director.'"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="w-full flex justify-center items-center bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300"
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : 'Analyze with AI'}
        </button>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </div>

      {analysisResult && (
        <div className="mt-8 pt-6 border-t border-slate-200 animate-fade-in">
          <h3 className="text-xl font-bold text-slate-800 mb-4">AI Analysis Result</h3>
          {!analysisResult.isValid && (
            <div className="p-3 mb-4 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
              <strong>Note:</strong> {analysisResult.reason}
            </div>
          )}
          <div className="bg-slate-50 p-4 rounded-lg space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div><strong className="text-slate-600">Title:</strong> {analysisResult.title}</div>
              <div><strong className="text-slate-600">Budget:</strong> ₹{analysisResult.budget.toLocaleString('en-IN')}</div>
              <div><strong className="text-slate-600">Authority:</strong> {analysisResult.authority}</div>
              <div><strong className="text-slate-600">Need:</strong> {analysisResult.need}</div>
              <div><strong className="text-slate-600">Timeframe:</strong> {analysisResult.timeframe}</div>
            </div>
             <p className="text-sm pt-2"><strong className="text-slate-600">Reasoning:</strong> {analysisResult.reason}</p>
          </div>
          <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Confirm & Post Enquiry
          </button>
        </div>
      )}
    </div>
  );
};

export default RequirementForm;
