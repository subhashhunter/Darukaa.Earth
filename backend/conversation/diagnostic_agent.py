"""
Darukaa.Earth AI Biodiversity Intelligence System
Diagnostic Conversational Agent
Handles natural language parameter extraction, multi-turn clarification questions,
and scientific response synthesis.
"""

from typing import Dict, Any, Tuple, Optional
import re
from .session_manager import session_registry, ConversationSession
from backend.reasoning.ecological_model import ecological_reasoner
from backend.spatial.geo_resolver import geo_resolver

class DiagnosticAgent:
    def __init__(self):
        self.reasoner = ecological_reasoner

    def parse_natural_language_parameters(self, text: str) -> Dict[str, Any]:
        """
        Extracts ecological and soil variables from unstructured natural language text.
        """
        extracted: Dict[str, Any] = {}
        lower_text = text.lower()

        # 1. Soil Organic Carbon (SOC) Extraction (e.g., '0.3% carbon', 'soc: 0.3%', 'soc is 0.45%')
        soc_match = re.search(r'(?:soc|soil\s+organic\s+carbon|carbon|organic\s+matter)\s*(?:is|:|=)?\s*([0-9]+(?:\.[0-9]+)?)\s*%', lower_text)
        if not soc_match:
            soc_match = re.search(r'([0-9]+(?:\.[0-9]+)?)\s*%\s*(?:soc|soil\s+organic\s+carbon|organic\s+carbon|carbon)', lower_text)
        if not soc_match:
            # Check standalone e.g. "soil organic carbon: 0.3"
            soc_match = re.search(r'(?:soc|soil\s+organic\s+carbon)\s*(?:is|:|=)?\s*([0-9]+(?:\.[0-9]+)?)', lower_text)
        if soc_match:
            try:
                extracted["soc_pct"] = float(soc_match.group(1))
            except ValueError:
                pass

        # 2. Rainfall Extraction (e.g. 'rainfall: low', 'low rainfall', '350mm rainfall', 'semi-arid rainfall')
        rain_match = re.search(r'(?:rainfall|precipitation|rain)\s*(?:is|:|=)?\s*([a-zA-Z0-9\-_<>\s]+?)(?:,|\.|\n|$|and)', lower_text)
        if rain_match:
            val = rain_match.group(1).strip()
            if any(w in val for w in ["low", "semi-arid", "arid", "dry", "moderate", "high", "mm"]):
                extracted["rainfall"] = val
        elif "low rainfall" in lower_text or "sparse rainfall" in lower_text or "drought" in lower_text:
            extracted["rainfall"] = "low (semi-arid)"
        elif "high rainfall" in lower_text or "tropical rainfall" in lower_text:
            extracted["rainfall"] = "high (>1200mm)"

        # 3. Crop / Land Use Extraction
        crop_match = re.search(r'(?:crop|crops|land\s+use|farming|planted\s+with|grow|growing)\s*(?:is|:|=)?\s*([a-zA-Z0-9\-_/\s]+?)(?:,|\.|\n|$|and|in)', lower_text)
        if crop_match:
            val = crop_match.group(1).strip()
            if len(val) > 2:
                extracted["land_use"] = val
        if not extracted.get("land_use"):
            if "monoculture wheat" in lower_text or "wheat monoculture" in lower_text or "wheat" in lower_text:
                extracted["land_use"] = "monoculture wheat"
            elif "monoculture" in lower_text:
                extracted["land_use"] = "monoculture cropland"
            elif "pasture" in lower_text or "grazing" in lower_text:
                extracted["land_use"] = "grazing pasture"
            elif "agroforestry" in lower_text:
                extracted["land_use"] = "agroforestry"

        # 4. Region / Climate Zone Extraction
        region_match = re.search(r'(?:region|climate|zone|biome|location)\s*(?:is|:|=)?\s*([a-zA-Z0-9\-_/\s]+?)(?:,|\.|\n|$|and)', lower_text)
        if region_match:
            val = region_match.group(1).strip()
            if len(val) > 2:
                extracted["region"] = val
        if not extracted.get("region"):
            if "semi-arid" in lower_text or "semi arid" in lower_text:
                extracted["region"] = "semi-arid"
            elif "arid" in lower_text:
                extracted["region"] = "arid drylands"
            elif "mediterranean" in lower_text:
                extracted["region"] = "mediterranean"
            elif "tropical" in lower_text:
                extracted["region"] = "tropical"
            elif "temperate" in lower_text:
                extracted["region"] = "temperate"

        # 5. Soil pH Extraction
        ph_match = re.search(r'(?:ph|soil\s+ph)\s*(?:is|:|=)?\s*([0-9]+(?:\.[0-9]+)?)', lower_text)
        if ph_match:
            try:
                extracted["soil_ph"] = float(ph_match.group(1))
            except ValueError:
                pass

        # 6. Geo coordinates (lat/long) extraction
        geo_match = re.search(r'(-?[0-9]+\.[0-9]+)\s*,\s*(-?[0-9]+\.[0-9]+)', lower_text)
        if geo_match:
            try:
                extracted["latitude"] = float(geo_match.group(1))
                extracted["longitude"] = float(geo_match.group(2))
            except ValueError:
                pass

        return extracted

    def handle_message(self, message: str, session_id: Optional[str] = None, direct_profile: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Core conversational intelligence workflow:
        1. Extract variables from user natural language query
        2. Merge with session memory profile
        3. Check completeness
        4. If incomplete -> Ask clarifying questions
        5. If complete -> Execute Multi-Metric Ecological Reasoning & Knowledge Grounding
        """
        session = session_registry.get_or_create(session_id)
        session.add_message("user", message)

        # 1. Parse parameters from current user prompt
        extracted = self.parse_natural_language_parameters(message)

        # Merge direct structured profile parameters if provided
        if direct_profile:
            for k, v in direct_profile.items():
                if v is not None and v != "":
                    extracted[k] = v

        # If coordinates are present, resolve spatial context
        if extracted.get("latitude") and extracted.get("longitude"):
            geo_info = geo_resolver.resolve(extracted["latitude"], extracted["longitude"])
            if geo_info:
                if not extracted.get("region"):
                    extracted["region"] = geo_info.get("climate_zone")
                if not extracted.get("rainfall"):
                    extracted["rainfall"] = geo_info.get("annual_precipitation_avg")
                if extracted.get("soc_pct") is None and geo_info.get("typical_soc_pct"):
                    extracted["soc_pct"] = geo_info.get("typical_soc_pct")

        session.update_profile(extracted)

        # 2. Check for explicit trigger words or completeness
        lower_msg = message.lower()
        is_generic_greeting = any(w in lower_msg for w in ["hello", "hi", "hey", "who are you"]) and len(lower_msg.split()) < 4
        is_incomplete_vague_query = ("declining" in lower_msg or "dying" in lower_msg or "help" in lower_msg or "improve" in lower_msg or "poor" in lower_msg) and not session.is_complete_enough()

        missing_vars = session.get_missing_critical_variables()

        if is_generic_greeting:
            reply_text = (
                "Welcome to **Darukaa.Earth AI Biodiversity Intelligence**. I am an AI Environmental Scientist specialized "
                "in multi-metric ecological reasoning and evidence-backed land restoration.\n\n"
                "To formulate a scientifically grounded diagnostic and restoration plan, please describe your land context, including:\n"
                "• **Soil Organic Carbon %** (e.g., 0.3%)\n"
                "• **Rainfall / Climate Regime** (e.g., semi-arid, 350mm/yr)\n"
                "• **Current Land Use / Crop** (e.g., monoculture wheat)\n"
                "• *Optional*: Soil pH, Tillage practices, or Geo-coordinates."
            )
            session.add_message("assistant", reply_text, {"type": "greeting"})
            return {
                "session_id": session.session_id,
                "type": "greeting",
                "message": reply_text,
                "accumulated_profile": session.profile,
                "missing_variables": missing_vars,
                "requires_clarification": True
            }

        # 3. Conversational Intelligence: Ask Clarifying Questions when incomplete
        if not session.is_complete_enough() or (is_incomplete_vague_query and len(missing_vars) >= 2):
            missing_formatted = ", ".join(missing_vars)
            reply_text = (
                f"To diagnose the ecological dynamics and prescribe precise evidence-backed recommendations, I need a few specific environmental parameters.\n\n"
                f"👉 **Can you provide your {missing_formatted}?**\n\n"
                f"*Example Context:* `Soil organic carbon: 0.3%, Rainfall: low (semi-arid), Crop: monoculture wheat`"
            )
            session.clarification_requested = True
            session.pending_variables = missing_vars
            session.add_message("assistant", reply_text, {"type": "clarification_question", "missing_variables": missing_vars})

            return {
                "session_id": session.session_id,
                "type": "clarification_required",
                "message": reply_text,
                "accumulated_profile": session.profile,
                "missing_variables": missing_vars,
                "requires_clarification": True
            }

        # 4. Input is complete -> Run Multi-Metric Scientific Reasoning Engine
        reasoning_result = self.reasoner.reason(session.profile)

        # Synthesize clear, scientific conversational response
        soc_val = session.profile.get('soc_pct', '0.3%')
        rain_val = session.profile.get('rainfall', 'Semi-Arid')
        land_val = session.profile.get('land_use', 'Monoculture Wheat')

        recs = reasoning_result["recommendations"]
        primary_rec = recs[0]

        summary_message = (
            f"### 🔬 Scientific Ecological Assessment & Multi-Metric Diagnosis\n\n"
            f"**Coupled Environmental Variables Analyzed ({reasoning_result['variable_coupling_count']} parameters):**\n"
            f"• **Soil Health**: Soil Organic Carbon ({soc_val}%)\n"
            f"• **Hydrological / Climate Regime**: {rain_val}\n"
            f"• **Land Cover**: {land_val}\n"
            f"• **Ecological Biota**: Microbial active biomass & pollinator connectivity\n\n"
            f"#### 🎯 Recommended Actionable Intervention\n"
            f"**{primary_rec['title']}**\n\n"
            f"**What to do:**\n{primary_rec['what_to_do']}\n\n"
            f"**Why it works (Biochemical & Hydrological Mechanism):**\n{primary_rec['why_it_works']}\n\n"
            f"**Quantitative Trajectory & Impacted Metrics:**\n"
        )

        for m in primary_rec["impacted_metrics"]:
            summary_message += f"• **{m['metric']}**: {m['delta']} *(Ref: {m['evidence']})*\n"

        summary_message += f"\n**Time Horizon**: {primary_rec['time_horizon']} | **Confidence**: {primary_rec['confidence_level']}\n"
        summary_message += f"**Primary Peer-Reviewed Reference**: `{primary_rec['primary_reference']['citation']}`\n"

        session.add_message("assistant", summary_message, {
            "type": "scientific_recommendation",
            "reasoning_data": reasoning_result
        })

        return {
            "session_id": session.session_id,
            "type": "scientific_recommendation",
            "message": summary_message,
            "accumulated_profile": session.profile,
            "missing_variables": [],
            "requires_clarification": False,
            "reasoning_details": reasoning_result
        }

# Global Singleton instance
diagnostic_agent = DiagnosticAgent()
