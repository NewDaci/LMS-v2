from flask import request, jsonify, session, redirect, url_for, flash
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource, Api, fields, marshal
from controllers.rbac import role_required
from models.model import Book, Book_req, User, Status, Enrollments
from datetime import timedelta, date
from app import db,app,api


#marshalling
requests_fields={
  "id": fields.Integer,
  "user_id": fields.Integer,
  "book_id": fields.String,
  "user_name": fields.String,
  "book_name": fields.String,
  "req_days": fields.Integer,
  "issue_date": fields.DateTime(dt_format='iso8601'),
  'return_date': fields.DateTime(dt_format='iso8601'),
}

class Requests(Resource):
    @jwt_required()
    @role_required("librarian")
    def get(self):
        req = Book_req.query.all()
        return marshal(req, requests_fields),200
    
    @jwt_required()
    @role_required("librarian")
    def post(self):

        data = request.json
        id = data.get('req_id')
        book_req = Book_req.query.filter_by(id=id).first()

        check = Enrollments.query.filter_by(user_id=book_req.user_id, book_id=book_req.book_id).first()

        if check:
            db.session.delete(check)
            db.session.commit()

        enroll = Enrollments(user_id=book_req.user_id, book_id=book_req.book_id, issue_date=book_req.issue_date, return_date=book_req.return_date)
        db.session.add(enroll)
        db.session.delete(book_req)
        db.session.commit()

        return jsonify({"msg":"Approved book!"})
    

    @jwt_required()
    @role_required("librarian")
    def delete(self):
        data = request.json
        id = data.get('req_id')
        book_req = Book_req.query.filter_by(id=id).first()
        db.session.delete(book_req)
        db.session.commit()
        return jsonify({"msg":"Rejected book request"})





api.add_resource(Requests, "/api/admin/requests")