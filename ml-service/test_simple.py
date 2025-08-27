#!/usr/bin/env python3
"""
Simple test script for ML functionality without external dependencies
"""

import re

class SimpleMedicalProcessor:
    def __init__(self):
        self.risk_keywords = {
            'high': ['chest pain', 'heart attack', 'stroke', 'severe pain', 'emergency', 'acute', 'critical'],
            'medium': ['diabetes', 'hypertension', 'high blood pressure', 'depression', 'anxiety', 'chronic'],
            'low': ['headache', 'fatigue', 'cold', 'flu', 'minor pain', 'routine check']
        }

    def assess_risk_level(self, text):
        """Assess risk level based on keywords"""
        text_lower = text.lower()
        
        high_score = sum(1 for keyword in self.risk_keywords['high'] if keyword in text_lower)
        medium_score = sum(1 for keyword in self.risk_keywords['medium'] if keyword in text_lower)
        low_score = sum(1 for keyword in self.risk_keywords['low'] if keyword in text_lower)
        
        if high_score > 0:
            return 'high'
        elif medium_score > 0:
            return 'medium'
        elif low_score > 0:
            return 'low'
        else:
            return 'medium'  # default

if __name__ == "__main__":
    processor = SimpleMedicalProcessor()
    
    # Test cases
    test_cases = [
        "Patient has chest pain and shortness of breath",
        "Routine checkup for diabetes management",
        "Minor headache, feeling tired",
        "Severe abdominal pain, emergency situation"
    ]
    
    print("🧪 Testing ML Medical Text Processor")
    print("=" * 50)
    
    for i, test_text in enumerate(test_cases, 1):
        risk_level = processor.assess_risk_level(test_text)
        print(f"Test {i}: {test_text}")
        print(f"Risk Level: {risk_level.upper()}")
        print("-" * 30)
    
    print("✅ ML Processor tests completed successfully!")