from flask import Flask
from app.api.routes import api_bp
from flask_cors import CORS

# Remove duplicate app creation
app = Flask(__name__)

# Configure CORS properly
# CORS(app, resources={
#     r"/api/*": {
#         "origins": ["http://localhost:5173"],
#         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
#         "allow_headers": ["Content-Type", "Authorization", "Content-Length", "X-Requested-With"],
#         "expose_headers": ["Content-Range", "X-Content-Range"],
#         "supports_credentials": True
#     }
# })

# Register blueprint
app.register_blueprint(api_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)