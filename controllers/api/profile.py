from flask_jwt_extended import jwt_required, get_jwt_identity
from app import app, db, bcrypt, api
from controllers.rbac import role_required
from models.model import User, Enrollments, Book, Sections, Messages, Book_req, Status
from flask import session, request, jsonify, redirect, make_response
from flask_restful import Resource, reqparse
from sqlalchemy import or_
from datetime import datetime
import re


def user_to_dict(user):
    return {"id": user.id, "name": user.name, "email": user.email, "role": user.role}


def book_to_dict(book):
    return {
        "id": book.id,
        "isbn": book.isbn,
        "name": book.name,
        "author_name": book.author_name,
        "content": book.content,
        "section": book.section,
        "language": book.language,
        "date_added": book.date_added.strftime("%Y-%m-%d") if book.date_added else None,
        "rating": book.rating,
    }


def enroll_to_dict(enroll):
    return {
        "id": enroll.id,
        "bookid": enroll.book.id,
        "name": enroll.book.name,
        "author_name": enroll.book.author_name,
        "content": enroll.book.content,
        "issue_date": enroll.issue_date.strftime("%Y-%m-%d"),
        "return_date": enroll.return_date.strftime("%Y-%m-%d"),
    }


def section_to_dict(section):
    return {
        "id": section.id,
        "name": section.name,
        "description": section.description,
        "date_created": (
            section.date_created.strftime("%Y-%m-%d") if section.date_created else None
        ),
    }


def message_to_dict(message):
    return {
        "id": message.id,
        "content": message.message,
        "book_id": message.book_id,
        "user_id": message.user_id,
    }


class ProfileResource(Resource):
    @jwt_required()
    def get(self):
        try:
            # Extract the user ID from the JWT
            user_jwt = get_jwt_identity()
            get_user = User.query.filter_by(id=user_jwt["id"]).first()

            if not get_user:
                return {"message": "User not found"}, 404

            try:
                enrolls = Enrollments.query.filter_by(user_id=user_jwt["id"]).all()
                # books = [Book.query.filter_by(id=enroll.book_id).first() for enroll in enrolls]

                return jsonify(
                    {
                        "user": user_to_dict(get_user),
                        "enrolls": [enroll_to_dict(enroll) for enroll in enrolls],
                        "total_books": len(enrolls),
                    }
                )
            except Exception as e:
                return {"message": f"Error while fetching enrollments: {str(e)}"}, 500

        except Exception as e:
            return {"message": f"Error while processing profile request: {str(e)}"}, 500



class UpdateProfileResource(Resource):

    @jwt_required()
    def post(self):
        try:
            data = request.get_json()
            username = data["name"]
            email = data["email"]
            password = data["password"]
            try:
                # Email format validation
                if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
                    return make_response(
                        jsonify({"message": "Invalid email format!"}), 400
                    )

                # Password strength validation (example: at least 3 characters)
                if password:
                    if len(password) < 2:
                        return make_response(
                            jsonify(
                                {
                                    "message": "Password must be at least 3 characters long!"
                                }
                            ),
                            400,
                        )

                try:
                    # Extract the user ID from the JWT
                    user_jwt = get_jwt_identity()
                    user = User.query.filter_by(id=user_jwt["id"]).first()

                    if user:
                        if username:
                            user.name = username
                        if email:
                            user.email = email
                        if password:
                            pass_hash = bcrypt.generate_password_hash(password).decode(
                                "utf-8"
                            )
                            user.password = pass_hash
                        db.session.commit()
                        return {"message": "Profile updated successfully!"}, 200
                except:
                    return {"message": "Error while fetching user details!"}, 400

            except:
                return {"message": "Error while validation!"}, 400
        except:
            return {"message": "Error while fetching form details!"}, 500


class DeleteProfileResource(Resource):

    @jwt_required()
    def delete(self):
        try:
            # Extract the user ID from the JWT
            user_jwt = get_jwt_identity()
            get_user = User.query.filter_by(id=user_jwt["id"]).first()
            if not get_user:
                return {"message": "User not found"}, 404

            l = []
            l.append(Book_req.query.filter_by(user_id=user_jwt["id"]).all())
            l.append(Enrollments.query.filter_by(user_id=user_jwt["id"]).all())
            l.append(Messages.query.filter_by(user_id=user_jwt["id"]).all())
            l.append(Status.query.filter_by(user_id=user_jwt["id"]).all())
            l.append([get_user])

            for items in l:
                for item in items:
                    db.session.delete(item)

            db.session.commit()
            return {"message": "Profile deleted successfully"}, 200
        except Exception as e:
            return {"message": f"Error while deleting profile: {str(e)}"}, 500


class SearchResource(Resource):

    @jwt_required()
    def post(self):
        try:
            data = request.json
            search_query = data.get("search")

            try:
                book_searched = Book.query.filter(Book.name.ilike(f"%{search_query}%")).all()

                section_searched = Sections.query.filter(
                    or_(
                    Sections.name.ilike(f"%{search_query}%"),
                    Sections.description.ilike(f"%{search_query}%"),)).all()
                
                author_searched = Book.query.filter(Book.author_name.ilike(f"%{search_query}%")).all()
                
                language_searched = Book.query.filter(Book.language.ilike(f"%{search_query}")).all()

                return jsonify(
                    {
                        "book_searched": [book_to_dict(book) for book in book_searched],
                        "section_searched": [section_to_dict(section) for section in section_searched],
                        "author_searched": [book_to_dict(author) for author in author_searched],
                        "language_searched":[book_to_dict(lang) for lang in language_searched],
                        "search_query": search_query,
                    }
                )
            except Exception as e:
                return {"message": f"Error while searching: {str(e)}"}, 500
        except Exception as e:
            return {"message": f"Error while processing search request: {str(e)}"}, 500


class MessageResource(Resource):
    def get(self):
        messages = Messages.query.filter_by(user_id=session.get("user_id")).all()
        message_list = [
            {
                "message": message_to_dict(msg),
                "book": book_to_dict(Book.query.filter_by(id=msg.book_id).first()),
            }
            for msg in messages
        ]
        return jsonify(message_list)


class ReadMessageResource(Resource):
    def delete(self, id):
        msg = Messages.query.filter_by(id=id).first()
        if msg:
            db.session.delete(msg)
            db.session.commit()
            return {"message": "Message marked as read and deleted"}
        return {"message": "Message not found"}, 404


class PolicyResource(Resource):
    def get(self):
        return {"message": "Render policy template here"}


api.add_resource(ProfileResource, "/api/profile")
api.add_resource(UpdateProfileResource, "/api/profile/update")
api.add_resource(DeleteProfileResource, "/api/profile/delete")


api.add_resource(SearchResource, "/api/search")
api.add_resource(MessageResource, "/api/message")
api.add_resource(ReadMessageResource, "/api/message/read/<int:id>")
api.add_resource(PolicyResource, "/api/policy")
