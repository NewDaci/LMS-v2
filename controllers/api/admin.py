from flask import jsonify
from flask_jwt_extended import jwt_required
from app import api,app, db, cache
from flask_restful import Resource
from flask import make_response, jsonify
from models.model import Book, Sections, Book_req, Feedback, Messages, Status, User, Enrollments, Rating
from flask_restful import fields, marshal, marshal_with
from werkzeug.exceptions import HTTPException
from flask_restful import reqparse
from datetime import date
import json
from flask_jwt_extended import jwt_required, get_jwt_identity
from controllers.rbac import role_required


class AdminDashboard(Resource):
    @jwt_required()
    @role_required("librarian")
    @cache.cached(timeout=60)
    def get(self):
        books = Book.query.count()
        users = User.query.count()
        enrollments = Enrollments.query.count()
        returned_books = Status.query.count()
        sections = Sections.query.all()
        
        # section vs books
        sec_data = [{'name': sec.name, 'book_count': len(Book.query.filter_by(section=sec.id).all())} for sec in sections]

        # book vs enrollments
        books_data = [{'name': book.name, 'enrollments': len(Enrollments.query.filter_by(book_id=book.id).all())} for book in Book.query.all()]

        # book vs rating
        ratings_data = [{'name': book.name, 'rating': book.rating} for book in Book.query.all() if book.rating is not None]

        return jsonify({
            'num_books': books,
            'num_users': users,
            'num_enrollments': enrollments,
            'num_returned_books': returned_books,
            'sections': sec_data,
            'books': books_data,
            'ratings': ratings_data,
        })

api.add_resource(AdminDashboard, '/api/admin/dashboard')
