from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import requests

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": ["Content-Type"]}})


OLLAMA_URL = "http://localhost:11434/api/generate"

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json 
    user_responses = data["responses"]

    prompt = f"""
    You are a risk assessment AI. Based on the user's responses, generate a risk assessment.
    
    Responses: {user_responses}
    
    Provide a summary of the risk level (Low, Medium, High) and key risk factors.
    """

    # send our response to ollama api
    response = requests.post(OLLAMA_URL, json={
        "model": "mistral",
        "prompt": prompt,
        "stream": False
    })

    result = response.json()["response"] 
    
    # generate prediction
    return jsonify({"risk_analysis": result})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
