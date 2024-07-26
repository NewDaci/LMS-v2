from flask import make_response, request, jsonify, session, redirect, url_for, flash
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource, Api, fields, marshal
from controllers.rbac import role_required
from models.model import Book, Book_req, User, Status, Enrollments, Feedback
from datetime import timedelta, date
from app import db,app,api


#marshalling
enrolls_fileds={
  "id": fields.Integer,
  "user_id": fields.Integer,
  "book_id": fields.Integer,
  "user_id.name": fields.String,
  "book.name": fields.String,
  "issue_date": fields.DateTime(dt_format='iso8601'),
  'return_date': fields.DateTime(dt_format='iso8601'),
}

class Enrolls(Resource):
    @jwt_required()
    @role_required("librarian")
    def get(self):
        try:
            enrolls = Enrollments.query.all()
            enrollments_data = []
            for enroll in enrolls:
                enrollments_data.append({
                    "id": enroll.id,
                    "user_id": enroll.user_id,
                    "book_id": enroll.book_id,
                    "user_name": enroll.user.name,
                    "book_name": enroll.book.name,
                    "issue_date": enroll.issue_date.isoformat(),
                    'return_date': enroll.return_date.isoformat()
                })
            return make_response(jsonify(enrollments_data), 200)
        except Exception as e:
            return jsonify({"msg": "Error while fetching enrollments", "error": str(e)}), 500
        

    @jwt_required()
    @role_required("librarian")
    def delete(self, enroll_id):
        try:
            enroll = Enrollments.query.filter_by(id=enroll_id).first()
            db.session.delete(enroll)
            db.session.commit()
            return make_response(jsonify({"msg": "Successfully revoked enrollment."}), 200)
        except Exception as e:
            return jsonify({"msg": "Error while revoking enrollment", "error": str(e)}), 500




class UserEnrolls(Resource):
    @jwt_required()
    @role_required("librarian")
    def get(self, user_id):
        try:
            enrolls = Enrollments.query.filter_by(user_id=user_id).all()
            enrollments_data = []
            for enroll in enrolls:
                enrollments_data.append({
                    "id": enroll.id,
                    "user_id": enroll.user_id,
                    "book_id": enroll.book_id,
                    "user_name": enroll.user.name,
                    "book_name": enroll.book.name,
                    "author": enroll.book.author_name,
                    "issue_date": enroll.issue_date.isoformat(),
                    'return_date': enroll.return_date.isoformat()
                })
            return make_response(jsonify(enrollments_data), 200)
        except Exception as e:
            return jsonify({"msg": "Error while fetching enrollments", "error": str(e)}), 500

    

    @jwt_required()
    @role_required("librarian")
    def delete(self):
        try:
            data = request.json
            id = data.get('enroll_id')
            enroll = Enrollments.query.filter_by(id=id).first()
            if enroll:
                db.session.delete(enroll)
                db.session.commit()
                return jsonify({"msg": "Revoked book access successfully!"})
            else:
                return jsonify({"msg": "Enrollment not found"}), 404
        except Exception as e:
            return jsonify({"msg": "Error while revoking book access", "error": str(e)}), 500


class Return(Resource):

    @jwt_required()
    def delete(self):
        try:
            user = get_jwt_identity()
            data = request.json
            enroll_id = data.get("enroll_id")
            book_id = data.get("book_id")
            feedback = data.get("feedback")
            read_value = data.get("read_val")

            try:
                if read_value == "Yes":
                    status = Status(book_id=book_id, user_id=user["id"])
                    db.session.add(status)

                if feedback != '':
                    feed = Feedback(book_id=book_id, feedback=feedback)
                    db.session.add(feed)

                enrollment = Enrollments.query.filter_by(id=enroll_id).first()
                if enrollment:
                    db.session.delete(enrollment)
                    db.session.commit()
                    return jsonify({"msg": "Book has been returned successfully!"})
                else:
                    return jsonify({"msg": "Enrollment not found"}), 404
            except Exception as e:
                return jsonify({"msg": "Error while processing return", "error": str(e)}), 500
        except Exception as e:
            return jsonify({"msg": "Error while data processing", "error": str(e)}), 500

class ReIssue(Resource):

    @jwt_required()
    def post(self):
        try:
            data = request.json
            enroll_id = data.get('enroll_id')

            try:
                enroll = Enrollments.query.filter_by(id=enroll_id).first()  
                if enroll:
                    enroll.return_date = enroll.return_date + timedelta(days=7)
                    db.session.commit()
                    return make_response(jsonify({"msg": "Book has been RE-ISSUED for 1 more week successfully!"}), 200)
                else:
                    return jsonify({"msg": "Enrollment not found"}), 404
            except Exception as e:
                return jsonify({"msg": "Database error occurred", "error": str(e)}), 500
        except Exception as e:
            return jsonify({"msg": "Error while data processing", "error": str(e)}), 500

api.add_resource(Enrolls, "/api/admin/revoke", "/api/admin/revoke/<int:enroll_id>")
api.add_resource(Return, "/api/return")
api.add_resource(ReIssue, "/api/re-issue")
api.add_resource(UserEnrolls, "/api/admin/enroll/<int:user_id>")