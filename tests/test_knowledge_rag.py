"""
Unit Tests for Ecological RAG Knowledge Retrieval Layer
"""

import unittest
from backend.knowledge.corpus import get_all_studies
from backend.knowledge.rag_engine import rag_engine

class TestKnowledgeRAG(unittest.TestCase):
    def setUp(self):
        self.rag = rag_engine
        self.studies = get_all_studies()

    def test_corpus_integrity(self):
        """Verify scientific corpus has at least 8 peer-reviewed studies with essential metadata."""
        self.assertGreaterEqual(len(self.studies), 8)
        for s in self.studies:
            self.assertIn("id", s)
            self.assertIn("title", s)
            self.assertIn("source", s)
            self.assertIn("doi", s)
            self.assertIn("empirical_findings", s)
            self.assertIn("causal_mechanism", s)
            self.assertIn("quantified_impact", s)

    def test_rag_retrieval_semi_arid_wheat(self):
        """Verify RAG retrieves FAO and IPCC studies for semi-arid monoculture wheat query."""
        results = self.rag.retrieve(
            query="soil organic carbon semi-arid wheat monoculture agroforestry",
            climate_zone="semi-arid",
            top_k=3
        )
        self.assertGreater(len(results), 0)
        sources = [r["source"] for r in results]
        # Should include FAO or ICRAF or IPCC
        has_authoritative_source = any("FAO" in s or "IPCC" in s or "ICRAF" in s for s in sources)
        self.assertTrue(has_authoritative_source)
        self.assertGreater(results[0]["similarity_score"], 0.20)

    def test_rag_pollinator_biodiversity_retrieval(self):
        """Verify IPBES study is retrieved for pollinator habitat fragmentation queries."""
        results = self.rag.retrieve(
            query="pollinator species richness flowering hedgerows habitat connectivity",
            target_variables=["pollinator_abundance", "shannon_diversity_index"],
            top_k=2
        )
        self.assertGreater(len(results), 0)
        study_ids = [r["study_id"] for r in results]
        self.assertTrue("IPBES-2019-GLOBAL-ASSESSMENT" in study_ids or "CONSBIO-2022-INSECT-TROPHIC-NETWORKS" in study_ids)

if __name__ == "__main__":
    unittest.main()
