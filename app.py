from flask import Flask
from flask import render_template
from flask_sqlalchemy import SQLAlchemy
from flask import jsonify, request 
from flask_restful import Api 
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_security import Security, SQLAlchemyUserDatastore, UserMixin, RoleMixin, auth_required
from flask_security.utils import hash_password
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
from flask_caching import Cache


app = Flask(__name__)
api = Api(app)
bcrypt = Bcrypt(app)
CORS(app)

app.secret_key = b'verysecretpass'
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///books.sqlite3"

# flask caching
app.config['DEBUG'] = True
app.config['CACHE_TYPE'] = 'RedisCache'
app.config['CACHE_DEFAULT_TIMEOUT'] = 200  #seconds i.e 3mins 20 seconds
app.config['CACHE_REDIS_PORT'] = 6379


# flask security
app.config['SECRET_KEY'] = 'super-secret'
app.config['SECURITY_PASSWORD_SALT'] = 'super-secret-salt'
app.config['SECURITY_TRACKABLE'] = True
app.config['SECURITY_TOKEN_AUTHENTICATION_HEADER'] = 'Authorization'

# jwt Configuration
app.config["JWT_SECRET_KEY"] = 'your_jwt_secret_key'
app.config['JWT_TOKEN_LOCATION'] = ['headers']
# Set the token expiration time
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)  # Tokens will expire in 1 hour


# JWT Initialization
jwt = JWTManager(app)

cache = Cache(app)
db = SQLAlchemy()
db.init_app(app)
app.app_context().push()
migrate = Migrate(app, db)

@app.before_request
def add_admin():
    db.create_all()
    if not User.query.filter_by(email='admin@library.com').first():
        hashed_password = bcrypt.generate_password_hash('admin').decode('utf-8')
        admin = User(name='Admin', email='admin@library.com', password=hashed_password, role='librarian')
        db.session.add(admin)
        db.session.commit()

@app.route("/")
def hello_world():
    return render_template("index.html")



# @app.route("/cache")
# @cache.cached(timeout=10)
# def cachee():
#     return jsonify(datetime.now())

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