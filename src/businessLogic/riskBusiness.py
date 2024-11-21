from flask import Flask, request, jsonify
import pandas as pd
import joblib  # For loading ML models

app = Flask(__name__)
# model = joblib.load("path/to/your_model.pkl")

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    csv_content = data.get('csv', '')
    if not csv_content:
        return jsonify({'error': 'No CSV content provided'}), 400

    # Process CSV content
    from io import StringIO
    csv_data = pd.read_csv(StringIO(csv_content))

    # Generate prediction
#    predictions = model.predict(csv_data)
#    risk_assessment = predictions.tolist()

#    return jsonify({'result': risk_assessment})
    return jsonify({'result': 'frontend and backend are talking'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
