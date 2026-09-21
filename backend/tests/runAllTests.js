/**
 * Automated Verification Suite for Darukaa.Earth AI Biodiversity Intelligence Backend
 * ES Modules format
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { getAllStudies } from '../src/knowledge/corpus.js';
import { ragEngine } from '../src/knowledge/ragEngine.js';
import { ecologicalReasoner } from '../src/reasoning/ecologicalModel.js';
import { diagnosticAgent } from '../src/conversation/diagnosticAgent.js';
import { geoResolver } from '../src/spatial/geoResolver.js';
import { createSubmissionDocx } from '../src/submission/generateDocx.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTests() {
  console.log("=================================================");
  console.log("🧪 RUNNING AI BIODIVERSITY INTELLIGENCE TEST SUITE (ES MODULES)");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (e) {
      console.error(`❌ FAIL: ${name}`);
      console.error(e);
      failed++;
    }
  }

  async function asyncTest(name, fn) {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (e) {
      console.error(`❌ FAIL: ${name}`);
      console.error(e);
      failed++;
    }
  }

  // 1. Corpus Integrity Test
  test("Knowledge Corpus Integrity", () => {
    const studies = getAllStudies();
    assert(studies.length >= 8, "Expected at least 8 peer-reviewed studies");
    studies.forEach(s => {
      assert(s.id, "Missing ID");
      assert(s.title, "Missing title");
      assert(s.source, "Missing source");
      assert(s.doi, "Missing DOI");
      assert(s.empirical_findings, "Missing empirical findings");
      assert(s.causal_mechanism, "Missing causal mechanism");
      assert(s.quantified_impact, "Missing quantified impact");
    });
  });

  // 2. RAG Retrieval Test
  test("RAG Hybrid Search & Source Grounding", () => {
    const results = ragEngine.retrieve("soil organic carbon semi-arid wheat monoculture agroforestry", {
      climate_zone: "semi-arid",
      top_k: 3
    });
    assert(results.length > 0, "Expected at least 1 retrieved study");
    const sources = results.map(r => r.source).join(' ');
    assert(sources.includes("FAO") || sources.includes("IPCC") || sources.includes("ICRAF"), "Expected FAO/IPCC/ICRAF in sources");
    assert(results[0].similarity_score > 0.20, "Expected similarity score > 0.20");
  });

  // 3. Multi-Metric Reasoning Test (PDF Benchmark Case)
  test("Multi-Metric Coupling & Non-Shallow Reasoning (>= 3 variables)", () => {
    const payload = {
      soc_pct: 0.3,
      rainfall: "low",
      land_use: "monoculture wheat",
      region: "semi-arid"
    };
    const result = ecologicalReasoner.reason(payload);
    assert.strictEqual(result.status, "success");
    assert(result.variable_coupling_count >= 3, "Must couple at least 3 environmental variables");

    const recs = result.recommendations;
    assert(recs.length >= 1, "Must generate actionable recommendations");
    const primary = recs[0];
    assert(primary.what_to_do, "Missing what_to_do");
    assert(primary.why_it_works, "Missing why_it_works");
    assert(primary.impacted_metrics.length >= 3, "Must quantify at least 3 impacted metrics");
    assert(primary.primary_reference.citation, "Must cite credible peer-reviewed source");

    const proj = result.quantitative_projections;
    assert(proj.time_horizons.medium_term_3yr.soc_pct > 0.3, "Projected SOC must show positive growth");
  });

  // 4. Conversational Intelligence & Clarifying Question Test
  test("Dialogue Agent: Clarifying Questions on Incomplete Query", () => {
    const resp = diagnosticAgent.handleMessage("Biodiversity is declining on my land", "test-session-clarify");
    assert.strictEqual(resp.requires_clarification, true);
    assert.strictEqual(resp.type, "clarification_required");
    assert(resp.missing_variables.includes("soil organic carbon %"));
    assert(resp.message.includes("Can you provide"));
  });

  // 5. Multi-Turn Accumulation Test
  test("Dialogue Agent: Multi-Turn Context Accumulation", () => {
    const sessionId = "test-session-accumulate";
    // Turn 1
    const r1 = diagnosticAgent.handleMessage("I farm in a semi-arid region with low rainfall", sessionId);
    assert.strictEqual(r1.requires_clarification, true);

    // Turn 2
    const r2 = diagnosticAgent.handleMessage("My SOC is 0.3% and crop is monoculture wheat", sessionId);
    assert.strictEqual(r2.requires_clarification, false);
    assert.strictEqual(r2.type, "scientific_recommendation");
    assert(r2.reasoning_details.recommendations.length > 0);
  });

  // 6. Spatial Resolver Test
  test("Geo-Spatial Context Resolution", () => {
    const geo = geoResolver.resolve(18.5204, 73.8567);
    assert(geo.region_id === "DECCAN_SEMI_ARID" || geo.climate_zone.includes("semi-arid"));
  });

  // 7. Word Document Generator Test
  await asyncTest("Submission Word Document (.docx) Generation", async () => {
    const testDocPath = path.join(__dirname, 'test_output.docx');
    await createSubmissionDocx(testDocPath);
    assert(fs.existsSync(testDocPath), "Generated .docx file must exist");
    const stat = fs.statSync(testDocPath);
    assert(stat.size > 5000, "Docx file should be properly formatted and > 5KB");
    fs.unlinkSync(testDocPath);
  });

  console.log("\n=================================================");
  console.log(`RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
