from functools import wraps
from flask import make_response, request, jsonify
from flask_jwt_extended import get_jwt_identity

def role_required(required_role):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            user_identity = get_jwt_identity()
            if user_identity['role'] != required_role:
                return make_response(jsonify({"msg": "Access denied: Insufficient permissions"}), 403)
            return f(*args, **kwargs)
        return wrapper
    return decorator
