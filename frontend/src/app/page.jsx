'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ChatPanel from '../components/ChatPanel';
import ReasoningDashboard from '../components/ReasoningDashboard';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Home() {
  const [sessionId, setSessionId] = useState(`session-${Date.now()}`);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Welcome to **Darukaa.Earth AI Biodiversity Intelligence**. I am an AI Environmental Scientist specialized in multi-variable ecological reasoning and evidence-backed land restoration.\n\n" +
        "Please describe your land parameters (e.g. `Soil organic carbon: 0.3%, Rainfall: low (semi-arid), Crop: monoculture wheat`) or test one of the preset scenarios below.",
      timestamp: Date.now(),
      metadata: { type: 'greeting' }
    }
  ]);
  const [accumulatedProfile, setAccumulatedProfile] = useState({
    soc_pct: 0.3,
    rainfall: 'low (semi-arid)',
    land_use: 'monoculture wheat',
    region: 'semi-arid'
  });
  const [missingVariables, setMissingVariables] = useState([]);
  const [requiresClarification, setRequiresClarification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reasoningData, setReasoningData] = useState(null);
  const [allStudies, setAllStudies] = useState([]);

  // Fetch initial knowledge corpus and run default benchmark scenario
  useEffect(() => {
    async function initData() {
      try {
        const kRes = await fetch(`${API_BASE}/knowledge`);
        if (kRes.ok) {
          const kData = await kRes.json();
          setAllStudies(kData.studies || []);
        }

        // Initialize benchmark reasoning result
        const rRes = await fetch(`${API_BASE}/reason`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            soc_pct: 0.3,
            rainfall: 'low',
            land_use: 'monoculture wheat',
            region: 'semi-arid'
          })
        });
        if (rRes.ok) {
          const rData = await rRes.json();
          setReasoningData(rData);
        }
      } catch (err) {
        console.warn('API init warning:', err);
      }
    }
    initData();
  }, []);

  const handleSendMessage = async (userText) => {
    const userMsg = {
      role: 'user',
      content: userText,
      timestamp: Date.now()
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          session_id: sessionId
        })
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg = {
          role: 'assistant',
          content: data.message,
          timestamp: Date.now(),
          metadata: {
            type: data.type,
            missing_variables: data.missing_variables
          }
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setAccumulatedProfile(data.accumulated_profile || {});
        setMissingVariables(data.missing_variables || []);
        setRequiresClarification(data.requires_clarification || false);

        if (data.reasoning_details) {
          setReasoningData(data.reasoning_details);
        }
      } else {
        throw new Error('API server returned error');
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ Error connecting to AI Environmental Scientist Backend. Please ensure the Express server is running on port 5000.`,
          timestamp: Date.now(),
          metadata: { type: 'error' }
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunStructuredReasoning = async (formData) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reason`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const data = await res.json();
        setReasoningData(data);
        setAccumulatedProfile((prev) => ({ ...prev, ...formData }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpatialLookup = async (lat, lon) => {
    try {
      const res = await fetch(`${API_BASE}/spatial/lookup?lat=${lat}&lon=${lon}`);
      if (res.ok) {
        const data = await res.json();
        return data.spatial_context;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const handleResetSession = () => {
    setSessionId(`session-${Date.now()}`);
    setMessages([
      {
        role: 'assistant',
        content:
          "Session reset. Welcome back to **Darukaa.Earth AI Biodiversity Intelligence**.\n\nPlease describe your land context to begin.",
        timestamp: Date.now(),
        metadata: { type: 'greeting' }
      }
    ]);
    setAccumulatedProfile({
      soc_pct: null,
      rainfall: null,
      land_use: null,
      region: null
    });
    setMissingVariables([]);
    setRequiresClarification(false);
  };

  const handleExportDocx = () => {
    window.open(`${API_BASE}/export/docx`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Header
        onExportDocx={handleExportDocx}
        activeStudyCount={allStudies.length}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Conversational Scientist Agent */}
        <div className="lg:col-span-5 w-full">
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            onResetSession={handleResetSession}
            accumulatedProfile={accumulatedProfile}
            missingVariables={missingVariables}
            isLoading={isLoading}
            requiresClarification={requiresClarification}
          />
        </div>

        {/* Right Column: Multi-Metric Reasoning & Analytics Dashboard */}
        <div className="lg:col-span-7 w-full">
          <ReasoningDashboard
            reasoningData={reasoningData}
            onRunStructuredReasoning={handleRunStructuredReasoning}
            allStudies={allStudies}
            onSpatialLookup={handleSpatialLookup}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 py-3 text-center text-xs text-slate-500">
        Darukaa.Earth AI Biodiversity Intelligence Hackathon Submission &bull; Powered by Express + Node.js Backend & React + Next.js + Tailwind CSS Frontend
      </footer>
    </div>
  );
}
