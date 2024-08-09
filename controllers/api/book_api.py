from app import api,app, db, cache
from flask_restful import Resource
from flask import make_response, jsonify, request
from controllers.rbac import role_required
from models.model import Book, Sections, Book_req, Feedback, Messages, Status, User, Enrollments, Rating
from flask_restful import fields, marshal, marshal_with
from werkzeug.exceptions import HTTPException
from flask_restful import reqparse
from datetime import date, datetime
import json
from flask_jwt_extended import jwt_required, get_jwt_identity



#marshalling
book_fields={
  "id": fields.Integer,
  "isbn": fields.Integer,
  "name": fields.String,
  "author_name": fields.String,
  "sections.name": fields.String,
  "language": fields.String,
  "content": fields.String,
  'date_added': fields.DateTime(dt_format='iso8601'),
  "rating": fields.Integer
}

# sec_field smarshalling
sec_fields={
  "id": fields.Integer,
  "name": fields.String,
  'date_created': fields.DateTime(dt_format='iso8601'),
  "description": fields.String
}

#book_parser
book_parser = reqparse.RequestParser()
book_parser.add_argument("isbn")
book_parser.add_argument("name")
book_parser.add_argument("author_name")
book_parser.add_argument("section")
book_parser.add_argument("language")
book_parser.add_argument("content")
book_parser.add_argument("date_added")


class BookNotFound(HTTPException):
    def __init__(self, status_code):
        self.response = make_response('', status_code)

class BadReqCodeError(HTTPException):
    def __init__(self, status_code, error_code, error_message):
        error = {"error_code": error_code, "error_message": error_message}
        self.response = make_response( json.dumps(error), status_code )




class BookAPI(Resource):
    
    # @jwt_required()
    # @role_required("librarian")
    # @cache.cached(timeout=120)
    def get(self, book_name=None):

        if book_name is not None:
            try:  
                book = Book.query.filter_by(name=book_name).first()
            except:
                raise BookNotFound(status_code=500)  #internal server error that database throws

            if book is None:
                raise BookNotFound(status_code=404)
            return book,200
        else:
            try:
                all_books = Book.query.all()
                latest = Book.query.order_by(Book.date_added.desc()).limit(6).all()
                trend = Book.query.order_by(Book.rating.desc()).limit(6).all()
                secs_obj = Sections.query.all()

                books = []
                for i in all_books:
                    books.append(marshal(i,book_fields))

                secs = []
                for i in secs_obj:
                    secs.append(marshal(i,sec_fields))
                

                latest_books = []
                for i in latest:
                    latest_books.append(marshal(i,book_fields))

                
                trend_books = []
                for i in trend:
                    trend_books.append(marshal(i,book_fields))
            except:
                raise BookNotFound(status_code=500)  # Handle database error properly

            return {"books":books,
                    "latest":latest_books,
                    "secs":secs,
                    "trend":trend_books},200


    @jwt_required()
    @role_required("librarian")
    def post(self):

        data = request.json
        isbn = data.get("isbn", None)
        name = data.get("name", None)
        author_name = data.get("author_name", None)
        sec = data.get("section_name")
        language = data.get("language", None)
        content = data.get("content", None)

        #check for errors 400
        if isbn is None:
            raise BadReqCodeError(status_code=400, error_code="BOOK001", error_message="ISBN No. required")
        if name is None:
            raise BadReqCodeError(status_code=400, error_code="BOOK002", error_message="Name is required")
        if sec is None:
            raise BadReqCodeError(status_code=400, error_code="BOOK003", error_message="Section is required")
        
        alr_book = Book.query.filter_by(isbn=isbn, name=name).first()
        if alr_book:
            raise BadReqCodeError(status_code=409, error_code="BOOK009", error_message="Book Already Exits")

        try:
            section = Sections.query.filter_by(name=sec).first()
        except:
            raise BadReqCodeError(status_code=400, error_code="BOOK006", error_message="Section Not Found")

        try:
            new_book = Book(
                isbn=isbn,
                name=name,
                author_name=author_name,
                language=language,
                content=content,
                section=section.id,
                date_added = datetime.now(),
                rating=1
            )
            db.session.add(new_book)
            db.session.commit()
        except:
            raise BookNotFound(status_code=500)
        return marshal(new_book, book_fields), 201
    


    @jwt_required()
    @role_required("librarian")
    def delete(self, book_id):

        try:  
            book = Book.query.filter_by(id=book_id).first()
        except:
            raise BookNotFound(status_code=500)  #internal server error that database throws

        if book:
            try:
                l=[]

                l.append(book.enrollments)
                l.append(book.ratings)
                l.append(Book_req.query.filter_by(book_id=book.id).all())
                l.append(Feedback.query.filter_by(book_id=book.id).all())
                l.append(Messages.query.filter_by(book_id=book.id).all())
                l.append(Status.query.filter_by(book_id=book.id).all())

                for i in l:
                    for j in i:
                        db.session.delete(j)

                db.session.commit() 
                db.session.delete(book)
                db.session.commit()
                return '', 200
            except:
                raise BookNotFound(status_code=500)
            
        #throw error not found
        raise BookNotFound(status_code=404)
    



    @jwt_required()
    @role_required("librarian")
    def put(self, book_id):

        data = request.json
        isbn = data.get("isbn", None)
        name = data.get("name", None)
        author_name = data.get("author_name", None)
        sec = data["sections.name"]
        language = data.get("language", None)
        content = data.get("content", None)

        # Find section
        section = Sections.query.filter_by(name=sec).first()
        if not section:
            raise BadReqCodeError(status_code=400, error_code="BOOK006", error_message="Section Not Found")

        # Find book
        book = Book.query.filter_by(id=book_id).first()
        if not book:
            raise BookNotFound(status_code=404)

        # Update book details
        try:
            book.isbn = isbn
            book.name = name
            book.author_name = author_name
            book.section = section.id
            book.language = language
            book.content = content
            
            db.session.commit()
            return marshal(book, book_fields), 200
        except Exception as e:
            db.session.rollback()  # rollback in case of any error
            raise BookNotFound(status_code=500, error_message="Error updating book: " + str(e))
    
    
class MyBookAPI(Resource):
    
    @jwt_required()
    def get(self):
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



class Book_Rating(Resource):
    
    @jwt_required()
    def post(self):

        try:
            data = request.json
            book_id = data["book_id"]
            rate = data["rating"]

            rating_obj = Rating.query.filter_by(book_id=book_id).first()
           

            if not rating_obj:
                rat_ob = Rating(book_id=book_id, total=rate, count=1)
                db.session.add(rat_ob)
            else:
                rating = Rating.query.filter_by(book_id=book_id).first()
                rating.total += rate
                rating.count += 1
                db.session.commit()

                book = Book.query.filter_by(id=book_id).first()
                book.rating = rating.total//rating.count

            db.session.commit()
        except:
            raise BookNotFound(status_code=500)
        return {"message":"Rating submitted successfully."},200



api.add_resource(BookAPI, '/api/book', '/api/book/<book_name>', '/api/book/<int:book_id>')
api.add_resource(MyBookAPI, '/api/my-book')
api.add_resource(Book_Rating, '/api/rating')
