# app/__init__.py
from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)

    # Configure CORS
    CORS(app,
         resources={r"/api/*": {
             "origins": ["http://localhost:5173"],
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"],
             "supports_credentials": True,
             "expose_headers": ["Content-Range", "X-Content-Range"],
             "max_age": 120,
             "send_wildcard": False
         }},
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"],
         expose_headers=["Content-Range", "X-Content-Range"]
    )

    # Import and register blueprints
    from app.api.routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

    return app






# from flask import Flask
# from flask_cors import CORS
#
#
# def create_app():
#     app = Flask(__name__)
#
#     # Configure CORS properly
#     CORS(app, resources={
#         r"/api/*": {
#             "origins": ["http://localhost:5173"],
#             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
#             "allow_headers": ["Content-Type", "Authorization", "Content-Length", "X-Requested-With"],
#             "expose_headers": ["Content-Range", "X-Content-Range"],
#             "supports_credentials": True
#         }
#     })
#
#     # Import and register blueprints
#     from app.api.routes import api_bp
#     app.register_blueprint(api_bp, url_prefix='/api')
#
#     return app