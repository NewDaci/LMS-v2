from flask import request, jsonify
from app import api,app, db, bcrypt
from flask_restful import Resource
from flask import make_response
from flask_restful import fields, marshal, marshal_with
from werkzeug.exceptions import HTTPException
from flask_restful import reqparse
from datetime import date
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from models.model import User, Feedback, Status, Enrollments, Messages, Book_req
from sqlalchemy.exc import SQLAlchemyError
import re
from controllers.rbac import role_required


class Logiin(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        user = User.query.filter_by(email=email).first()
        if user:
            if bcrypt.check_password_hash(user.password, password):
                access_token = create_access_token(identity={'id': user.id, 'role': user.role})
                return jsonify({'message': "Success! redirecting in 1sec..", 'access_token': access_token, 'role': user.role})
            else:
                return(make_response(jsonify({'message': 'Incorrect Password!'}), 401))
        else:
            return(make_response(jsonify({'message': "User doesn't exists! Register First."}), 404))    


    @jwt_required()
    def get(self):

        # Extract the user ID from the JWT
        user_jwt = get_jwt_identity()
        user = User.query.filter_by(id=user_jwt['id']).first()

        # Check if user exists
        if user:
            return jsonify({'message': 'User found', 'name': user.name, 'role':user.role})
        else:
            return jsonify({'message': 'User not found'}), 404


class Register(Resource):
    def post(self):
        try:
            data = request.get_json()
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')

            # Input validation
            if not username or not email or not password:
                return make_response(jsonify({'message': 'All fields are required!'}), 400)

            # Email format validation
            if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
                return make_response(jsonify({'message': 'Invalid email format!'}), 400)

            # Password strength validation (example: at least 3 characters)
            if len(password)  < 2:
                return make_response(jsonify({'message': 'Password must be at least 3 characters long!'}), 400)

            # Check if user already exists
            alr_user = User.query.filter_by(email=email).first()
            if alr_user:
                return make_response(jsonify({'message': 'Email Already Exists!'}), 400)

            # Hash the password using bcrypt
            pass_hash = bcrypt.generate_password_hash(password).decode('utf-8')
            
            # Create new user
            user = User(name=username, email=email, password=pass_hash, role="user")
            db.session.add(user)
            db.session.commit()

            return jsonify({'message': 'Registered! You can log in now in 2sec....'})
        except SQLAlchemyError as e:
            db.session.rollback()  # Rollback the session in case of an error
            return make_response(jsonify({'message': 'Database error occurred!'}), 500)
        except Exception as e:
            return make_response(jsonify({'message': 'An error occurred!'}), 500)


#marshalling
users_fields={
  "id": fields.Integer,
  "name": fields.String,
  "email": fields.String,
  "role": fields.String
}

class Users(Resource):

    @jwt_required()
    @role_required("librarian")
    def get(self):
        users = User.query.all()
        return marshal(users, users_fields), 200


    @jwt_required()
    @role_required("librarian")
    def delete(self, user_id):
        try:
            get_user = User.query.filter_by(id=user_id).first()
            if not get_user:
                return {"message": "User not found"}, 404

            l = []
            l.append(Book_req.query.filter_by(user_id=user_id).all())
            l.append(Enrollments.query.filter_by(user_id=user_id).all())
            l.append(Messages.query.filter_by(user_id=user_id).all())
            l.append(Status.query.filter_by(user_id=user_id).all())
            l.append([get_user])

            for items in l:
                for item in items:
                    db.session.delete(item)

            db.session.commit()
            return {"message": "User deleted successfully"}, 200
        except Exception as e:
            return {"message": f"Error while deleting user: {str(e)}"}, 500


api.add_resource(Logiin, '/api/login')
api.add_resource(Register, '/api/register')
api.add_resource(Users, '/api/admin/user', '/api/admin/user/<int:user_id>')
