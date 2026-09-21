/**
 * Darukaa.Earth AI Biodiversity Intelligence System
 * Diagnostic Conversational Agent (ES Modules)
 */

import { sessionRegistry } from './sessionManager.js';
import { ecologicalReasoner } from '../reasoning/ecologicalModel.js';
import { geoResolver } from '../spatial/geoResolver.js';

export class DiagnosticAgent {
  constructor() {
    this.reasoner = ecologicalReasoner;
  }

  parseNaturalLanguageParameters(text) {
    const extracted = {};
    const lower = text.toLowerCase();

    // 1. SOC %
    const socMatch = lower.match(/(?:soc|soil\s+organic\s+carbon|carbon|organic\s+matter)\s*(?:is|:|=)?\s*([0-9]+(?:\.[0-9]+)?)\s*%/i)
      || lower.match(/([0-9]+(?:\.[0-9]+)?)\s*%\s*(?:soc|soil\s+organic\s+carbon|organic\s+carbon|carbon)/i)
      || lower.match(/(?:soc|soil\s+organic\s+carbon)\s*(?:is|:|=)?\s*([0-9]+(?:\.[0-9]+)?)/i);

    if (socMatch) {
      extracted.soc_pct = parseFloat(socMatch[1]);
    }

    // 2. Rainfall
    const rainMatch = lower.match(/(?:rainfall|precipitation|rain)\s*(?:is|:|=)?\s*([a-zA-Z0-9\-_<>\s]+?)(?:,|\.|\n|$|and)/i);
    if (rainMatch) {
      const val = rainMatch[1].trim();
      if (["low", "semi-arid", "arid", "dry", "moderate", "high", "mm"].some(w => val.includes(w))) {
        extracted.rainfall = val;
      }
    } else if (lower.includes("low rainfall") || lower.includes("sparse rainfall") || lower.includes("drought")) {
      extracted.rainfall = "low (semi-arid)";
    } else if (lower.includes("high rainfall") || lower.includes("tropical rainfall")) {
      extracted.rainfall = "high (>1200mm)";
    }

    // 3. Crop / Land Use
    const cropMatch = lower.match(/(?:crop|crops|land\s+use|farming|planted\s+with|grow|growing)\s*(?:is|:|=)?\s*([a-zA-Z0-9\-_/\s]+?)(?:,|\.|\n|$|and|in)/i);
    if (cropMatch && cropMatch[1].trim().length > 2) {
      extracted.land_use = cropMatch[1].trim();
    }
    if (!extracted.land_use) {
      if (lower.includes("monoculture wheat") || lower.includes("wheat monoculture") || lower.includes("wheat")) {
        extracted.land_use = "monoculture wheat";
      } else if (lower.includes("monoculture")) {
        extracted.land_use = "monoculture cropland";
      } else if (lower.includes("pasture") || lower.includes("grazing")) {
        extracted.land_use = "grazing pasture";
      }
    }

    // 4. Region / Climate Zone
    const regionMatch = lower.match(/(?:region|climate|zone|biome|location)\s*(?:is|:|=)?\s*([a-zA-Z0-9\-_/\s]+?)(?:,|\.|\n|$|and)/i);
    if (regionMatch && regionMatch[1].trim().length > 2) {
      extracted.region = regionMatch[1].trim();
    }
    if (!extracted.region) {
      if (lower.includes("semi-arid") || lower.includes("semi arid")) {
        extracted.region = "semi-arid";
      } else if (lower.includes("arid")) {
        extracted.region = "arid drylands";
      } else if (lower.includes("mediterranean")) {
        extracted.region = "mediterranean";
      } else if (lower.includes("tropical")) {
        extracted.region = "tropical";
      } else if (lower.includes("temperate")) {
        extracted.region = "temperate";
      }
    }

    // 5. Soil pH
    const phMatch = lower.match(/(?:ph|soil\s+ph)\s*(?:is|:|=)?\s*([0-9]+(?:\.[0-9]+)?)/i);
    if (phMatch) {
      extracted.soil_ph = parseFloat(phMatch[1]);
    }

    // 6. Coordinates
    const geoMatch = lower.match(/(-?[0-9]+\.[0-9]+)\s*,\s*(-?[0-9]+\.[0-9]+)/);
    if (geoMatch) {
      extracted.latitude = parseFloat(geoMatch[1]);
      extracted.longitude = parseFloat(geoMatch[2]);
    }

    return extracted;
  }

  handleMessage(message, sessionId, directProfile = null) {
    const session = sessionRegistry.getOrCreate(sessionId);
    session.addMessage("user", message);

    const extracted = this.parseNaturalLanguageParameters(message);

    if (directProfile) {
      Object.keys(directProfile).forEach(k => {
        if (directProfile[k] !== null && directProfile[k] !== undefined && directProfile[k] !== "") {
          extracted[k] = directProfile[k];
        }
      });
    }

    if (extracted.latitude && extracted.longitude) {
      const geoInfo = geoResolver.resolve(extracted.latitude, extracted.longitude);
      if (geoInfo) {
        if (!extracted.region) extracted.region = geoInfo.climate_zone;
        if (!extracted.rainfall) extracted.rainfall = geoInfo.annual_precipitation_avg;
        if (extracted.soc_pct === undefined && geoInfo.typical_soc_pct) extracted.soc_pct = geoInfo.typical_soc_pct;
      }
    }

    session.updateProfile(extracted);

    const lowerMsg = message.toLowerCase();
    const isGreeting = ["hello", "hi", "hey", "who are you"].some(w => lowerMsg.includes(w)) && lowerMsg.split(/\s+/).length < 4;
    const isVagueQuery = (lowerMsg.includes("declining") || lowerMsg.includes("dying") || lowerMsg.includes("help") || lowerMsg.includes("improve") || lowerMsg.includes("poor")) && !session.isCompleteEnough();

    const missingVars = session.getMissingCriticalVariables();

    if (isGreeting) {
      const reply = (
        "Welcome to **Darukaa.Earth AI Biodiversity Intelligence**. I am an AI Environmental Scientist specialized " +
        "in multi-metric ecological reasoning and evidence-backed land restoration.\n\n" +
        "To formulate a scientifically grounded diagnostic and restoration plan, please describe your land context, including:\n" +
        "• **Soil Organic Carbon %** (e.g., 0.3%)\n" +
        "• **Rainfall / Climate Regime** (e.g., semi-arid, 350mm/yr)\n" +
        "• **Current Land Use / Crop** (e.g., monoculture wheat)\n" +
        "• *Optional*: Soil pH, Tillage practices, or Geo-coordinates."
      );
      session.addMessage("assistant", reply, { type: "greeting" });
      return {
        session_id: session.sessionId,
        type: "greeting",
        message: reply,
        accumulated_profile: session.profile,
        missing_variables: missingVars,
        requires_clarification: true
      };
    }

    if (!session.isCompleteEnough() || (isVagueQuery && missingVars.length >= 2)) {
      const missingFormatted = missingVars.join(", ");
      const reply = (
        `To diagnose the ecological dynamics and prescribe precise evidence-backed recommendations, I need a few specific environmental parameters.\n\n` +
        `👉 **Can you provide your ${missingFormatted}?**\n\n` +
        `*Example Context:* \`Soil organic carbon: 0.3%, Rainfall: low (semi-arid), Crop: monoculture wheat\``
      );
      session.clarificationRequested = true;
      session.pendingVariables = missingVars;
      session.addMessage("assistant", reply, { type: "clarification_question", missing_variables: missingVars });

      return {
        session_id: session.sessionId,
        type: "clarification_required",
        message: reply,
        accumulated_profile: session.profile,
        missing_variables: missingVars,
        requires_clarification: true
      };
    }

    const reasoningResult = this.reasoner.reason(session.profile);
    const primaryRec = reasoningResult.recommendations[0];

    let summaryMessage = (
      `### 🔬 Scientific Ecological Assessment & Multi-Metric Diagnosis\n\n` +
      `**Coupled Environmental Variables Analyzed (${reasoningResult.variable_coupling_count} parameters):**\n` +
      `• **Soil Health**: Soil Organic Carbon (${session.profile.soc_pct || '0.3'}%)\n` +
      `• **Hydrological / Climate Regime**: ${session.profile.rainfall || 'Semi-Arid'}\n` +
      `• **Land Cover**: ${session.profile.land_use || 'Monoculture Wheat'}\n` +
      `• **Ecological Biota**: Microbial active biomass & pollinator connectivity\n\n` +
      `#### 🎯 Recommended Actionable Intervention\n` +
      `**${primaryRec.title}**\n\n` +
      `**What to do:**\n${primaryRec.what_to_do}\n\n` +
      `**Why it works (Biochemical & Hydrological Mechanism):**\n${primaryRec.why_it_works}\n\n` +
      `**Quantitative Trajectory & Impacted Metrics:**\n`
    );

    primaryRec.impacted_metrics.forEach(m => {
      summaryMessage += `• **${m.metric}**: ${m.delta} *(Ref: ${m.evidence})*\n`;
    });

    summaryMessage += `\n**Time Horizon**: ${primaryRec.time_horizon} | **Confidence**: ${primaryRec.confidence_level}\n`;
    summaryMessage += `**Primary Peer-Reviewed Reference**: \`${primaryRec.primary_reference.citation}\`\n`;

    session.addMessage("assistant", summaryMessage, {
      type: "scientific_recommendation",
      reasoning_data: reasoningResult
    });

    return {
      session_id: session.sessionId,
      type: "scientific_recommendation",
      message: summaryMessage,
      accumulated_profile: session.profile,
      missing_variables: [],
      requires_clarification: false,
      reasoning_details: reasoningResult
    };
  }
}

export const diagnosticAgent = new DiagnosticAgent();
