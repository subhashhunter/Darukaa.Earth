"""
Darukaa.Earth AI Biodiversity Intelligence System
FastAPI Backend Server & Scientific API
Provides endpoints for Multi-Turn Conversational Intelligence,
Multi-Metric Ecological Reasoning, RAG Knowledge Retrieval, Spatial Lookup, and Document Export.
"""

import os
from typing import Dict, Any, Optional, List
from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field

from backend.knowledge.rag_engine import rag_engine
from backend.knowledge.corpus import get_all_studies
from backend.reasoning.ecological_model import ecological_reasoner
from backend.conversation.diagnostic_agent import diagnostic_agent
from backend.conversation.session_manager import session_registry
from backend.spatial.geo_resolver import geo_resolver
from submission.generate_submission_doc import create_submission_docx

app = FastAPI(
    title="Darukaa.Earth AI Biodiversity Intelligence Engine",
    description="Knowledge-grounded AI Environmental Scientist for multi-variable ecological reasoning.",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class ChatRequest(BaseModel):
    message: str = Field(..., description="User message or query")
    session_id: Optional[str] = Field(None, description="Optional persistent session identifier")
    direct_profile: Optional[Dict[str, Any]] = Field(None, description="Optional explicit structured parameters")

class StructuredReasoningRequest(BaseModel):
    soc_pct: Optional[float] = Field(None, description="Soil Organic Carbon % (e.g. 0.3)")
    rainfall: Optional[str] = Field(None, description="Precipitation pattern or category (e.g. low, semi-arid, 350mm)")
    land_use: Optional[str] = Field(None, description="Current land use or crop (e.g. monoculture wheat)")
    region: Optional[str] = Field(None, description="Climate region or biome (e.g. semi-arid)")
    soil_ph: Optional[float] = Field(None, description="Soil pH level (e.g. 6.5)")
    tillage: Optional[str] = Field(None, description="Tillage practice (e.g. conventional plowing, zero-till)")
    latitude: Optional[float] = Field(None, description="Geo-latitude coordinate")
    longitude: Optional[float] = Field(None, description="Geo-longitude coordinate")
    custom_notes: Optional[str] = Field(None, description="Additional contextual notes")

# API Endpoints

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "system": "Darukaa.Earth AI Biodiversity Intelligence Engine",
        "indexed_scientific_studies": len(get_all_studies()),
        "authoritative_sources": ["FAO", "IPCC AR6", "IPBES", "ICRAF", "Nature", "Science", "USDA NRCS"],
        "reasoning_mode": "Multi-Metric Ecological Coupled Model (>= 3 variables)"
    }

@app.post("/api/chat")
def chat_endpoint(req: ChatRequest):
    """
    Multi-turn conversational intelligence endpoint.
    Extracts parameters, prompts clarifying questions if incomplete, and delivers
    grounded scientific reasoning.
    """
    try:
        response = diagnostic_agent.handle_message(
            message=req.message,
            session_id=req.session_id,
            direct_profile=req.direct_profile
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/reason")
def direct_reasoning_endpoint(req: StructuredReasoningRequest):
    """
    Direct structured parameter reasoning endpoint.
    Performs multi-variable diagnosis across >= 3 variables and projects
    quantitative trajectory matrices.
    """
    try:
        data = req.model_dump()
        result = ecological_reasoner.reason(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/knowledge")
def search_knowledge(
    query: Optional[str] = Query(None, description="Search query"),
    climate_zone: Optional[str] = Query(None, description="Filter by climate zone"),
    limit: int = Query(10, description="Max results")
):
    """
    Query and inspect the structured peer-reviewed scientific knowledge corpus.
    """
    if query:
        results = rag_engine.retrieve(query=query, climate_zone=climate_zone, top_k=limit)
        return {"query": query, "count": len(results), "studies": results}
    else:
        all_studies = get_all_studies()
        return {"count": len(all_studies), "studies": all_studies[:limit]}

@app.get("/api/spatial/lookup")
def spatial_lookup(lat: float = Query(...), lon: float = Query(...)):
    """
    Resolve geographic coordinates into regional biome, Köppen climate, and baseline soil metrics.
    """
    info = geo_resolver.resolve(lat, lon)
    return {"latitude": lat, "longitude": lon, "spatial_context": info}

@app.get("/api/spatial/ecoregions")
def get_known_ecoregions():
    """
    List predefined benchmark ecoregions.
    """
    return {"ecoregions": geo_resolver.list_known_regions()}

@app.get("/api/export/docx")
def export_submission_doc():
    """
    Generates and returns the official Hackathon Word Submission Document (.docx).
    """
    doc_path = os.path.join(os.getcwd(), "Darukaa_Earth_AI_Biodiversity_Submission.docx")
    create_submission_docx(doc_path)
    if os.path.exists(doc_path):
        return FileResponse(
            path=doc_path,
            filename="Darukaa_Earth_AI_Biodiversity_Submission.docx",
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
    raise HTTPException(status_code=500, detail="Failed to generate document.")

# Static files for Frontend Dashboard
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
