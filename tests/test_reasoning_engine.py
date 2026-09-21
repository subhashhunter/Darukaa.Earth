"""
Unit Tests for Multi-Metric Scientific Reasoning Engine
"""

import unittest
from backend.reasoning.ecological_model import ecological_reasoner
from backend.reasoning.causal_graph import generate_causal_chains

class TestEcologicalReasoning(unittest.TestCase):
    def setUp(self):
        self.reasoner = ecological_reasoner

    def test_example_use_case_from_pdf(self):
        """
        Tests the challenge PDF example use case:
        Input:
          - Soil organic carbon: 0.3%
          - Rainfall: low
          - Crop: monoculture wheat
          - Region: semi-arid
        Expected:
          - Multi-metric coupling >= 3 variables
          - Agroforestry / intercropping recommendation
          - Quantitative delta projections
          - Credible peer-reviewed references (FAO, IPCC, ICRAF)
        """
        payload = {
            "soc_pct": 0.3,
            "rainfall": "low",
            "land_use": "monoculture wheat",
            "region": "semi-arid"
        }
        result = self.reasoner.reason(payload)

        self.assertEqual(result["status"], "success")
        # Verify >= 3 coupled environmental variables
        self.assertGreaterEqual(result["variable_coupling_count"], 3)

        # Verify recommendations exist and are non-shallow
        recs = result["recommendations"]
        self.assertGreaterEqual(len(recs), 1)
        primary_rec = recs[0]
        
        self.assertIn("what_to_do", primary_rec)
        self.assertIn("why_it_works", primary_rec)
        self.assertIn("impacted_metrics", primary_rec)
        self.assertIn("primary_reference", primary_rec)

        # Verify mention of agroforestry / intercropping
        combined_text = (primary_rec["title"] + " " + primary_rec["what_to_do"]).lower()
        self.assertTrue("agroforestry" in combined_text or "intercrop" in combined_text or "faidherbia" in combined_text)

        # Verify quantitative projections structure
        projections = result["quantitative_projections"]
        self.assertIn("baseline", projections)
        self.assertIn("time_horizons", projections)
        self.assertIn("medium_term_3yr", projections["time_horizons"])
        self.assertGreater(projections["time_horizons"]["medium_term_3yr"]["soc_pct"], 0.3)

    def test_causal_chains_structure(self):
        """Verify causal chains provide stage-by-stage biochemical pathways."""
        chains = generate_causal_chains("semi_arid_agroforestry_wheat")
        self.assertGreaterEqual(len(chains), 1)
        nodes = chains[0]["nodes"]
        self.assertGreaterEqual(len(nodes), 3)
        self.assertIn("stage", nodes[0])
        self.assertIn("title", nodes[0])
        self.assertIn("description", nodes[0])

if __name__ == "__main__":
    unittest.main()
