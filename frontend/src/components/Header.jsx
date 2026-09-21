'use client';

import React, { useEffect, useState } from 'react';
import { Sprout, FileDown, ShieldCheck, Activity, Globe2, BookOpen } from 'lucide-react';

export default function Header({ onExportDocx, activeStudyCount }) {
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    async function checkHealth() {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiBase}/health`);
        if (res.ok) {
          const data = await res.json();
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch (e) {
        setBackendStatus('offline');
      }
    }
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30">
            <Sprout className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-white bg-clip-text text-transparent">
                Darukaa.Earth
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                AI Environmental Scientist
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Knowledge-Grounded Multi-Metric Ecological Intelligence Engine
            </p>
          </div>
        </div>

        {/* Status Indicators & Submission Action */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Scientific Corpus Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-xs text-slate-300">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              <strong className="text-emerald-300">{activeStudyCount || 8}</strong> Peer-Reviewed Studies (FAO, IPCC, IPBES)
            </span>
          </div>

          {/* Backend Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-xs">
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${
                backendStatus === 'online'
                  ? 'bg-emerald-400 shadow-sm shadow-emerald-400'
                  : 'bg-amber-400'
              }`}
            />
            <span className="text-slate-300 capitalize">API {backendStatus}</span>
          </div>

          {/* Word Submission (.docx) Export */}
          <button
            onClick={onExportDocx}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-700/20 transition-all active:scale-95 border border-emerald-400/30"
            title="Download formatted submission document for Hackathon reviewers"
          >
            <FileDown className="w-4 h-4" />
            <span>Export Docx</span>
          </button>
        </div>
      </div>
    </header>
  );
}
