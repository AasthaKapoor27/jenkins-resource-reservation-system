from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime
import os
import logging
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# In-memory storage
AGENTS = ['Agent-1', 'Agent-2', 'Agent-3']
reservations = []

def check_conflict(agent_name, start_time, end_time, exclude_id=None):
    """Check if reservation conflicts with existing ones"""
    start = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
    end = datetime.fromisoformat(end_time.replace('Z', '+00:00'))
    
    for res in reservations:
        if exclude_id and res['id'] == exclude_id:
            continue
            
        if res['agent_name'] == agent_name:
            res_start = datetime.fromisoformat(res['start_time'].replace('Z', '+00:00'))
            res_end = datetime.fromisoformat(res['end_time'].replace('Z', '+00:00'))
            
            # Check for overlap
            if (start < res_end and end > res_start):
                return True
    return False

@app.route('/api/agents', methods=['GET'])
def get_agents():
    """Get list of all agents with their current status"""
    agents_with_status = []
    current_time = datetime.now()
    
    for agent in AGENTS:
        # Check if agent is currently reserved
        is_busy = False
        for res in reservations:
            if res['agent_name'] == agent:
                res_start = datetime.fromisoformat(res['start_time'].replace('Z', '+00:00'))
                res_end = datetime.fromisoformat(res['end_time'].replace('Z', '+00:00'))
                if res_start <= current_time <= res_end:
                    is_busy = True
                    break
        
        agents_with_status.append({
            'name': agent,
            'status': 'busy' if is_busy else 'free'
        })
    
    return jsonify(agents_with_status)

@app.route('/api/reservations', methods=['GET'])
def get_reservations():
    """Get all reservations"""
    return jsonify(reservations)

@app.route('/api/reservations', methods=['POST'])
def create_reservation():
    """Create a new reservation"""
    data = request.json
    
    # Validate required fields
    required_fields = ['agent_name', 'start_time', 'end_time', 'user_name']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Validate agent exists
    if data['agent_name'] not in AGENTS:
        return jsonify({'error': 'Invalid agent name'}), 400
    
    # Validate time
    try:
        start = datetime.fromisoformat(data['start_time'].replace('Z', '+00:00'))
        end = datetime.fromisoformat(data['end_time'].replace('Z', '+00:00'))
        
        if start >= end:
            return jsonify({'error': 'Start time must be before end time'}), 400
    except ValueError:
        return jsonify({'error': 'Invalid datetime format'}), 400
    
    # Check for conflicts
    if check_conflict(data['agent_name'], data['start_time'], data['end_time']):
        return jsonify({'error': 'Agent already reserved'}), 409
    
    # Create reservation
    reservation = {
        'id': len(reservations) + 1,
        'agent_name': data['agent_name'],
        'start_time': data['start_time'],
        'end_time': data['end_time'],
        'user_name': data['user_name'],
        'created_at': datetime.now().isoformat()
    }
    
    reservations.append(reservation)
    logger.info(f"Created reservation: {reservation}")
    
    return jsonify(reservation), 201

@app.route('/api/', methods=['GET'])
def root():
    return jsonify({'message': 'Jenkins Resource Reservation System API'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001, debug=True)