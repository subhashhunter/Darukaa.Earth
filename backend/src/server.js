/**
 * Darukaa.Earth AI Biodiversity Intelligence System
 * Express.js Server Entry Point (ES Modules)
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { diagnosticAgent } from './conversation/diagnosticAgent.js';
import { ecologicalReasoner } from './reasoning/ecologicalModel.js';
import { ragEngine } from './knowledge/ragEngine.js';
import { getAllStudies } from './knowledge/corpus.js';
import { geoResolver } from './spatial/geoResolver.js';
import { createSubmissionDocx } from './submission/generateDocx.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Darukaa.Earth AI Biodiversity Intelligence Backend',
    framework: 'Node.js + Express (ES Modules)',
    indexed_studies_count: getAllStudies().length,
    sources: ['FAO', 'IPCC AR6', 'IPBES', 'ICRAF', 'Nature', 'Science', 'USDA NRCS'],
    reasoning_mode: 'Multi-Metric Ecological Coupled Model (>= 3 variables)'
  });
});

// 2. Multi-turn Conversational Chat Endpoint
app.post('/api/chat', (req, res) => {
  try {
    const { message, session_id, direct_profile } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }
    const response = diagnosticAgent.handleMessage(message, session_id, direct_profile);
    res.json(response);
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 3. Direct Structured Reasoning Endpoint
app.post('/api/reason', (req, res) => {
  try {
    const result = ecologicalReasoner.reason(req.body || {});
    res.json(result);
  } catch (err) {
    console.error('Reasoning error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 4. Knowledge Corpus & RAG Search Endpoint
app.get('/api/knowledge', (req, res) => {
  try {
    const { query, climate_zone, limit = 10 } = req.query;
    if (query) {
      const results = ragEngine.retrieve(query, {
        climate_zone,
        top_k: parseInt(limit, 10) || 10
      });
      return res.json({ query, count: results.length, studies: results });
    }
    const all = getAllStudies();
    res.json({ count: all.length, studies: all.slice(0, parseInt(limit, 10) || 10) });
  } catch (err) {
    console.error('Knowledge retrieval error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 5. Spatial & Ecoregion Resolvers
app.get('/api/spatial/lookup', (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (lat === undefined || lon === undefined) {
      return res.status(400).json({ error: 'lat and lon are required query parameters' });
    }
    const spatialContext = geoResolver.resolve(parseFloat(lat), parseFloat(lon));
    res.json({ latitude: parseFloat(lat), longitude: parseFloat(lon), spatial_context: spatialContext });
  } catch (err) {
    console.error('Spatial error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/spatial/ecoregions', (req, res) => {
  res.json({ ecoregions: geoResolver.listKnownRegions() });
});

// 6. Word Document (.docx) Submission Export
app.get('/api/export/docx', async (req, res) => {
  try {
    const docPath = path.join(process.cwd(), 'Darukaa_Earth_AI_Biodiversity_Submission.docx');
    await createSubmissionDocx(docPath);
    if (fs.existsSync(docPath)) {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename="Darukaa_Earth_AI_Biodiversity_Submission.docx"');
      return res.sendFile(docPath);
    }
    res.status(500).json({ error: 'Failed to generate document.' });
  } catch (err) {
    console.error('Docx export error:', err);
    res.status(500).json({ error: err.message });
  }
});

const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMainModule) {
  app.listen(PORT, () => {
    console.log(`🌿 Darukaa.Earth AI Biodiversity Backend running on http://localhost:${PORT}`);
  });
}

export default app;
