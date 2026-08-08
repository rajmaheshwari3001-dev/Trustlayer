import time
import random
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend to communicate with backend

@app.route('/api/validate', methods=['POST'])
def validate_work():
    """
    Mock AI Validation Endpoint
    Receives submission URL or code, simulates a delay for 'AI analysis',
    and returns a validation score and decision.
    """
    data = request.json
    submission_link = data.get('link', '')

    # Simulate AI processing time (2 seconds)
    time.sleep(2)

    # Mock validation logic
    if not submission_link:
        return jsonify({
            'status': 'error',
            'message': 'No submission provided.'
        }), 400

    # Randomly determine if the work is high quality or not (80% chance of success for demo)
    score = random.randint(70, 100)
    passed = score >= 85

    if passed:
        return jsonify({
            'status': 'success',
            'score': score,
            'message': 'Work meets all quality standards and project requirements.',
            'passed': True
        })
    else:
        return jsonify({
            'status': 'failed',
            'score': score,
            'message': 'Work is missing critical components or does not meet quality standards. Please review feedback.',
            'passed': False
        })

@app.route('/api/escrow/release', methods=['POST'])
def release_escrow():
    """
    Mock Escrow Release Endpoint
    Simulates the secure release of funds to the freelancer's wallet/account.
    """
    data = request.json
    contract_id = data.get('contract_id', 'CTX-1234')

    # Simulate blockchain/payment gateway delay
    time.sleep(1)

    return jsonify({
        'status': 'success',
        'message': f'Funds for contract {contract_id} have been securely released to the freelancer.',
        'transaction_hash': f'0x{random.getrandbits(256):064x}'
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
