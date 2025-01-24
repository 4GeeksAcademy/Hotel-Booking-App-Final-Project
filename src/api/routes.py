"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from api.models import db, User, Hotel, User_Hotel_Admin_Package, Hotel_Admin_Package
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import os, cloudinary, cloudinary.uploader

api = Blueprint('api', __name__)


# Allow CORS requests to this API
CORS(api)

cloudinary.config(
    cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME"),
    api_key=os.environ.get("CLOUDINARY_API_KEY"),
    api_secret=os.environ.get("CLOUDINARY_API_SECRET")
)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# ENDPOINT DE LA VISTA DEL REGISTRO
@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    # Verifica que los datos necesarios estén presentes
    if not all(k in data for k in ("name", "last_name", "email", "username", "password", "user_type")):
        return jsonify({"message": "Faltan datos obligatorios"}), 400

    # Verifica si el correo o el nombre de usuario ya están registrados
    existing_user_email = User.query.filter_by(email=data['email']).first()
    existing_user_username = User.query.filter_by(username=data['username']).first()

    if existing_user_email:
        return jsonify({"message": "This email is already registered. Please use another email address.."}), 400
    if existing_user_username:
        return jsonify({"message": "This username is already in use. Please choose another one."}), 400

    # Crear una nueva instancia de User
    new_user = User(
        name=data['name'],
        last_name=data['last_name'],
        email=data['email'],
        username=data['username'],
        password=current_app.bcrypt.generate_password_hash(data["password"]).decode('utf-8'),  
        user_type=data['user_type'],
        is_active=True  # Suponiendo que el usuario estará activo por defecto
    )

    # Guardar el usuario en la base de datos
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error registering user: {str(e)}"}), 500


#Creacion del token de JWT
@api.route('/login', methods = ['POST'])
def handle_login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    user_exists = User.query.filter((User.email == username) |  (User.username == username)).first()

    if not user_exists:
        return jsonify({"msg": "There was an error. Incorrect username or password"}), 401
    
    valid_password = current_app.bcrypt.check_password_hash(user_exists.password, password)

    if not valid_password:
        return jsonify({"msg": "There was an error. Incorrect username or password"}), 401
    
    access_token = create_access_token(identity=username)

    return jsonify({"access_token": access_token, "user":user_exists.serialize()}), 200

# Endpoint para obtener hoteles con paquetes prioritarios
@api.route('/hotels/<package_name>', methods=['GET'])
def get_hotels_with_priority_package(package_name):
    hotels = db.session.query(Hotel).join(User).join(User_Hotel_Admin_Package).join(Hotel_Admin_Package).filter(
        User.user_type == 'hotel',
        Hotel_Admin_Package.package_name == package_name
    ).all()

    result = [hotel.serialize() for hotel in hotels]
    return jsonify(result)

#Endpoint de autenticacion del usuario
@api.route("/access", methods = ["GET"])
@jwt_required()
def user_logon():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username = current_user).first()

    if not user:
        return jsonify({"msg": "The previously authenticated user does not exist anymore."}), 401
    
    return jsonify(user.serialize()), 200


#informacion de clientes 
@api.route('/personal-info', methods=['GET'])
@jwt_required()
def get_personal_info():
    current_user = get_jwt_identity()
    print(f"Current User: {current_user}")  # Add this log
    user = User.query.filter_by(username=current_user).first()

    if not user:
        print("User not found")
        return jsonify({"message": "User not found"}), 404

    if user.user_type != 'cliente':
        print("Access denied")
        return jsonify({"message": "Access denied"}), 403

    print("User found, returning data")
    return jsonify(user.serialize()), 200

# CLOUDINARY
@api.route('/upload', methods=['POST'])
def upload_image():
    file = request.files.get("image")

    if not file:
        return jsonify({"error": "File is required"}), 400

    # Subir la imagen a Cloudinary
    try:
        result = cloudinary.uploader.upload(file)
        if 'secure_url' not in result:
            return jsonify({"error": "The image cannot be uploaded"}), 400

        image_url = result["secure_url"]

        return jsonify({"message": "Image uploaded successfully", "image_url": image_url}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500