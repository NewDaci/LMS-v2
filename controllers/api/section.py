from flask_jwt_extended import jwt_required
from flask_restful import Resource, fields, marshal, marshal_with
from controllers.rbac import role_required
from flask import jsonify, make_response
from models.model import Book, Sections
from app import db, app, api, cache


#marshalling
sec_fields={
  "id": fields.Integer,
  "name": fields.String,
  'date_created': fields.DateTime(dt_format='iso8601'),
  "description": fields.String
}

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


class SectionAPI(Resource):
    @jwt_required()
    @role_required("librarian")
    def get(self):
        sections = Sections.query.all()
        sec_data = [{'name': sec.name, 'id': sec.id,'date_created': sec.date_created.strftime("%Y-%m-%d"),'description': sec.description, 'count': len(Book.query.filter_by(section=sec.id).all())} for sec in sections]
        return make_response(jsonify(sec_data), 200)


class UserSectionAPI(Resource):
    @jwt_required()
    @cache.cached(timeout=120)
    def get(self):
        sec = Sections.query.all()
        return marshal(sec, sec_fields), 200

class SectionBooksAPI(Resource):
    @jwt_required()
    @marshal_with(book_fields)
    def get(self, section_id):
        books = Book.query.filter_by(section=section_id).all()
        return books, 200
    
class AuthorBooksAPI(Resource):
    @jwt_required()
    @marshal_with(book_fields)
    def get(self, author):
        books = Book.query.filter_by(author_name=author).all()
        return books, 200
    
class LanguageBooksAPI(Resource):
    @jwt_required()
    @marshal_with(book_fields)
    def get(self, language):
        books = Book.query.filter_by(language=language).all()
        return books, 200


api.add_resource(SectionAPI, '/api/admin/section')
api.add_resource(UserSectionAPI, '/api/section')
api.add_resource(SectionBooksAPI, '/api/section/<int:section_id>')
api.add_resource(AuthorBooksAPI, '/api/section/<author>')
api.add_resource(LanguageBooksAPI, '/api/section/language/<language>')
