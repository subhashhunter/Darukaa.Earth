/**
 * Darukaa.Earth AI Biodiversity Intelligence System
 * Hybrid Vector RAG Retrieval Engine (Node.js ES Modules)
 */

import { getAllStudies } from './corpus.js';

export class EcologicalRAGEngine {
  constructor() {
    this.studies = getAllStudies();
    this.vocabulary = new Map();
    this.idf = new Map();
    this.docVectors = [];
    this.buildIndex();
  }

  tokenize(text) {
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-_]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 2);
  }

  buildIndex() {
    const docTokens = [];
    const N = this.studies.length;

    const df = new Map();

    this.studies.forEach(study => {
      const composite = [
        study.title,
        study.source,
        ...study.domain,
        ...study.keywords,
        ...study.climate_zones,
        ...study.target_variables,
        study.empirical_findings,
        study.causal_mechanism
      ].join(' ');

      const tokens = this.tokenize(composite);
      docTokens.push(tokens);

      const uniqueTokens = new Set(tokens);
      uniqueTokens.forEach(t => {
        df.set(t, (df.get(t) || 0) + 1);
        if (!this.vocabulary.has(t)) {
          this.vocabulary.set(t, this.vocabulary.size);
        }
      });
    });

    df.forEach((count, token) => {
      this.idf.set(token, Math.log((N + 1) / (count + 1)) + 1.0);
    });

    this.docVectors = docTokens.map(tokens => this.computeTfidfVector(tokens));
  }

  computeTfidfVector(tokens) {
    const tf = new Map();
    tokens.forEach(t => {
      tf.set(t, (tf.get(t) || 0) + 1);
    });

    const vector = new Map();
    let normSq = 0;

    tf.forEach((count, token) => {
      const idfVal = this.idf.get(token) || 1.0;
      const weight = (1 + Math.log(count)) * idfVal;
      vector.set(token, weight);
      normSq += weight * weight;
    });

    const norm = Math.sqrt(normSq) || 1.0;
    const normalizedVector = new Map();
    vector.forEach((weight, token) => {
      normalizedVector.set(token, weight / norm);
    });

    return normalizedVector;
  }

  cosineSimilarity(vecA, vecB) {
    let dot = 0;
    vecA.forEach((valA, token) => {
      if (vecB.has(token)) {
        dot += valA * vecB.get(token);
      }
    });
    return dot;
  }

  retrieve(query, options = {}) {
    const { climate_zone, target_variables = [], top_k = 3, threshold = 0.08 } = options;
    const queryTokens = this.tokenize(query);
    const queryVec = this.computeTfidfVector(queryTokens);

    const scored = this.studies.map((study, idx) => {
      const baseScore = this.cosineSimilarity(queryVec, this.docVectors[idx]);
      let boost = 0.0;

      if (climate_zone && study.climate_zones.some(cz => cz.toLowerCase().includes(climate_zone.toLowerCase()))) {
        boost += 0.15;
      }

      if (target_variables.length > 0) {
        const matches = target_variables.filter(v =>
          study.target_variables.some(tv => tv.toLowerCase().includes(v.toLowerCase()))
        );
        boost += 0.08 * matches.length;
      }

      const queryTokenSet = new Set(queryTokens);
      const studyKeywordOverlap = study.keywords.filter(k => queryTokenSet.has(k.toLowerCase())).length;
      boost += 0.04 * Math.min(studyKeywordOverlap, 4);

      const finalScore = Math.min(1.0, baseScore + boost);

      return {
        study_id: study.id,
        title: study.title,
        source: study.source,
        year: study.year,
        doi: study.doi,
        domain: study.domain,
        climate_zones: study.climate_zones,
        target_variables: study.target_variables,
        empirical_findings: study.empirical_findings,
        causal_mechanism: study.causal_mechanism,
        quantified_impact: study.quantified_impact,
        time_horizon: study.time_horizon,
        similarity_score: Number(finalScore.toFixed(4)),
        confidence_score: study.confidence_score
      };
    });

    return scored
      .filter(s => s.similarity_score >= threshold)
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .slice(0, top_k);
  }
}

export const ragEngine = new EcologicalRAGEngine();
