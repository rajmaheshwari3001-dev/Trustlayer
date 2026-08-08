import time
import random
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

MOCK_ISSUES = [
    {"type": "security", "message": "High risk of SQL Injection detected in 'auth/login.js' line 42."},
    {"type": "security", "message": "Hardcoded API keys found in 'config/env.local'."},
    {"type": "quality", "message": "Cyclomatic complexity too high in 'utils/parser.js' (score: 24)."},
    {"type": "quality", "message": "Unused imports detected in 'components/Header.jsx'."},
    {"type": "testing", "message": "Test coverage for 'services/payment.js' is below 50% threshold."},
    {"type": "requirements", "message": "Missing required endpoint 'GET /api/v1/users'."}
]

@app.route('/api/validate', methods=['POST'])
def validate_work():
    """
    Enhanced Mock AI Validation Endpoint
    Generates a detailed AI Audit Report across multiple dimensions.
    """
    data = request.json
    submission_link = data.get('link', '')

    if not submission_link:
        return jsonify({'status': 'error', 'message': 'No link provided.'}), 400

    time.sleep(2.5) # Simulate deep AI processing

    # Generate multi-dimensional scores
    scores = {
        "overall": random.randint(65, 100),
        "quality": random.randint(60, 100),
        "security": random.randint(70, 100),
        "testing": random.randint(50, 100),
        "requirements": random.randint(80, 100)
    }

    # Determine pass/fail based on overall score (threshold 85)
    passed = scores["overall"] >= 85

    # If it fails, or randomly, generate some issues
    issues = []
    if not passed:
        num_issues = random.randint(2, 4)
        issues = random.sample(MOCK_ISSUES, num_issues)
    elif scores["overall"] < 95:
        # Passed but with minor warnings
        issues = [random.choice([i for i in MOCK_ISSUES if i['type'] == 'quality'])]

    return jsonify({
        'status': 'success',
        'passed': passed,
        'scores': scores,
        'issues': issues,
        'message': 'Code meets all major requirements.' if passed else 'Code requires revisions before escrow can be released.'
    })

@app.route('/api/escrow/release', methods=['POST'])
def release_escrow():
    data = request.json
    contract_id = data.get('contract_id', 'CTX-1234')
    time.sleep(1.5)
    return jsonify({
        'status': 'success',
        'message': f'Funds for {contract_id} released securely.',
        'transaction_hash': f'0x{random.getrandbits(256):064x}'
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
