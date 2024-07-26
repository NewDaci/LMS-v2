from flask import request, jsonify, session, redirect, url_for, flash
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource, Api
from controllers.rbac import role_required
from models.model import Book, Book_req, User, Status, Enrollments
from datetime import timedelta, date
from app import db,app,api


class IssueBook(Resource):
    @jwt_required()
    @role_required("user")
    def post(self):
        user_id = get_jwt_identity()
        if not user_id:
            return {"error": "User ID not found in token"}, 401

        data = request.json
        book_id = data.get("book_id")
        req_days = data.get("req_days")
        issue_date = date.today()

        # Get book details
        book = Book.query.filter_by(id=book_id).first()
        if not book:
            return {"error": "Book not found"}, 404

        # Get user details
        user = User.query.filter_by(id=user_id["id"]).first()
        if not user:
            return {"error": "User not found"}, 404

        try:
            return_date = issue_date + timedelta(days=int(req_days))
        except ValueError:
            return {"error": "Invalid requested days"}, 400

        # Check for user book_req not > 5
        book_req_len = Book_req.query.filter_by(user_id=user.id).all()
        if len(book_req_len) >= 5:
            return {"error": "Requested books are more than 5. Please wait for admin to approve before requesting more."}, 400

        # Check whether the user is already enrolled with the book_id
        check_enroll = Enrollments.query.filter_by(user_id=user.id, book_id=book.id).first()
        if check_enroll and check_enroll.return_date > date.today():
            return {"error": "Enrolled in this book already!"}, 400

        # Check whether the book is already completed by user or not
        check = Status.query.filter_by(book_id=book_id, user_id=user.id).first()
        if not check:
            enroll = Book_req(user_id=user.id, user_name=user.name, book_id=book.id, book_name=book.name, req_days=req_days, issue_date=issue_date, return_date=return_date)
            try:
                db.session.add(enroll)
                db.session.commit()
            except Exception as e:
                return {"error": "Already requested for this book"}, 400
        else:
            return {"error": "You have already completed this book. Please check under My Books"}, 400

        return {"message": f"Requested for book: {book.name} with Book ID: {book.id}"}, 200


    @jwt_required()
    @role_required("user")
    def delete(self):
        user_id = get_jwt_identity()
        if not user_id:
            return {"error": "User ID not found in token"}, 401

        data = request.json
        book_id = data.get("book_id")
        cancel = Book_req.query.filter_by(user_id=user_id["id"], book_id=book_id).first()
        try:
            db.session.delete(cancel)
            db.session.commit()
        except:
            return {"error": "DataBase Error occurred."}, 500
        return {"message": f"Cancelled request for book with Book ID: {book_id}"}, 200


api.add_resource(IssueBook, "/api/issue-book")