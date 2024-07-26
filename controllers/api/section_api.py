from app import api, db
from flask_restful import Resource
from flask import make_response, request
from models.model import Book, Sections
from flask_restful import fields, marshal, marshal_with
from werkzeug.exceptions import HTTPException
from flask_restful import reqparse
from datetime import date, datetime
import json
from controllers.rbac import role_required
from flask_jwt_extended import jwt_required


#marshalling
section_fields={
  "id": fields.Integer,
  "name": fields.String,
  'date_created': fields.DateTime(dt_format='iso8601'),
  "description": fields.String
}

#section_parser
section_parser = reqparse.RequestParser()
section_parser.add_argument("name")
section_parser.add_argument("date_created")
section_parser.add_argument("description")


class SectionNotFound(HTTPException):
    def __init__(self, status_code):
        self.response = make_response('', status_code)

class BadReqCodeError(HTTPException):
    def __init__(self, status_code, error_code, error_message):
        error = {"error_code": error_code, "error_message": error_message}
        self.response = make_response( json.dumps(error), status_code )




class SectionAPIAdmin(Resource):

    @marshal_with(section_fields)
    def get(self, section_name):

        try:  
            sec = Sections.query.filter_by(name=section_name).first()
        except:
            raise SectionNotFound(status_code=500)  #internal server error that database throws

        if sec is None:
            raise SectionNotFound(status_code=404)
        return sec,200


    @jwt_required()
    @role_required("librarian")
    def post(self):

        data = request.json
        name = data.get("name", None)
        description = data.get("description", None)

        #check for errors 400
        if name is None:
            raise BadReqCodeError(status_code=400, error_code="SEC001", error_message="Name is required")
        
        alr_sec = Sections.query.filter_by(name=name).first()
        if alr_sec:
            raise BadReqCodeError(status_code=409, error_code="SEC009", error_message="Section Already Exits")

        try:
            new_sec = Sections(
                name=name,
                date_created = datetime.now(),
                description = description
            )
            db.session.add(new_sec)
            db.session.commit()
        except:
            raise SectionNotFound(status_code=500)
        return marshal(new_sec, section_fields), 201
    


    @jwt_required()
    @role_required("librarian")
    def delete(self, section_id):
        try:  
            sec = Sections.query.filter_by(id=section_id).first()
        except:
            raise SectionNotFound(status_code=500)  #internal server error that database throws

        if sec:
            try:
                books = Book.query.filter_by(section=sec.id).all()
                if books:
                    for i in books:
                            i.section = 1
                    db.session.commit()
                db.session.delete(sec)
                db.session.commit()
                return '', 200

            except:
                raise SectionNotFound(status_code=500)  #internal server error that database throws
            
        #throw error not found
        raise SectionNotFound(status_code=404)
    

    @jwt_required()
    @role_required("librarian")
    def put(self, section_id):

        data = request.json
        name = data.get("name", None)
        description = data.get("description", None)

        try:
            section = Sections.query.filter_by(id=section_id).first()
        except:
            raise SectionNotFound(status_code=500)  #internal server error that database throws
        
        if  Sections.query.filter_by(name=name).first():
                if  Sections.query.filter_by(name=name).first().id != section_id:
                    raise BadReqCodeError(status_code=400, error_code="SEC006", error_message="Name Already Taken")

        if section:
            try:
                section.name = name
                section.description = description
                db.session.commit()
                return marshal(section, section_fields),200
            except:
                raise SectionNotFound(status_code=500)
            
        #throw error not found
        raise SectionNotFound(status_code=404)


api.add_resource(SectionAPIAdmin, '/api/admin/sec', '/api/admin/sec/<section_name>', '/api/admin/sec/<int:section_id>')
