# app/api/routes.py
from flask import Blueprint, jsonify, request, make_response
from flask_cors import cross_origin
from app.infrastructure.repositories.robot_repository import RobotRepository
from app.usecases.robot_service import RobotService

api_bp = Blueprint('api', __name__)
robot_repository = RobotRepository()
robot_service = RobotService(robot_repository)

# Common CORS decorator configuration
cors_config = {
    "origins": ["http://localhost:5173"],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"],
    "supports_credentials": True,
    "expose_headers": ["Content-Range", "X-Content-Range"]
}

@api_bp.route('/robot/connect', methods=['POST', 'OPTIONS'])
@cross_origin(**cors_config)
def connect():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response

    data = request.get_json()
    ip_address = data.get('ipAddress')

    if not ip_address:
        return jsonify({'error': 'IP address is required'}), 400

    try:
        robot_service.connect(ip_address)
        return jsonify({'message': 'Connected successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/robot/terminate', methods=['POST', 'OPTIONS'])
@cross_origin(**cors_config)
def terminate():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response

    try:
        robot_service.disconnect()
        return jsonify({'message': 'Session terminated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/robot/command', methods=['POST', 'OPTIONS'])
@cross_origin(**cors_config)
def send_command():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response

    data = request.get_json()
    command = data.get('command')

    if not command:
        return jsonify({'error': 'Command is required'}), 400

    try:
        robot_service.send_command(command)
        return jsonify({'message': f'Command {command} sent successfully'}), 200
    except ConnectionError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/robot/status', methods=['GET', 'OPTIONS'])
@cross_origin(**cors_config)
def get_status():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Methods', 'GET')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response

    try:
        state = robot_service.get_state()
        return jsonify({
            'battery': state.battery,
            'temperature': state.temperature,
            'humidity': state.humidity,
            'cpuUsage': state.cpu_usage,
            'powerConsumption': state.power_consumption,
            'speed': state.speed,
            'mode': state.mode,
            'uptime': state.uptime,
            'errors': state.errors
        }), 200
    except ConnectionError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/robot/video', methods=['GET', 'OPTIONS'])
@cross_origin(**cors_config)
def get_video():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Methods', 'GET')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response

    try:
        frame = robot_service.get_video_frame()
        if frame:
            return jsonify({'frame': frame}), 200
        else:
            return jsonify({'error': 'No video frame available'}), 404
    except ConnectionError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/robot/logs', methods=['POST', 'OPTIONS'])
@cross_origin(**cors_config)
def log_operation():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response

    data = request.get_json()
    operation = data.get('operation')
    timestamp = data.get('timestamp')
    user_id = data.get('userId')

    if not all([operation, timestamp, user_id]):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        # Here you would typically save the log to your database
        # For now, we'll just print it
        print(f"Log: {operation} by user {user_id} at {timestamp}")
        return jsonify({'message': 'Operation logged successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500