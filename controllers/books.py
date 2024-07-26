from app import app, db
from models.model import Book,Enrollments, Rating, Sections, Feedback, Status, User
from flask import render_template,session, redirect, request
from datetime import date
from flask import send_file, flash
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required



@app.route("/api/my-book")
@jwt_required()
def api_my_book():
    curr_date = date.today()
    user = get_jwt_identity()
    user_id = User.query.filter_by(id=user['id']).first()

    enrolls = Enrollments.query.filter_by(user_id=user_id.id).all()
    valid_books = []
    not_valid = []
    for i in enrolls:
        book_data = {
            'id': i.book.id,
            'enroll_id': i.id,
            'name': i.book.name,
            'author_name': i.book.author_name,
            'content': i.book.content,
            'issue_date': i.issue_date.strftime("%Y-%m-%d"),
            'return_date': i.return_date.strftime("%Y-%m-%d")
        }
        if curr_date < i.return_date:
            valid_books.append(book_data)
        else:
            not_valid.append(book_data)

    comp_books = Status.query.filter_by(user_id=user_id.id).all()
    books = []
    for i in comp_books:
        book = Book.query.get(i.book_id)
        books.append({
            'id': book.id,
            'name': book.name,
            'author_name': book.author_name,
            'content': book.content
        })
    return jsonify({
        'valid_books': valid_books,
        'revoked_books': not_valid,
        'completed_books': books,
        'curr_date': curr_date
    })