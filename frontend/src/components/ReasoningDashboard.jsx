'use client';

import React, { useState } from 'react';
import {
  Activity,
  BarChart3,
  GitFork,
  BookOpen,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Droplets,
  Layers,
  Thermometer,
  Compass,
  FileCheck
} from 'lucide-react';

export default function ReasoningDashboard({
  reasoningData,
  onRunStructuredReasoning,
  allStudies = [],
  onSpatialLookup
}) {
  const [activeTab, setActiveTab] = useState('assessment');

  // Sandbox Form State
  const [socVal, setSocVal] = useState(0.3);
  const [rainfallVal, setRainfallVal] = useState('low (semi-arid)');
  const [landUseVal, setLandUseVal] = useState('monoculture wheat');
  const [regionVal, setRegionVal] = useState('semi-arid');
  const [soilPhVal, setSoilPhVal] = useState(6.8);
  const [latVal, setLatVal] = useState(18.5204);
  const [lonVal, setLonVal] = useState(73.8567);
  const [spatialResult, setSpatialResult] = useState(null);

  const handleSandboxSubmit = (e) => {
    e.preventDefault();
    onRunStructuredReasoning({
      soc_pct: parseFloat(socVal),
      rainfall: rainfallVal,
      land_use: landUseVal,
      region: regionVal,
      soil_ph: parseFloat(soilPhVal),
      latitude: parseFloat(latVal),
      longitude: parseFloat(lonVal)
    });
  };

  const handleSpatialResolve = async () => {
    const res = await onSpatialLookup(latVal, lonVal);
    if (res) {
      setSpatialResult(res);
      if (res.climate_zone) setRegionVal(res.climate_zone);
      if (res.typical_soc_pct) setSocVal(res.typical_soc_pct);
      if (res.typical_soil_ph) setSoilPhVal(res.typical_soil_ph);
    }
  };

  const recs = reasoningData?.recommendations || [];
  const primaryRec = recs[0];
  const diag = reasoningData?.diagnosis_breakdown || {};
  const projections = reasoningData?.quantitative_projections;
  const causalChains = reasoningData?.causal_mechanism_chains || [];
  const retrievedEvidence = reasoningData?.retrieved_scientific_evidence || [];

  return (
    <div className="flex flex-col h-[750px] lg:h-[820px] rounded-2xl glass-panel overflow-hidden border border-slate-800 shadow-2xl">
      {/* Tab Navigation Header */}
      <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center gap-1 overflow-x-auto text-xs whitespace-nowrap">
        <button
          onClick={() => setActiveTab('assessment')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition ${
            activeTab === 'assessment'
              ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>1. Multi-Metric Diagnosis</span>
        </button>

        <button
          onClick={() => setActiveTab('trajectory')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition ${
            activeTab === 'trajectory'
              ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>2. Trajectory Forecaster</span>
        </button>

        <button
          onClick={() => setActiveTab('causal')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition ${
            activeTab === 'causal'
              ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <GitFork className="w-3.5 h-3.5" />
          <span>3. Causal Mechanism Graph</span>
        </button>

        <button
          onClick={() => setActiveTab('rag')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition ${
            activeTab === 'rag'
              ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>4. RAG Evidence Inspector</span>
        </button>

        <button
          onClick={() => setActiveTab('sandbox')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition ${
            activeTab === 'sandbox'
              ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>5. Parameter Sandbox</span>
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* ======================================================== */}
        {/* TAB 1: MULTI-METRIC ASSESSMENT & DIAGNOSIS */}
        {/* ======================================================== */}
        {activeTab === 'assessment' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Coupled Variables Header Badge */}
            <div className="glass-card p-4 rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 to-slate-900">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-200">
                    Coupled Multi-Variable Ecological Network (
                    {reasoningData?.variable_coupling_count || 4} Parameters Integrated)
                  </h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  Confidence: {primaryRec?.confidence_level || '94%'}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {reasoningData?.coupled_environmental_variables?.map((v, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700/60 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{v}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Diagnostic Deficit Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="glass-card p-3.5 rounded-xl border-amber-500/20 bg-amber-950/10">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1.5">
                  <Layers className="w-4 h-4" />
                  <span>Soil Carbon Deficit</span>
                </div>
                <div className="text-[11px] font-semibold text-amber-300 mb-1">
                  {diag.soil_carbon_deficit?.status || 'Critical Deficit'}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {diag.soil_carbon_deficit?.finding ||
                    'Severely depleted SOC restricts micro-aggregate formation and water holding capacity.'}
                </p>
              </div>

              <div className="glass-card p-3.5 rounded-xl border-blue-500/20 bg-blue-950/10">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-bold mb-1.5">
                  <Thermometer className="w-4 h-4" />
                  <span>Hydro-Thermal Stress</span>
                </div>
                <div className="text-[11px] font-semibold text-blue-300 mb-1">
                  {diag.hydro_thermal_stress?.status || 'High Thermal / VPD Stress'}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {diag.hydro_thermal_stress?.finding ||
                    'Absence of canopy stratification accelerates topsoil vapor pressure deficits.'}
                </p>
              </div>

              <div className="glass-card p-3.5 rounded-xl border-emerald-500/20 bg-emerald-950/10">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>Trophic Fragmentation</span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-300 mb-1">
                  {diag.trophic_fragmentation?.status || 'Biological Desertification'}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {diag.trophic_fragmentation?.finding ||
                    'Monoculture cropping eliminates continuous floral and nesting corridors.'}
                </p>
              </div>
            </div>

            {/* Prescribed Scientific Recommendations */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Actionable Evidence-Backed Recommendations</span>
              </h3>

              {recs.map((rec, idx) => (
                <div
                  key={idx}
                  className="glass-card p-5 rounded-xl border-slate-700/80 hover:border-emerald-500/40 transition-all space-y-3.5 bg-slate-900/60 shadow-md"
                >
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold uppercase tracking-wider">
                        {rec.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-100 mt-1.5">
                        {idx + 1}. {rec.title}
                      </h4>
                    </div>
                    <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                      Horizon: <strong className="text-slate-200">{rec.time_horizon}</strong>
                    </span>
                  </div>

                  {/* What to do */}
                  <div>
                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                      What To Do:
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                      {rec.what_to_do}
                    </p>
                  </div>

                  {/* Why it works (Biochemical/Hydrological Mechanism) */}
                  <div>
                    <div className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-1">
                      Why It Works (Scientific Causal Mechanism):
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed bg-teal-950/20 p-3 rounded-lg border border-teal-500/20">
                      {rec.why_it_works}
                    </p>
                  </div>

                  {/* Quantified Impacted Metrics */}
                  <div>
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Quantified Trajectory Deltas:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {rec.impacted_metrics?.map((m, mi) => (
                        <div
                          key={mi}
                          className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 flex flex-col justify-between"
                        >
                          <span className="text-[11px] text-slate-400">{m.metric}</span>
                          <span className="text-xs font-bold text-emerald-300 mt-0.5">
                            {m.delta}
                          </span>
                          <span className="text-[10px] text-slate-500 mt-1 italic">
                            Evidence: {m.evidence}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Primary Reference */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>
                      Cited Source: <strong className="text-slate-300">{rec.primary_reference?.source}</strong>
                    </span>
                    <span className="text-[11px] text-emerald-400/80 font-mono">
                      {rec.primary_reference?.citation}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: QUANTITATIVE TRAJECTORY FORECASTER */}
        {/* ======================================================== */}
        {activeTab === 'trajectory' && projections && (
          <div className="space-y-6 animate-fadeIn">
            <div className="glass-card p-4 rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/20 via-slate-900 to-slate-900">
              <h3 className="text-sm font-bold text-slate-200 mb-1">
                Quantitative Multi-Year Ecological Trajectory
              </h3>
              <p className="text-xs text-slate-400">
                Empirical projection model based on FAO (2022) & IPCC AR6 regenerative transition pathways.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Year 1 */}
              <div className="glass-card p-4 rounded-xl border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    {projections.time_horizons.short_term_1yr.label}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Establishment
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Soil Organic Carbon:</span>
                    <strong className="text-emerald-300">
                      {projections.time_horizons.short_term_1yr.soc_pct}%
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Water Retention Gain:</span>
                    <strong className="text-blue-300">
                      +{projections.time_horizons.short_term_1yr.moisture_retention_pct}%
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Shannon Diversity Index (H'):</span>
                    <strong className="text-teal-300">
                      {projections.time_horizons.short_term_1yr.shannon_diversity_index}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pollinator Density (m⁻²):</span>
                    <strong className="text-amber-300">
                      {projections.time_horizons.short_term_1yr.pollinator_visitation_m2}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Earthworm Count (m⁻²):</span>
                    <strong className="text-purple-300">
                      {projections.time_horizons.short_term_1yr.earthworm_density_m2}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Year 3 */}
              <div className="glass-card p-4 rounded-xl border-emerald-500/40 bg-emerald-950/20 space-y-3 shadow-lg">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    {projections.time_horizons.medium_term_3yr.label}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                    Core Target
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Soil Organic Carbon:</span>
                    <strong className="text-emerald-300 font-bold">
                      {projections.time_horizons.medium_term_3yr.soc_pct}%
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Water Retention Gain:</span>
                    <strong className="text-blue-300 font-bold">
                      +{projections.time_horizons.medium_term_3yr.moisture_retention_pct}%
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Shannon Diversity Index (H'):</span>
                    <strong className="text-teal-300 font-bold">
                      {projections.time_horizons.medium_term_3yr.shannon_diversity_index}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pollinator Density (m⁻²):</span>
                    <strong className="text-amber-300 font-bold">
                      {projections.time_horizons.medium_term_3yr.pollinator_visitation_m2}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Earthworm Count (m⁻²):</span>
                    <strong className="text-purple-300 font-bold">
                      {projections.time_horizons.medium_term_3yr.earthworm_density_m2}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Year 10 */}
              <div className="glass-card p-4 rounded-xl border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                  <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                    {projections.time_horizons.long_term_10yr.label}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Ecosystem Climax
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Soil Organic Carbon:</span>
                    <strong className="text-emerald-300">
                      {projections.time_horizons.long_term_10yr.soc_pct}%
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Water Retention Gain:</span>
                    <strong className="text-blue-300">
                      +{projections.time_horizons.long_term_10yr.moisture_retention_pct}%
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Shannon Diversity Index (H'):</span>
                    <strong className="text-teal-300">
                      {projections.time_horizons.long_term_10yr.shannon_diversity_index}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pollinator Density (m⁻²):</span>
                    <strong className="text-amber-300">
                      {projections.time_horizons.long_term_10yr.pollinator_visitation_m2}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Earthworm Count (m⁻²):</span>
                    <strong className="text-purple-300">
                      {projections.time_horizons.long_term_10yr.earthworm_density_m2}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: MECHANISTIC CAUSAL GRAPH */}
        {/* ======================================================== */}
        {activeTab === 'causal' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="glass-card p-4 rounded-xl border border-teal-500/20 bg-gradient-to-r from-teal-950/20 via-slate-900 to-slate-900">
              <h3 className="text-sm font-bold text-slate-200 mb-1">
                Biochemical & Hydrological Causal Pathways
              </h3>
              <p className="text-xs text-slate-400">
                Step-by-step causal chains demonstrating why the interventions work at molecular, rhizosphere, and landscape levels.
              </p>
            </div>

            {causalChains.map((chain, ci) => (
              <div key={ci} className="glass-card p-5 rounded-xl border-slate-700/80 space-y-4">
                <div className="flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    {chain.name}
                  </h4>
                </div>

                <div className="space-y-3">
                  {chain.nodes?.map((node, ni) => (
                    <div
                      key={ni}
                      className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80 relative pl-6 before:content-[''] before:absolute before:left-2.5 before:top-4 before:bottom-0 before:w-0.5 before:bg-emerald-500/30 last:before:hidden"
                    >
                      <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-400 mb-1">
                        <span>{node.stage}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-200 mb-1">{node.title}</div>
                      <p className="text-xs text-slate-400 leading-relaxed">{node.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: RAG EVIDENCE INSPECTOR */}
        {/* ======================================================== */}
        {activeTab === 'rag' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="glass-card p-4 rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-950/20 via-slate-900 to-slate-900">
              <h3 className="text-sm font-bold text-slate-200 mb-1">
                Indexed Peer-Reviewed Scientific Studies (RAG Knowledge Layer)
              </h3>
              <p className="text-xs text-slate-400">
                Authoritative research papers, technical manuals, and empirical datasets grounding all AI recommendations.
              </p>
            </div>

            <div className="space-y-3">
              {(Array.isArray(retrievedEvidence) && retrievedEvidence.length > 0 ? retrievedEvidence : (allStudies || [])).map((study, idx) => (
                <div
                  key={idx}
                  className="glass-card p-4 rounded-xl border-slate-700/70 hover:border-emerald-500/40 transition space-y-2 bg-slate-900/60"
                >
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-semibold uppercase">
                        {study.source} ({study.year})
                      </span>
                      <h4 className="text-xs font-bold text-slate-100">{study.title}</h4>
                    </div>

                    {study.similarity_score !== undefined && (
                      <span className="text-[11px] px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                        Relevance: {Math.round(study.similarity_score * 100)}%
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
                    <strong>Empirical Findings:</strong> {study.empirical_findings}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>
                      DOI: <code className="text-emerald-400 font-mono">{study.doi}</code>
                    </span>
                    <a
                      href={`https://doi.org/${study.doi}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
                    >
                      <span>View Study</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: PARAMETER SANDBOX */}
        {/* ======================================================== */}
        {activeTab === 'sandbox' && (
          <form onSubmit={handleSandboxSubmit} className="space-y-5 animate-fadeIn">
            <div className="glass-card p-4 rounded-xl border border-emerald-500/20">
              <h3 className="text-sm font-bold text-slate-200 mb-1">
                Direct Structured Scenario Simulator
              </h3>
              <p className="text-xs text-slate-400">
                Fine-tune environmental variables to run immediate multi-metric reasoning.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* SOC % */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold flex justify-between">
                  <span>Soil Organic Carbon (SOC %):</span>
                  <strong className="text-emerald-400">{socVal}%</strong>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3.5"
                  step="0.05"
                  value={socVal}
                  onChange={(e) => setSocVal(e.target.value)}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Soil pH */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold flex justify-between">
                  <span>Soil pH:</span>
                  <strong className="text-teal-400">{soilPhVal}</strong>
                </label>
                <input
                  type="range"
                  min="4.0"
                  max="9.0"
                  step="0.1"
                  value={soilPhVal}
                  onChange={(e) => setSoilPhVal(e.target.value)}
                  className="w-full accent-teal-500"
                />
              </div>

              {/* Rainfall */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Precipitation Regime:</label>
                <select
                  value={rainfallVal}
                  onChange={(e) => setRainfallVal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200"
                >
                  <option value="low (semi-arid)">Low (Semi-Arid 250-450mm)</option>
                  <option value="moderate (500-800mm)">Moderate (500-800mm)</option>
                  <option value="high (&gt;1200mm)">High (&gt;1200mm Tropical)</option>
                </select>
              </div>

              {/* Land Use */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Current Land Use / Crop:</label>
                <input
                  type="text"
                  value={landUseVal}
                  onChange={(e) => setLandUseVal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200"
                />
              </div>

              {/* Latitude & Longitude */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Latitude / Longitude:</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.0001"
                    value={latVal}
                    onChange={(e) => setLatVal(e.target.value)}
                    placeholder="Latitude"
                    className="w-1/2 bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  />
                  <input
                    type="number"
                    step="0.0001"
                    value={lonVal}
                    onChange={(e) => setLonVal(e.target.value)}
                    placeholder="Longitude"
                    className="w-1/2 bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  />
                  <button
                    type="button"
                    onClick={handleSpatialResolve}
                    className="px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700"
                    title="Auto-resolve climate & soil from coordinates"
                  >
                    <Compass className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Climate Region */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Climate Zone / Biome:</label>
                <input
                  type="text"
                  value={regionVal}
                  onChange={(e) => setRegionVal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200"
                />
              </div>
            </div>

            {spatialResult && (
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-1">
                <div className="text-emerald-300 font-bold">
                  Resolved Ecoregion: {spatialResult.name}
                </div>
                <div className="text-slate-400">
                  Soil Order: {spatialResult.soil_order} | Avg Rain: {spatialResult.annual_precipitation_avg}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              Run Multi-Metric Reasoning Simulation
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
