"""
Darukaa.Earth AI Biodiversity Intelligence System
Session State & Multi-Turn Memory Manager
Persists user conversational context, extracted parameters, and dialogue turns.
"""

from typing import Dict, Any, List, Optional
import time
import uuid

class ConversationSession:
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.created_at = time.time()
        self.last_active = time.time()
        self.messages: List[Dict[str, Any]] = []
        # Accumulated ecological profile
        self.profile: Dict[str, Any] = {
            "soc_pct": None,
            "rainfall": None,
            "land_use": None,
            "region": None,
            "soil_ph": None,
            "tillage": None,
            "pesticides": None,
            "latitude": None,
            "longitude": None,
            "notes": []
        }
        self.clarification_requested: bool = False
        self.pending_variables: List[str] = []

    def add_message(self, role: str, content: str, metadata: Optional[Dict[str, Any]] = None):
        self.messages.append({
            "id": str(uuid.uuid4()),
            "role": role,
            "content": content,
            "timestamp": time.time(),
            "metadata": metadata or {}
        })
        self.last_active = time.time()

    def update_profile(self, new_params: Dict[str, Any]):
        for k, v in new_params.items():
            if v is not None and v != "":
                self.profile[k] = v
        self.last_active = time.time()

    def get_missing_critical_variables(self) -> List[str]:
        missing = []
        if self.profile.get("soc_pct") is None:
            missing.append("soil organic carbon %")
        if not self.profile.get("rainfall") and not self.profile.get("region"):
            missing.append("rainfall pattern / climate region")
        if not self.profile.get("land_use"):
            missing.append("current land use / crop type")
        return missing

    def is_complete_enough(self) -> bool:
        # Require at least 2 key variables (e.g., SOC + (rainfall or land_use)) or explicit diagnostic command
        provided_count = sum(1 for v in [self.profile.get("soc_pct"), self.profile.get("rainfall"), self.profile.get("land_use"), self.profile.get("region")] if v is not None)
        return provided_count >= 2

class SessionRegistry:
    def __init__(self):
        self.sessions: Dict[str, ConversationSession] = {}

    def get_or_create(self, session_id: Optional[str] = None) -> ConversationSession:
        if not session_id or session_id not in self.sessions:
            new_id = session_id or str(uuid.uuid4())
            self.sessions[new_id] = ConversationSession(new_id)
            return self.sessions[new_id]
        return self.sessions[session_id]

# Global Singleton session registry
session_registry = SessionRegistry()
