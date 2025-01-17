"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from api.models import db, User, Hotel
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


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
        return jsonify({"message": "Este correo ya está registrado. Por favor, usa otro email."}), 400
    if existing_user_username:
        return jsonify({"message": "Este nombre de usuario ya está en uso. Por favor, elige otro."}), 400

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
        return jsonify({"message": "Usuario registrado correctamente"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error al registrar el usuario: {str(e)}"}), 500


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
    
    return jsonify({"access_token": access_token, "username":user_exists.username, "user_type":user_exists.user_type}), 200

# ENDPOINT DE LA VISTA DEL DASHBOARD
@api.route('/hotels', methods=['GET'])
def get_hotels():
    try:
        hotels = Hotel.query.filter_by(is_active=True).all()
        serialized_hotels = [hotel.serialize() for hotel in hotels]

        return jsonify({"hotels": serialized_hotels}), 200
    except Exception as e:
        return jsonify({"message": f"Error retrieving hotels: {str(e)}"}), 500
