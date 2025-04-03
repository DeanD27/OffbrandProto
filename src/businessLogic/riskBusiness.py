from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

OLLAMA_URL = "http://localhost:11434/api/generate"
MISTRAL_MODEL = "mistral"
GEMMA_MODEL = "gemma:7b"

def call_ollama(model, prompt):
    try:
        response = requests.post(OLLAMA_URL, json={
            "model": model,
            "prompt": prompt,
            "stream": False
        })
        response.raise_for_status()
        return response.json().get("response", "No response")
    except Exception as e:
        print(f"[{model} Error]", e)
        return f"Error from {model}"

@app.route('/')
def home():
    return "Risk Assessment API (Mistral for Analysis, Gemma 7B for Judgment)"

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.json
        user_responses = data.get("responses", {})

        # Initial prompt for Mistral (does the real analysis)
        mistral_prompt = f"""
You are an AI risk assessor. Analyze the following business questionnaire.

Responses:
{user_responses}

Determine the risk level (Low/Medium/High) and briefly explain why.
"""

        print("[Mistral] Prompt generated.")
        mistral_output = call_ollama(MISTRAL_MODEL, mistral_prompt)

        # Now Gemma 7B judges what Mistral said
        gemma_judge_prompt = f"""
You are an expert LLM evaluator. Given the following:

User Inputs:
{user_responses}

Risk Assessment Output:
{mistral_output}

Evaluate the quality and accuracy of the risk assessment.
1. Is the risk level justified?
2. Are the explanations logical and sufficient?
3. If needed, suggest a corrected risk level.

Respond in this format:
- Judgment: <Accurate | Needs Improvement>
- Suggested Risk Level: <Low | Medium | High | Same as above>
- Comments: <short feedback>
- Specific Weaknesses Identified: <brief list>
- Suggest how to improve: <brief recommendation>
"""

        print("[Gemma] Judger prompt sent.")
        gemma_judgment = call_ollama(GEMMA_MODEL, gemma_judge_prompt)

        return jsonify({
            "mistral_analysis": mistral_output,
            "gemma_judgment": gemma_judgment
        })

    except Exception as e:
        print("[Analyze Error]", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Backend running with Mistral (analysis) + Gemma 7B (judger)...")
    app.run(debug=True, host='0.0.0.0', port=5000)
