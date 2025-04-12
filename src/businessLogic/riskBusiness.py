from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

llm_logs = [] 

app = Flask(__name__)
CORS(app)

OLLAMA_URL = "http://localhost:11434/api/generate"
MISTRAL_MODEL = "mistral"

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
    return "Risk Assessment API (Mistral for Analysis)"

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.json
        user_responses = data.get("responses", {})

        # Initial prompt for Mistral (does the real analysis)
        mistral_prompt = f"""
You are an AI Risk Analyst specializing in evaluating small to medium-sized enterprises (SMEs).
You will analyze the following responses from a business questionnaire and determine the overall risk profile.

Responses:
{user_responses}

Your analysis should address the following:

1. Identify the key risk areas mentioned (e.g., financial, legal, cybersecurity, HR, operational, etc.).
2. Determine the risk level for each area using Low / Medium / High.
3. Provide a concise explanation for each risk area.
4. Conclude with an overall risk rating (Low / Medium / High) and summarize why.
5. List any red flags or urgent risk indicators. 
6. Identify any missing or vague information that limits the accuracy of your assessment. 
7. If possible, infer the industry or sector and tailor the assessment accordingly.
8. Provide recommended mitigation actions for each high or medium risk area.
9. Consider the regulatory and compliance environment based on country indicators (e.g., GDPR in the EU, SOC 2 in the US, etc.).
10. Highlight any region-specific obligations or risk exposures (e.g., taxation, data residency, employment law).
11. If any other information is critical to the risk assesment then mention that with the title "Key Notes". 

Respond in this format:

Risk Breakdown by Category:
  1. Financial: <Low | Medium | High> — <Reason>
  2. Legal: <Low | Medium | High> — <Reason>
  3. Cybersecurity: <Low | Medium | High> — <Reason>
  4. HR/Compliance: <Low | Medium | High> — <Reason>
  5. Operational: <Low | Medium | High> — <Reason>

Critical Issues / Red Flags: <List of any serious concerns or violations>
Missing Information: <Mention any unanswered or vague responses>
Supply Chain or Vendor Risks: <Describe if applicable>
Recommended Mitigation:
  - Financial: <Recommendation>
  - Legal: <Recommendation>
  - Cybersecurity: <Recommendation>
  - HR/Compliance: <Recommendation>
  - Operational: <Recommendation>
Overall Risk Level: <Low | Medium | High>
Justification Summary: <1-10 sentences explaining the overall rating>
"""

        print("[Mistral] Prompt generated.")
        mistral_output = call_ollama(MISTRAL_MODEL, mistral_prompt)

        llm_logs.append({
        "user_input": user_responses,
        "mistral_prompt": mistral_prompt.strip(),
        "mistral_response": mistral_output
        })
    
        return jsonify({
            "mistral_analysis": mistral_output
        })

    except Exception as e:
        print("[Analyze Error]", str(e))
   
        return jsonify({"error": str(e)}), 500

@app.route('/viz')
def show_logs():
    html = "<h2 style='font-family:sans-serif;'>LLM Analysis Log</h2><hr>"
    for log in reversed(llm_logs):  # Show newest first
        html += f"""
        <div style='margin-bottom:30px; font-family:sans-serif;'>
            <strong>User Input:</strong><pre>{log['user_input']}</pre><br>
            <strong>Mistral Output:</strong><pre>{log['mistral_response']}</pre><br>
        </div>
        """
    return html



if __name__ == '__main__':
    print("Backend running with Mistral (analysis)")
    app.run(debug=True, host='0.0.0.0', port=5000)
