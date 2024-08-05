from flask import Flask
from flask import render_template, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
from flask_security import Security
from flask_security.utils import hash_password
from flask_jwt_extended import JWTManager
from datetime import timedelta, datetime
from flask_caching import Cache
from controllers.jobs.workers import celery_init_app
import flask_excel as excel


app = Flask(__name__)
api = Api(app)
bcrypt = Bcrypt(app)
CORS(app)
celery = celery_init_app(app)

app.secret_key = b"verysecretpass"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///books.sqlite3"

# flask caching
app.config["DEBUG"] = True
app.config["CACHE_TYPE"] = "RedisCache"
app.config["CACHE_DEFAULT_TIMEOUT"] = 200  # seconds i.e 3mins 20 seconds
app.config["CACHE_REDIS_PORT"] = 6379


# flask security
app.config["SECRET_KEY"] = "super-secret"
app.config["SECURITY_PASSWORD_SALT"] = "super-secret-salt"
app.config["SECURITY_TRACKABLE"] = True
app.config["SECURITY_TOKEN_AUTHENTICATION_HEADER"] = "Authorization"

# jwt Configuration
app.config["JWT_SECRET_KEY"] = "your_jwt_secret_key"
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)  # Tokens will expire in 1 hour


# Initialization
jwt = JWTManager(app)
cache = Cache(app)
db = SQLAlchemy()

db.init_app(app)
excel.init_excel(app)
app.app_context().push()
migrate = Migrate(app, db)


# route
@app.before_request
def add_admin():
    db.create_all()
    if not User.query.filter_by(email="admin@library.com").first():
        hashed_password = bcrypt.generate_password_hash("admin").decode("utf-8")
        admin = User(
            name="Admin",
            email="admin@library.com",
            password=hashed_password,
            role="librarian",
        )
        db.session.add(admin)
        db.session.commit()


@app.route("/")
def hello_world():
    return render_template("index.html")


# @app.route("/cache")
# @cache.cached(timeout=10)
# def cachee():
#     return jsonify(datetime.now())



# TASKS

from celery.schedules import crontab
from celery.result import AsyncResult
from controllers.jobs import tasks


@app.get("/get-report/<task_id>")
def get_report(task_id):
    
    res = celery.AsyncResult(task_id)
    if res.ready():
        filename = res.result
        return send_file(filename, as_attachment=True)
        # return make_response(jsonify({"message":"Task done!"}), 200)

    else:
        return make_response(jsonify({"message":"Task Pending please wait..."}), 404)


@app.get("/download-book-report")
def down_book_rep():

    job = tasks.admin_book_report.delay()
    return jsonify({"task-id":job.id})

@app.get("/download-enroll-report")
def down_enroll_rep():
    
    task = tasks.admin_issue_report.delay()
    return jsonify({"task-id":task.id})



# Beat
@celery.on_after_finalize.connect
def sechdule_tasks(sender, **kwargs):

    # at 12:00pm everyday it checks for return date approaching.
    sender.add_periodic_task(
        10,
        # crontab(hour=12, minute=00),
        tasks.return_date_approach.s(),
    )  

    # sents a reminder at 6:00 pm everyday to visit site.
    sender.add_periodic_task(
        10,
        # crontab(hour=18, minute=00),
        tasks.daily_reminder.s(),
    )  

    # sents a monthly report at 12:00 am every month on 1st.
    sender.add_periodic_task(
        20,
        # crontab(hour=00, minute=00, day_of_month=1),
        tasks.monthly_report.s(),
    )  


# controllers

from controllers.api.user import *
from controllers.api.book_api import *
from controllers.api.admin import *
from controllers.api.issuebook import *
from controllers.api.requests import *
from controllers.api.enrolls import *
from controllers.api.section import *
from controllers.api.profile import *
from controllers.api.section_api import *


if __name__ == "__main__":
    app.debug = True
    app.run()
