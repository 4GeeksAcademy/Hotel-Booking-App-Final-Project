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
    

    
    access_token = create_access_token(identity=user_exists.username)

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
    

#borrar perfil si el usuario quiere borrar su usuario por completo.
# @api.route('/update-info', methods=['PUT'])
# @jwt_required()
# def update_user_info():
#     current_user = get_jwt_identity()
#     user = User.query.filter_by(username=current_user).first()
#     data = request.get_json()
#     user.name = data.get("name", user.name)
#     user.last_name = data.get("last_name", user.last_name)
#     db.session.commit()
#     return jsonify(user.serialize()), 200

#ruta para poder mostrar la informacion de hotel en el p[erfil de hotel]
@api.route('/hotel-personal-info', methods=['GET'])
@jwt_required()
def get_hotel_personal_info():
    current_user = get_jwt_identity()
    print(f"Current Hotel User: {current_user}")  

    user = User.query.filter_by(username=current_user).first()

    # Check if the user exists
    if not user:
        print("User not found")
        return jsonify({"message": "User not found"}), 404

    # Check if the user has the `hotel` user_type
    if user.user_type != 'hotel':
        print("Access denied for non-hotel users")
        return jsonify({"message": "Access denied"}), 403

    print("Hotel User found, returning data")
    return jsonify(user.serialize()), 200

#PUT para editar la informacion del hotel desde el profile de hotel
@api.route('/hotel-personal-info', methods=['PUT'])
@jwt_required()
def update_hotel_personal_info():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    if user.user_type != 'hotel':
        return jsonify({"message": "Access denied"}), 403

    # Parse the JSON request data
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid data"}), 400

    # Update the fields
    user.name = data.get("name", user.name)
    user.last_name = data.get("last_name", user.last_name)
    user.username = data.get("username", user.username)
    user.email = data.get("email", user.email)
    

    try:
        db.session.commit()
        return jsonify(user.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Failed to update user: {str(e)}"}), 500
    

@api.route('/user/hotels', methods=['GET'])
@jwt_required()
def get_user_hotels():
    current_user = get_jwt_identity()
    print(f"Current User: {current_user}")  # Add this log
    user = User.query.filter_by(username=current_user).first()

    if not user:
        print("User not found")
        return jsonify({"message": "User not found"}), 404

    print("User found, returning data")
    return jsonify(user.serialize_hotels()), 200

#add hotels
#endpoint para crear hotel desde hotel profile.
@api.route('/hotels', methods=['POST'])
@jwt_required()
def add_hotel():
    current_user = get_jwt_identity()
    print (current_user)
    user = User.query.filter_by(username=current_user).first()

    # if not user or user.user_type != 'hotel':
    #     return jsonify({"message": "Access denied"}), 403

    data = request.get_json()
    print("Received data from frontend:", data)  # Log incoming data

    required_fields = ["name", "location", "country", "description", "image_url"]
    if not all(field in data for field in required_fields):
        return jsonify({"message": "Missing required fields"}), 400

    try:
        new_hotel = Hotel(
            name=data["name"],
            location=data["location"],
            country=data["country"],
            description=data["description"],
            is_active=True,
            id_user=user.id_user,  # Associate the hotel with the user
            image_url=data["image_url"]
        )

        db.session.add(new_hotel)
        db.session.commit()

        print("Hotel added successfully:", new_hotel.serialize())  # Log success
        return jsonify(new_hotel.serialize()), 201
    except Exception as e:
        db.session.rollback()
        print("Error adding hotel:", str(e))  # Log exception
        return jsonify({"message": f"Error creating hotel: {str(e)}"}), 500

#desactivar hotel desde hotel profile

@api.route('/hotels/<int:hotel_id>', methods=['PUT'])
@jwt_required()
def update_hotel_status(hotel_id):
    # Debug the incoming request
    current_user = get_jwt_identity()
    print("Current User:", current_user)  # Should print the 'sub' (subject) from the JWT

    # Ensure the user exists in the database
    user = User.query.filter_by(username=current_user).first()
    if not user:
        print("User not found in the database")  # Debugging log
        return jsonify({"message": "User not found"}), 404

    # Check if the user has 'hotel' privileges
    if user.user_type != 'hotel':
        print("Access denied for non-hotel user")  # Debugging log
        return jsonify({"message": "Access denied"}), 403

    # Fetch the hotel by ID
    hotel = Hotel.query.get(hotel_id)
    if not hotel:
        print("Hotel not found")  # Debugging log
        return jsonify({"message": "Hotel not found"}), 404

    # Update the 'is_active' field
    data = request.get_json()
    hotel.is_active = data.get("is_active", hotel.is_active)

    try:
        db.session.commit()
        print("Hotel successfully deactivated")  # Debugging log
        return jsonify(hotel.serialize()), 200
    except Exception as e:
        db.session.rollback()
        print("Error deactivating hotel:", str(e))  # Debugging log
        return jsonify({"message": f"Error updating hotel: {str(e)}"}), 500

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


#endpoint for user info to be edited and submitted
@api.route('/personal-info', methods=['PUT'])
@jwt_required()
def update_personal_info():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    if user.user_type != 'cliente':
        return jsonify({"message": "Access denied"}), 403

    # Parse the JSON request data
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid data"}), 400

    # Update the fields
    user.name = data.get("name", user.name)
    user.last_name = data.get("last_name", user.last_name)
    user.username = data.get("username", user.username)
    user.email = data.get("email", user.email)
    # user.country = data.get("country", user.country)
    # user.language = data.get("language", user.language)

    try:
        db.session.commit()
        return jsonify(user.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Failed to update user: {str(e)}"}), 500
