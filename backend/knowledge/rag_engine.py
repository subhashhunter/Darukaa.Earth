"""
Darukaa.Earth AI Biodiversity Intelligence System
Hybrid Knowledge Retrieval Engine (RAG)
Combines TF-IDF vector space modeling, keyword matching, and multi-variable taxonomy filtering.
"""

from typing import List, Dict, Any, Optional
import math
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .corpus import get_all_studies

class EcologicalRAGEngine:
    def __init__(self):
        self.studies = get_all_studies()
        self.vectorizer = TfidfVectorizer(
            stop_words='english',
            ngram_range=(1, 2),
            sublinear_tf=True
        )
        self._build_index()

    def _build_index(self):
        # Build composite searchable document text for each study
        self.corpus_docs = []
        for s in self.studies:
            doc_text = f"{s['title']} {s['source']} {' '.join(s['domain'])} {' '.join(s['keywords'])} " \
                       f"{' '.join(s['climate_zones'])} {' '.join(s['target_variables'])} " \
                       f"{s['empirical_findings']} {s['causal_mechanism']}"
            self.corpus_docs.append(doc_text.lower())
        
        self.tfidf_matrix = self.vectorizer.fit_transform(self.corpus_docs)

    def retrieve(
        self, 
        query: str, 
        climate_zone: Optional[str] = None,
        target_variables: Optional[List[str]] = None,
        top_k: int = 3,
        threshold: float = 0.10
    ) -> List[Dict[str, Any]]:
        """
        Performs hybrid retrieval scoring combining TF-IDF vector similarity with
        domain variable and climate zone boosts.
        """
        cleaned_query = query.lower()
        query_vec = self.vectorizer.transform([cleaned_query])
        similarities = cosine_similarity(query_vec, self.tfidf_matrix)[0]

        scored_results = []
        for idx, study in enumerate(self.studies):
            base_score = float(similarities[idx])
            boost = 0.0

            # Boost if matching climate zone
            if climate_zone and any(climate_zone.lower() in cz.lower() for cz in study["climate_zones"]):
                boost += 0.15

            # Boost if matching specific target variables
            if target_variables:
                matched_vars = [v for v in target_variables if any(v.lower() in tv.lower() for tv in study["target_variables"])]
                boost += 0.08 * len(matched_vars)

            # Keyword direct match bonus
            query_tokens = set(re.findall(r'\w+', cleaned_query))
            study_keywords = set(k.lower() for k in study["keywords"])
            keyword_overlap = len(query_tokens.intersection(study_keywords))
            boost += 0.04 * min(keyword_overlap, 4)

            final_score = min(1.0, base_score + boost)

            if final_score >= threshold or base_score > 0.05:
                scored_results.append({
                    "study_id": study["id"],
                    "title": study["title"],
                    "source": study["source"],
                    "year": study["year"],
                    "doi": study["doi"],
                    "domain": study["domain"],
                    "climate_zones": study["climate_zones"],
                    "target_variables": study["target_variables"],
                    "empirical_findings": study["empirical_findings"],
                    "causal_mechanism": study["causal_mechanism"],
                    "quantified_impact": study["quantified_impact"],
                    "time_horizon": study["time_horizon"],
                    "similarity_score": round(final_score, 4),
                    "confidence_score": study["confidence_score"]
                })

        # Sort by similarity score descending
        scored_results.sort(key=lambda x: x["similarity_score"], reverse=True)
        return scored_results[:top_k]

# Global Singleton instance
rag_engine = EcologicalRAGEngine()
