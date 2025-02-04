"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from api.models import db, User, Hotel, User_Hotel_Admin_Package, Hotel_Admin_Package, Stay_Package
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import os, cloudinary, cloudinary.uploader
from api.models import db, User, Hotel, Favorites  # ✅ Add Favorites

from api.models import db, User, Hotel, Stay_Package, User_Hotel_Admin_Package, Hotel_Admin_Package

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
    print(f"Current User: {current_user}") 
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
    
#paquetes en ventana de busqueda
@api.route('/hotel_packages', methods=['GET'])
def get_hotel_stay_packages():
    hotel_packages = Stay_Package.query.all()
    print (hotel_packages)

    serialized_hotels = []

    if not hotel_packages:
        print("Packages not found")
        return jsonify({"message": "Packages not found"}), 404
    
    serialized_hotels = [package.serialize() for package in hotel_packages]

    print(serialized_hotels)

    return jsonify({"hotel_packages": serialized_hotels}), 200
    


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

@api.route('/hotel-plan', methods=['POST'])
@jwt_required()
def select_hotel_plan():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if not user or user.user_type != 'hotel':
        return jsonify({"message": "Access denied"}), 403

    data = request.get_json()
    plan_id = data.get("plan_id")

    if not plan_id:
        return jsonify({"message": "Plan ID is required"}), 400

    # Check if the plan exists
    plan = Hotel_Admin_Package.query.get(plan_id)

    if not plan:
        # If the requested plan does not exist, create it dynamically
        plan_name = "priority" if plan_id == 1 else "basic"  # Assign name based on ID
        plan = Hotel_Admin_Package(id_admin_package=plan_id, package_name=plan_name, description=f"{plan_name} Plan", price=0)
        db.session.add(plan)
        db.session.commit()

    # Link the user to the plan
    user_plan = User_Hotel_Admin_Package.query.filter_by(id_user=user.id_user).first()

    if user_plan:
        user_plan.id_hotel_Admin_Package = plan_id  # Update existing plan
    else:
        user_plan = User_Hotel_Admin_Package(id_user=user.id_user, id_hotel_Admin_Package=plan_id)
        db.session.add(user_plan)

    try:
        db.session.commit()
        return jsonify({"message": f"Plan '{plan.package_name}' selected successfully!"}), 200
    except Exception as e:     
        db.session.rollback()
        return jsonify({"message": f"Error selecting plan: {str(e)}"}), 500

@api.route('/hotel-packages', methods=['GET'])
def get_all_packages():
    try:
        packages = db.session.query(
            Stay_Package,
            User_Hotel_Admin_Package.id_hotel_Admin_Package
        ).join(Hotel, Stay_Package.id_hotel == Hotel.id_hotel) \
         .join(User_Hotel_Admin_Package, User_Hotel_Admin_Package.id_user == Hotel.id_user) \
         .all()

        result = [
            {
                "package": package.serialize(),
                "plan": "priority" if plan_id == 1 else "basic"
            }
            for package, plan_id in packages
        ]

        print("📥 API Response:", result)  # Debugging
        return jsonify(result), 200
    except Exception as e:
        print(f"❌ Error fetching hotel packages: {str(e)}")  # Debugging
        return jsonify({"message": f"Error fetching hotel packages: {str(e)}"}), 500




@api.route('/user/hotels/single', methods=['GET'])
@jwt_required()
def get_single_user_hotel():  # ✅ Renamed function
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if not user or user.user_type != 'hotel':
        return jsonify({"message": "Access denied"}), 403

    hotels = Hotel.query.filter_by(id_user=user.id_user).all()
    return jsonify([hotel.serialize() for hotel in hotels]), 200

@api.route('/hotel/<int:hotel_id>', methods=['GET'])
@jwt_required()
def get_hotel_details(hotel_id):
    hotel = Hotel.query.get(hotel_id)
    if not hotel:
        return jsonify({"message": "Hotel not found"}), 404

    return jsonify({
        "country": hotel.country,
        "location": hotel.location
    }), 200


@api.route('/hotel-packages', methods=['POST'])
@jwt_required()
def add_hotel_package():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    # ✅ Ensure the user exists and is a hotel user
    if not user or user.user_type != 'hotel':
        return jsonify({"message": "Access denied"}), 403

    data = request.get_json()
    print("📥 Received Data:", data)  # Debug incoming request

    # ✅ Ensure required fields are present
    required_fields = ["package_name", "hotel_id", "price", "start_date", "end_date", "description"]
    for field in required_fields:
        if field not in data or not data[field]:
            print(f"❌ Missing field: {field}")  # Debug missing fields
            return jsonify({"message": f"Missing required field: {field}"}), 400

    # ✅ Validate hotel ownership
    hotel = Hotel.query.get(data["hotel_id"])
    if not hotel or hotel.id_user != user.id_user:
        return jsonify({"message": "Invalid hotel selection"}), 400

    try:
        # ✅ Ensure `price` is an integer
        new_package = Stay_Package(
            hotel_package_name=data["package_name"],
            id_hotel=int(data["hotel_id"]),
            price=int(data["price"]),  # Ensure price is an integer
            start_date=data["start_date"],
            end_date=data["end_date"],
            description=data["description"]
        )

        db.session.add(new_package)
        db.session.commit()

        print("✅ Package added successfully:", new_package.serialize())  # Debug success
        return jsonify({"message": "Package added successfully!", "package": new_package.serialize()}), 201
    except Exception as e:
        db.session.rollback()
        print("❌ Error adding package:", str(e))  # Debug error
        return jsonify({"message": f"Error adding package: {str(e)}"}), 500



@api.route('/hotel-packages', methods=['GET'])
@jwt_required()
def get_user_packages():
    try:
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()

        if not user or user.user_type != 'hotel':
            print(f"🚨 Access denied for user: {current_user}")
            return jsonify({"message": "Access denied"}), 403

        hotels = Hotel.query.filter_by(id_user=user.id_user).all()
        if not hotels:
            print(f"🚨 No hotels found for user: {user.username}")
            return jsonify({"message": "No hotels found"}), 404

        hotel_ids = [hotel.id_hotel for hotel in hotels]
        print(f"🔹 Found hotels: {hotel_ids}")

        packages = Stay_Package.query.filter(Stay_Package.id_hotel.in_(hotel_ids)).all()
        if not packages:
            print(f"🚨 No packages found for these hotels: {hotel_ids}")
            return jsonify({"message": "No packages found"}), 404

        # Serialize and return the packages
        serialized_packages = [p.serialize() for p in packages]
        print(f"✅ Returning packages: {serialized_packages}")
        return jsonify(serialized_packages), 200

    except Exception as e:
        print(f"❌ Error fetching hotel packages: {str(e)}")
        return jsonify({"message": f"Error fetching hotel packages: {str(e)}"}), 500



@api.route('/hotel-packages/<int:package_id>', methods=['PUT'])
@jwt_required()
def edit_package(package_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if not user or user.user_type != 'hotel':
        return jsonify({"message": "Access denied"}), 403

    package = Stay_Package.query.get(package_id)
    if not package:
        return jsonify({"message": "Package not found"}), 404

    # Validate that the hotel belongs to the user
    hotel = Hotel.query.filter_by(id_hotel=package.id_hotel, id_user=user.id_user).first()
    if not hotel:
        return jsonify({"message": "Unauthorized"}), 403

    data = request.get_json()
    
    package.price = data.get("price", package.price)
    package.start_date = data.get("start_date", package.start_date)
    package.end_date = data.get("end_date", package.end_date)
    package.description = data.get("description", package.description)

    try:
        db.session.commit()
        return jsonify({"message": "Package updated successfully", "package": package.serialize()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error updating package: {str(e)}"}), 500

#rutas de favoritos para perfil de usuario

@api.route('/user/favorites', methods=['GET'])
@jwt_required()
def get_favorite_hotels():
    try:
        current_user = get_jwt_identity()
        print(f"🔹 Authenticated user: {current_user}")  
        user = User.query.filter_by(username=current_user).first()
        if not user:
            print("❌ User not found")
            return jsonify({"message": "User not found"}), 404

        print(f"📌 User ID: {user.id_user}") 
        
        # Fetch favorite hotels
        favorite_hotels = Favorites.query.filter_by(user_favorites=user.id_user).all()
        
        if not favorite_hotels:
            print("⚠️ No favorite hotels found")
            return jsonify([]), 200

        hotels_data = [fav.hotel.serialize() for fav in favorite_hotels if fav.hotel]
        print(f"✅ Hotels Data: {hotels_data}")  

        return jsonify(hotels_data), 200
    except Exception as e:
        print(f"🔥 ERROR: {e}") 
        import traceback
        traceback.print_exc()  
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500


@api.route('/user/favorites/<int:hotel_id>', methods=['DELETE'])
@jwt_required()
def remove_favorite_hotel(hotel_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    favorite = Favorites.query.filter_by(user_favorites=user.id_user, hotel_favorites=hotel_id).first()
    
    if not favorite:
        return jsonify({"message": "Favorite hotel not found"}), 404
    
    db.session.delete(favorite)
    db.session.commit()
    
    return jsonify({"message": "Hotel removed from favorites"}), 200

@api.route('/user/favorites', methods=['POST'])
@jwt_required()
def add_favorite_hotel():
    try:
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()

        if not user:
            return jsonify({"message": "User not found"}), 404

        data = request.get_json()
        hotel_id = data.get("hotel_id")

        if not hotel_id:
            return jsonify({"message": "Hotel ID is required"}), 400

       
        hotel = Hotel.query.get(hotel_id)
        if not hotel:
            return jsonify({"message": "Hotel not found"}), 404

        
        existing_favorite = Favorites.query.filter_by(
            user_favorites=user.id_user, 
            hotel_favorites=hotel_id
        ).first()

        if existing_favorite:
            return jsonify({"message": "Hotel is already in favorites"}), 400

        # Add favorite
        new_favorite = Favorites(user_favorites=user.id_user, hotel_favorites=hotel_id)
        db.session.add(new_favorite)
        db.session.commit()

        return jsonify({"message": "Hotel added to favorites"}), 201

    except Exception as e:
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500
    

