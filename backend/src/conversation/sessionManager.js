/**
 * Darukaa.Earth AI Biodiversity Intelligence System
 * Session Manager & Multi-Turn State Accumulator (ES Modules)
 */

export class ConversationSession {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.createdAt = Date.now();
    this.lastActive = Date.now();
    this.messages = [];
    this.profile = {
      soc_pct: null,
      rainfall: null,
      land_use: null,
      region: null,
      soil_ph: null,
      tillage: null,
      latitude: null,
      longitude: null
    };
    this.clarificationRequested = false;
    this.pendingVariables = [];
  }

  addMessage(role, content, metadata = {}) {
    this.messages.push({
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      role,
      content,
      timestamp: Date.now(),
      metadata
    });
    this.lastActive = Date.now();
  }

  updateProfile(params = {}) {
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== "") {
        this.profile[key] = params[key];
      }
    });
    this.lastActive = Date.now();
  }

  getMissingCriticalVariables() {
    const missing = [];
    if (this.profile.soc_pct === null) {
      missing.push("soil organic carbon %");
    }
    if (!this.profile.rainfall && !this.profile.region) {
      missing.push("rainfall pattern / climate region");
    }
    if (!this.profile.land_use) {
      missing.push("current land use / crop type");
    }
    return missing;
  }

  isCompleteEnough() {
    const count = [this.profile.soc_pct, this.profile.rainfall, this.profile.land_use, this.profile.region]
      .filter(v => v !== null && v !== undefined && v !== "").length;
    return count >= 2;
  }
}

export class SessionRegistry {
  constructor() {
    this.sessions = new Map();
  }

  getOrCreate(sessionId) {
    const id = sessionId || `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    if (!this.sessions.has(id)) {
      this.sessions.set(id, new ConversationSession(id));
    }
    return this.sessions.get(id);
  }
}

export const sessionRegistry = new SessionRegistry();
