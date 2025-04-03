from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

llm_logs = [] 

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

        # Now Gemma 7B judges what Mistral said
        gemma_judge_prompt = f"""
You are an expert LLM evaluator. Your role is to evaluate the accuracy, completeness, and relevance of the risk assessment. Consider SME-specific challenges, regulatory region, and realistic business operations.
Given the following:

User Inputs:
{user_responses}

Risk Assessment Output:
{mistral_output}

Evaluate the quality and accuracy of the risk assessment.
1. Is the risk level justified?
2. Are the explanations logical and sufficient?
3. If needed, suggest a corrected risk level.
4. Are key compliance dimensions (e.g., financial, legal, cybersecurity, operational, etc.) considered? 
5. Suggest improvements or provide an alternate explanation if needed.
6. Are critical issues, red flags, or vague responses properly recognized?
7. Would a human domain expert agree with this assessment? 
8. Is the assessment appropriate for the likely sector and region (e.g., GDPR in EU, SOC 2 in US)? 
9. What the previously presented output could have done better? 

Respond in this format:
- Judgment: <Accurate | Needs Improvement>
- Suggested Risk Level: <Low | Medium | High | Same as above>
- Comments: <short feedback>
- Specific Weaknesses Identified: <brief list>
- Suggest how to improve: <brief recommendation>
- Missing Aspects: <list any compliance/risk factors that were ignored> 
- Clarity Score: <1-5> 
- Expert Agreement: <Likely | Unlikely | Partial> 
"""

        print("[Gemma] Judger prompt sent.")
        gemma_judgment = call_ollama(GEMMA_MODEL, gemma_judge_prompt)


        llm_logs.append({
        "user_input": user_responses,
        "mistral_prompt": mistral_prompt.strip(),
        "mistral_response": mistral_output,
        "gemma_prompt": gemma_judge_prompt.strip(),
        "gemma_response": gemma_judgment
})
    
        return jsonify({
            "mistral_analysis": mistral_output,
            "gemma_judgment": gemma_judgment
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
            <strong>Gemma Response:</strong><pre>{log['gemma_response']}</pre><hr>
        </div>
        """
    return html



if __name__ == '__main__':
    print("Backend running with Mistral (analysis) + Gemma 7B (judger)...")
    app.run(debug=True, host='0.0.0.0', port=5000)
