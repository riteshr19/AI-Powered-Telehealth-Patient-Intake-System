from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import re
import json
import os

app = Flask(__name__)
CORS(app)

class MedicalTextProcessor:
    def __init__(self):
        self.risk_keywords = {
            'high': ['chest pain', 'heart attack', 'stroke', 'severe pain', 'emergency', 'acute', 'critical'],
            'medium': ['diabetes', 'hypertension', 'high blood pressure', 'depression', 'anxiety', 'chronic'],
            'low': ['headache', 'fatigue', 'cold', 'flu', 'minor pain', 'routine check']
        }
        
        self.symptom_categories = {
            'cardiovascular': ['chest pain', 'heart palpitations', 'shortness of breath', 'dizziness'],
            'neurological': ['headache', 'migraine', 'dizziness', 'confusion', 'memory loss'],
            'respiratory': ['cough', 'shortness of breath', 'asthma', 'breathing difficulty'],
            'gastrointestinal': ['nausea', 'vomiting', 'abdominal pain', 'diarrhea', 'constipation'],
            'musculoskeletal': ['joint pain', 'back pain', 'muscle ache', 'arthritis']
        }

    def extract_key_information(self, text):
        """Extract key medical information from text"""
        text_lower = text.lower()
        
        # Extract symptoms
        symptoms = []
        for category, symptom_list in self.symptom_categories.items():
            for symptom in symptom_list:
                if symptom in text_lower:
                    symptoms.append({'symptom': symptom, 'category': category})
        
        # Extract medications (simple pattern matching)
        medication_pattern = r'\b\w+(?:mg|ml|tablets?|pills?|capsules?)\b'
        medications = re.findall(medication_pattern, text_lower)
        
        # Extract durations and frequencies
        duration_pattern = r'\b(?:for\s+)?(\d+)\s+(day|week|month|year)s?\b'
        durations = re.findall(duration_pattern, text_lower)
        
        return {
            'symptoms': symptoms,
            'medications': medications,
            'durations': durations
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

    def generate_summary(self, form_data):
        """Generate AI summary of the intake form"""
        chief_complaint = form_data.get('chiefComplaint', '')
        medical_history = form_data.get('medicalHistory', '')
        current_medications = form_data.get('currentMedications', '')
        
        # Extract key information
        extracted_info = self.extract_key_information(chief_complaint + ' ' + medical_history)
        
        # Generate summary
        summary_parts = []
        
        if chief_complaint:
            summary_parts.append(f"Patient presents with: {chief_complaint}")
        
        if extracted_info['symptoms']:
            symptom_categories = set([s['category'] for s in extracted_info['symptoms']])
            summary_parts.append(f"Symptoms involve: {', '.join(symptom_categories)} systems")
        
        if medical_history:
            summary_parts.append(f"Relevant medical history noted")
        
        if current_medications:
            summary_parts.append(f"Currently taking medications")
        
        return '. '.join(summary_parts) + '.'

    def get_form_suggestions(self, partial_data):
        """Provide suggestions based on partial form data"""
        suggestions = []
        
        chief_complaint = partial_data.get('chiefComplaint', '').lower()
        
        # Suggest follow-up questions based on chief complaint
        if 'chest pain' in chief_complaint:
            suggestions.extend([
                "Consider asking about radiation of pain",
                "Check for associated shortness of breath",
                "Inquire about family history of heart disease"
            ])
        elif 'headache' in chief_complaint:
            suggestions.extend([
                "Ask about headache frequency and triggers",
                "Check for vision changes",
                "Inquire about stress levels"
            ])
        elif 'fatigue' in chief_complaint:
            suggestions.extend([
                "Consider checking sleep patterns",
                "Ask about recent weight changes",
                "Inquire about stress and mental health"
            ])
        
        return {
            'suggestions': suggestions,
            'recommended_questions': [
                "How long have you been experiencing these symptoms?",
                "On a scale of 1-10, how severe is your discomfort?",
                "What makes the symptoms better or worse?"
            ]
        }

# Initialize the processor
processor = MedicalTextProcessor()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Medical AI Service',
        'version': '1.0.0'
    })

@app.route('/extract', methods=['POST'])
def extract_information():
    """Extract key information from medical text"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({
                'success': False,
                'error': 'No text provided'
            }), 400
        
        extracted_info = processor.extract_key_information(text)
        
        return jsonify({
            'success': True,
            'data': extracted_info
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/risk-assessment', methods=['POST'])
def risk_assessment():
    """Assess risk level based on form data"""
    try:
        data = request.get_json()
        
        # Combine all relevant text for risk assessment
        text_parts = []
        if data.get('chiefComplaint'):
            text_parts.append(data['chiefComplaint'])
        if data.get('medicalHistory'):
            text_parts.append(data['medicalHistory'])
        if data.get('currentMedications'):
            text_parts.append(data['currentMedications'])
        
        combined_text = ' '.join(text_parts)
        
        if not combined_text:
            return jsonify({
                'success': False,
                'error': 'No medical information provided'
            }), 400
        
        risk_level = processor.assess_risk_level(combined_text)
        summary = processor.generate_summary(data)
        
        return jsonify({
            'success': True,
            'data': {
                'risk_level': risk_level,
                'summary': summary,
                'recommendations': processor.get_form_suggestions(data)
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/suggestions', methods=['POST'])
def get_suggestions():
    """Get form completion suggestions"""
    try:
        data = request.get_json()
        suggestions = processor.get_form_suggestions(data)
        
        return jsonify({
            'success': True,
            'data': suggestions
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/process-form', methods=['POST'])
def process_form():
    """Process complete intake form"""
    try:
        data = request.get_json()
        
        # Generate comprehensive analysis
        risk_level = processor.assess_risk_level(
            ' '.join([
                data.get('chiefComplaint', ''),
                data.get('medicalHistory', ''),
                data.get('currentMedications', '')
            ])
        )
        
        summary = processor.generate_summary(data)
        extracted_info = processor.extract_key_information(data.get('chiefComplaint', ''))
        
        return jsonify({
            'success': True,
            'data': {
                'risk_level': risk_level,
                'summary': summary,
                'extracted_information': extracted_info,
                'priority_score': 'high' if risk_level == 'high' else 'medium',
                'processing_timestamp': pd.Timestamp.now().isoformat()
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)