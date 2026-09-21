"""
Unit Tests for Conversational Intelligence and Dialogue State Manager
"""

import unittest
from backend.conversation.diagnostic_agent import diagnostic_agent
from backend.conversation.session_manager import session_registry

class TestConversationFlow(unittest.TestCase):
    def setUp(self):
        self.agent = diagnostic_agent

    def test_parameter_extraction(self):
        """Verify NLU regex parser accurately extracts SOC %, rainfall, crop, and region."""
        text = "My soil organic carbon is 0.3%, rainfall is low, and I am growing monoculture wheat in a semi-arid zone."
        extracted = self.agent.parse_natural_language_parameters(text)

        self.assertEqual(extracted.get("soc_pct"), 0.3)
        self.assertIn("low", extracted.get("rainfall", ""))
        self.assertIn("monoculture wheat", extracted.get("land_use", ""))
        self.assertIn("semi-arid", extracted.get("region", ""))

    def test_clarifying_question_on_incomplete_input(self):
        """
        Verify that vague user queries (e.g. 'Biodiversity is declining on my land')
        trigger targeted clarifying questions.
        """
        session_id = "test-session-incomplete"
        resp = self.agent.handle_message("Biodiversity is declining on my land", session_id=session_id)

        self.assertTrue(resp["requires_clarification"])
        self.assertEqual(resp["type"], "clarification_required")
        # Clarifying question should request missing variables
        self.assertIn("soil organic carbon %", resp["missing_variables"])
        self.assertIn("Can you provide", resp["message"])

    def test_multi_turn_accumulation(self):
        """
        Verify multi-turn memory retains state across consecutive user turns.
        Turn 1: 'I farm in a semi-arid region with low rainfall'
        Turn 2: 'My SOC is 0.3% and crop is monoculture wheat'
        -> Should execute full reasoning.
        """
        session_id = "test-multi-turn-01"
        
        # Turn 1
        resp1 = self.agent.handle_message("I farm in a semi-arid region with low rainfall", session_id=session_id)
        self.assertTrue(resp1["requires_clarification"])

        # Turn 2
        resp2 = self.agent.handle_message("My SOC is 0.3% and crop is monoculture wheat", session_id=session_id)
        self.assertFalse(resp2["requires_clarification"])
        self.assertEqual(resp2["type"], "scientific_recommendation")
        self.assertIn("reasoning_details", resp2)
        self.assertIn("Faidherbia", resp2["message"])

if __name__ == "__main__":
    unittest.main()
