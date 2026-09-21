'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, AlertCircle, Bot, User, RefreshCw, ChevronRight, HelpCircle, Layers } from 'lucide-react';

const PRESET_SCENARIOS = [
  {
    label: "Semi-Arid Monoculture Wheat (Benchmark)",
    prompt: "Soil organic carbon: 0.3%, Rainfall: low (semi-arid), Crop: monoculture wheat, Region: semi-arid"
  },
  {
    label: "Vague Query (Tests Clarification)",
    prompt: "Biodiversity is declining on my land, what can I do?"
  },
  {
    label: "Acidic Degraded Tropical Pasture",
    prompt: "Soil organic carbon: 0.8%, Rainfall: 1400mm (tropical wet), Soil pH: 4.8, Land use: degraded cattle pasture"
  },
  {
    label: "Temperate Intensive Cropland",
    prompt: "Soil organic carbon: 1.1%, Rainfall: 750mm, Crop: continuous corn-soy monoculture with heavy tillage"
  }
];

export default function ChatPanel({
  messages,
  onSendMessage,
  onResetSession,
  accumulatedProfile,
  missingVariables,
  isLoading,
  requiresClarification
}) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleScenarioClick = (prompt) => {
    onSendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-[750px] lg:h-[820px] rounded-2xl glass-panel overflow-hidden border border-slate-800 shadow-2xl">
      {/* Top Bar / Profile Context */}
      <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-200">Conversational Intelligence</span>
        </div>

        <button
          onClick={onResetSession}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-800 transition"
          title="Reset conversation and state"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Session</span>
        </button>
      </div>

      {/* Accumulated Context Profile Badges */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/60 flex items-center gap-2 flex-wrap text-xs">
        <span className="text-slate-400 flex items-center gap-1 font-medium">
          <Layers className="w-3.5 h-3.5 text-emerald-400" /> Active Context:
        </span>
        {accumulatedProfile.soc_pct !== null && accumulatedProfile.soc_pct !== undefined ? (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            SOC: <strong>{accumulatedProfile.soc_pct}%</strong>
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full bg-slate-800/60 text-slate-400 border border-slate-700/50">
            SOC: <span className="italic">Unspecified</span>
          </span>
        )}

        {accumulatedProfile.rainfall ? (
          <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 capitalize">
            Rainfall: <strong>{accumulatedProfile.rainfall}</strong>
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full bg-slate-800/60 text-slate-400 border border-slate-700/50">
            Rainfall: <span className="italic">Unspecified</span>
          </span>
        )}

        {accumulatedProfile.land_use ? (
          <span className="px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 capitalize">
            Land: <strong>{accumulatedProfile.land_use}</strong>
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full bg-slate-800/60 text-slate-400 border border-slate-700/50">
            Land: <span className="italic">Unspecified</span>
          </span>
        )}
      </div>

      {/* Preset Scenarios Strip */}
      <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800/40 flex items-center gap-1.5 overflow-x-auto text-xs whitespace-nowrap">
        <span className="text-slate-400 mr-1 text-[11px] font-semibold">Test Presets:</span>
        {(PRESET_SCENARIOS || []).map((sc, idx) => (
          <button
            key={idx}
            onClick={() => handleScenarioClick(sc.prompt)}
            className="px-2.5 py-1 rounded-md bg-slate-800/70 hover:bg-emerald-900/40 text-slate-300 hover:text-emerald-300 border border-slate-700/60 hover:border-emerald-500/40 transition text-[11px] flex items-center gap-1"
          >
            <span>{sc.label}</span>
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {(messages || []).map((msg, i) => {
          const isUser = msg.role === 'user';
          const isClarification = msg.metadata?.type === 'clarification_question';

          return (
            <div
              key={i}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center flex-shrink-0 text-emerald-300 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[88%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-none shadow-md shadow-emerald-950'
                    : isClarification
                    ? 'bg-amber-950/40 border border-amber-500/40 text-amber-100 rounded-tl-none shadow-lg'
                    : 'glass-card text-slate-200 rounded-tl-none border-slate-700/60 shadow-lg'
                }`}
              >
                {/* Clarification Alert Badge */}
                {isClarification && (
                  <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-amber-500/20 text-amber-300 font-semibold text-xs">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>Incomplete Parameters Detected — Clarifying Diagnosis</span>
                  </div>
                )}

                {/* Message Body with Line Breaks & Bold Highlights */}
                <div className="space-y-2 whitespace-pre-line">
                  {msg.content}
                </div>

                {/* Quick suggestions when clarification requested */}
                {isClarification && msg.metadata?.missing_variables && (
                  <div className="mt-3 pt-2.5 border-t border-amber-500/20 flex flex-wrap gap-1.5">
                    <span className="text-[11px] text-amber-300 w-full mb-1">Quick Answer Templates:</span>
                    <button
                      onClick={() => onSendMessage("SOC: 0.3%, Rainfall: semi-arid (350mm), Crop: monoculture wheat")}
                      className="text-[11px] px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 transition"
                    >
                      Semi-Arid Wheat (0.3% SOC, 350mm)
                    </button>
                    <button
                      onClick={() => onSendMessage("SOC: 0.5%, Rainfall: low drylands, Crop: pearl millet")}
                      className="text-[11px] px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 transition"
                    >
                      Dryland Millet (0.5% SOC)
                    </button>
                  </div>
                )}

                <div className="mt-1 text-[10px] text-right opacity-60">
                  {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-slate-300 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start animate-fadeIn">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center flex-shrink-0 text-emerald-300 mt-1">
              <Bot className="w-4 h-4" />
            </div>
            <div className="glass-card rounded-2xl rounded-tl-none p-3.5 border-slate-700/60 flex items-center gap-2 text-xs text-slate-300">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>AI Environmental Scientist reasoning across coupled variables...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="p-3.5 bg-slate-900/90 border-t border-slate-800">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="E.g., Soil carbon is 0.3%, semi-arid rainfall, monoculture wheat..."
            disabled={isLoading}
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-4 pr-12 py-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/40 transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="absolute right-2 p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white disabled:text-slate-500 transition shadow-md disabled:shadow-none"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
