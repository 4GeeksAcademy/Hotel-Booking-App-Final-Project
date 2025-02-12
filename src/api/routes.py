"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, decode_token, JWTManager
from api.models import db, User, Hotel, User_Hotel_Admin_Package, Hotel_Admin_Package, Stay_History, Stay_Package, Reservation
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_mail import Mail, Message
import os, cloudinary, cloudinary.uploader
from api.models import db, User, Hotel, Favorites  # ✅ Add Favorites
from oauthlib.oauth2 import WebApplicationClient
from datetime import datetime
from api.models import db, User, Hotel, Stay_Package, User_Hotel_Admin_Package, Hotel_Admin_Package
from google.oauth2 import id_token
from google.auth.transport import requests

api = Blueprint('api', __name__)
mailApp = Flask(__name__)

# Allow CORS requests to this API
CORS(api)

#Configuracion de Google API
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", None)
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", None)
GOOGLE_DISCOVERY_URL = (
    "https://accounts.google.com/.well-known/openid-configuration"
)

# OAuth 2 client setup
client = WebApplicationClient(GOOGLE_CLIENT_ID)


#configuracion de Cloudinary
cloudinary.config(
    cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME"),
    api_key=os.environ.get("CLOUDINARY_API_KEY"),
    api_secret=os.environ.get("CLOUDINARY_API_SECRET")
)

#Configuracion de SMTP
mailApp.config["MAIL_SERVER"]='smtp.gmail.com'
mailApp.config["MAIL_USERNAME"]= os.environ.get("MAIL_USERNAME")
mailApp.config["MAIL_PASSWORD"]= os.environ.get("MAIL_PASSWORD")
mailApp.config["MAIL_PORT"]=587
mailApp.config["MAIL_USE_TLS"]=True
mailApp.config["MAIL_USE_SSL"]=False


mail = Mail(mailApp)
mail.init_app(mailApp)

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
    if not all(k in data for k in ("name", "last_name", "email", "username", "password", "user_type", "phone_number")):
        return jsonify({"msg": "Faltan datos obligatorios"}), 400

    # Verifica si el correo o el nombre de usuario ya están registrados
    existing_user_email = User.query.filter_by(email=data['email']).first()
    existing_user_username = User.query.filter_by(username=data['username']).first()
    existing_user_phone = User.query.filter_by(phone_number=data['phone_number']).first()

    if existing_user_email:
        return jsonify({"msg": "This email is already registered. Please use another email address."}), 400
    if existing_user_username:
        return jsonify({"msg": "This username is already in use. Please choose another one."}), 400
    if existing_user_phone:
        return jsonify({"msg": "This phone number is already registered. Please use another phone number."}), 400

    # Crear una nueva instancia de User
    new_user = User(
        name=data['name'],
        last_name=data['last_name'],
        email=data['email'],
        username=data['username'],
        password=current_app.bcrypt.generate_password_hash(data["password"]).decode('utf-8'),  
        user_type=data['user_type'],
        phone_number=data['phone_number'],
        is_active=True  # Suponiendo que el usuario estará activo por defecto
    )

    admin_package = Hotel_Admin_Package.query.filter_by(package_name = 'basic').first()

    # Guardar el usuario en la base de datos
    try:
        db.session.add(new_user)
        db.session.commit()
        # print(data["user_type"])
        if data["user_type"] == "hotel":
            new_admin_package = User_Hotel_Admin_Package(
            id_user = new_user.id_user,
            id_hotel_Admin_Package = admin_package.id_admin_package
            )
            db.session.add(new_admin_package)
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
    try:
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()

        if not user:
            return jsonify({"message": "User not found"}), 404

       
        if user.user_type != 'hotel':
            return jsonify({"message": "Access denied"}), 403

        # Find the hotel
        hotel = Hotel.query.filter_by(id_hotel=hotel_id, id_user=user.id_user).first()
        if not hotel:
            return jsonify({"message": "Hotel not found or unauthorized"}), 404

        # Get request data
        data = request.get_json()
        if "is_active" in data:
            hotel.is_active = data["is_active"]  #  Set to False for deactivation

        db.session.commit()
        return jsonify({"message": "Hotel updated successfully", "hotel": hotel.serialize()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error updating hotel: {str(e)}"}), 500

        
        
@api.route('/hotels/<int:hotel_id>/status', methods=['PUT'])
@jwt_required()
def update_hotel_status_readd(hotel_id):
    try:
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()

        if not user:
            return jsonify({"message": "User not found"}), 404

        
        if user.user_type != 'hotel':
            return jsonify({"message": "Access denied"}), 403

        
        hotel = Hotel.query.filter_by(id_hotel=hotel_id, id_user=user.id_user).first()
        if not hotel:
            return jsonify({"message": "Hotel not found or unauthorized"}), 404

        
        data = request.get_json()
        if "is_active" in data:
            hotel.is_active = data["is_active"]  # ✅ Toggle activation

        db.session.commit()
        return jsonify({"message": f"Hotel {'activated' if data['is_active'] else 'deactivated'} successfully", "hotel": hotel.serialize()}), 200

    except Exception as e:
        db.session.rollback()
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

# PARA CREAR UNA RESERVA, NO SE HA PROBADO:
@api.route('/user/reserve', methods=['POST'])
@jwt_required()
def create_reservation():
    current_user_id = get_jwt_identity()
    
    user = User.query.filter_by(username=current_user_id).first()
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # Obtener los datos de la reserva desde el cuerpo de la solicitud
    reservation_data = request.get_json()
    print(user.id_user) 
    

    package_data = reservation_data["package_data"]

    stay_package = Stay_Package.query.filter_by(id_hotel_package= package_data["id_hotel_package"]).first()

    if not stay_package:
        return jsonify({"error": "Paquete de estadía no encontrado"}), 404

    # Crear la nueva reserva
    new_reservation = Reservation(
        id_user= user.id_user,
        reservation_date= datetime.now(),
        reservation_payment=stay_package.price,
        stay_package_id=stay_package.id_hotel_package,
        is_paid = False
    )

    db.session.add(new_reservation)
    db.session.commit()

    return jsonify(new_reservation.serialize()), 201

# OBTENER LAS RESERVAS POR USER CLIENTE
@api.route('/user/reservations', methods=['GET'])
@jwt_required()
def get_user_reservations():
    current_user_username = get_jwt_identity()
    
    user = User.query.filter_by(username=current_user_username).first()
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # Verificar si el usuario tiene historial de reservas
    reservations = Reservation.query.filter_by(id_user=user.id_user).all()
    
    if not reservations:
        return jsonify({"message": "No tienes reservas activas"}), 200

    # Serializar las reservas
    reservations = [reservation.serialize() for reservation in reservations]
    
    return jsonify({"reservations": reservations}), 200

# PARA PAYPAL:
@api.route('/pay-reservation/<int:reservation_id>', methods=['PUT'])
def pay_reservation(reservation_id):
    try:
        data = request.json
        order_id = data.get("orderID")
        payment_id = data.get("paymentID")

        # Aquí podrías validar el orderID con la API de PayPal antes de actualizar la reserva
        reservation = Reservation.query.get(reservation_id)

        if not reservation:
            return jsonify({"msg": "Reserva no encontrada"}), 404

        reservation.is_paid = True
        reservation.order_id = order_id
        reservation.payment_id = payment_id
        db.session.commit()

        return jsonify({"msg": "Reserva actualizada exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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

#Hoteles de la busqueda
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
def get_single_user_hotel():  #  Renamed function
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

        # Find hotels owned by the logged-in user
        hotels = Hotel.query.filter_by(id_user=user.id_user).all()
        if not hotels:
            print(f"🚨 No hotels found for user: {user.username}")
            return jsonify({"message": "No hotels found"}), 404

        hotel_ids = [hotel.id_hotel for hotel in hotels]
        print(f"🔹 Found hotels: {hotel_ids}")

        # Fetch only the packages for those hotels
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


@api.route('/pass-reset', methods=['POST'])
def password_reset():
    current_user = request.json.get("user", None)
    user_exists = User.query.filter(User.email == current_user).first()

    if not user_exists:
        return jsonify({"message": "account not found"}), 401
    
    return jsonify({"message": "reset link sent"}), 200

@api.route('/send-email', methods=['PUT'])
def code_notification():
    #define the users to get the email
    user_email = request.json.get("email", None)
    code = request.json.get("code", None)
    code_date = request.json.get("code_date", None)

    user_exists = User.query.filter(User.email == user_email).first()

    user_exists.password_reset = code
    user_exists.password_reset_date = code_date
    db.session.commit()
    
    recipients = []
    recipients.append(user_email)

    # Create a Message object with subject, sender, and recipient list
    msg = Message(subject= 'Reset Password',
                  sender='smtptestingmu@gmail.com',
                  recipients=recipients)  # Pass the list of recipients here
    
    msg.body = "testing"
    # HTML body content
    msg.html = """\
    <html>
        <body>
            <h1>Hello from Serenia!</h1>
            <p>We've received your request to reset your password. Please click the link below to complete the reset.
            email sent from a Flask application using Flask-Mail. Here is the code: </p>
            <h2>{code}</h2>
            <a href="https://example.com">Please go here to insert the code</a>
        </body>
    </html>
    """.format(code = code)

    mail.send(msg)
    
    return jsonify({"message": "email sent!"}), 200


@api.route('/code-verification', methods=['POST'])
def verify_code():
    #define the users to get the email
    user_email = request.json.get("email", None)
    code = request.json.get("code", None)
    code_date = request.json.get("code_date", None)

    user_exists = User.query.filter(User.email == user_email).first()

    user_exists.password_reset = code
    user_exists.password_reset_date = code_date
    db.session.commit()
    
    
    return jsonify({"message": "email sent!"}), 200

    

    
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
    
@api.route('/pass-reset-check', methods = ['PUT'])
def verification_code_date():
    data = request.get_json()
    print(data)
    
    try:
        verified_user = User.query.filter_by(email = data["email"]).first()
        code_date =  int(verified_user.password_reset_date)

        print(verified_user.password_reset, data["code"])
        print(verified_user.password_reset_date, data["code_date"])

        if not verified_user:
            return jsonify({"message": "This email is not registered within the system"}), 401
        
        if not verified_user.password_reset:
            return jsonify({"message": "A code has yet to be requested"}), 402
        
        if not code_date > data["code_date"]:
            return jsonify({"message": "The code has expired"}), 403

        if verified_user.password_reset == data["code"] and (code_date > data["code_date"]):
            print("Correct!")
            verified_user.password_reset = ""
            verified_user.password_reset_date = ""
            db.session.commit()
            return jsonify({"Code": True})
        
    except Exception as e:
         return jsonify({"error": "Internal Server Error", "details": str(e)}), 500
    

@api.route('/change-password', methods = ['PUT'])
def password_change():
    data = request.get_json()
    print(data)
    try:
        verified_user = User.query.filter_by(email = data["email"]).first()
        password =  current_app.bcrypt.generate_password_hash(data["newPassword"]).decode('utf-8')

        verified_user.password = password
        
        db.session.commit()
        return jsonify({"message": "Successfully reset the password!"})
        
    except Exception as e:
         return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

@api.route('/google/verify', methods = ['POST'])
def verify_google_account():
   token = request.get_json()

   try:
        # Specify the WEB_CLIENT_ID of the app that accesses the backend:
        idinfo = id_token.verify_oauth2_token(token["credential"], requests.Request(), os.environ.get(GOOGLE_CLIENT_ID, None))

        userid = idinfo['sub']
        print(userid)
        return jsonify({"user_id": userid}), 201
   
   except ValueError:
    # Invalid token
        pass

@api.route('/google/login', methods = ['POST'])
def google_login():
   email_data = request.get_json()
   print(email_data["email"])
   try:
        user = User.query.filter_by(email = email_data["email"]).first()
        print(user)
        if not user:
            return jsonify({"msg": "This user is not in the system"}), 401

        access_token = create_access_token(identity=user.username)
   
        return jsonify({"access_token": access_token, "user": user.serialize()}), 201
   
   except Exception as e:
    # Invalid token
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 403

# ELIMINAR UNA RESERVA POR ID
@api.route('/reservations/<int:id_reservation>', methods=['DELETE'])
@jwt_required()
def delete_reservation(id_reservation):
    current_user_username = get_jwt_identity()

    # Obtener al usuario autenticado
    user = User.query.filter_by(username=current_user_username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Buscar la reserva
    reservation = Reservation.query.filter_by(id_reservation=id_reservation, id_user=user.id_user).first()
    if not reservation:
        return jsonify({"error": "Reservation not found or unauthorized"}), 404

    try:
        # Eliminar la reserva de la base de datos
        db.session.delete(reservation)
        db.session.commit()
        return jsonify({"msg": "Reservation deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error deleting reservation", "details": str(e)}), 500
    
# ELIMINAR TODAS LAS RESERVAS DEL USUARIO AUTENTICADO
@api.route('/user/reservations', methods=['DELETE'])
@jwt_required()
def delete_all_reservations():
    current_user_username = get_jwt_identity()

    # Obtener al usuario autenticado
    user = User.query.filter_by(username=current_user_username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Buscar todas las reservas del usuario
    reservations = Reservation.query.filter_by(id_user=user.id_user).all()
    
    if not reservations:
        return jsonify({"message": "You have no active reservations"}), 200

    try:
        # Eliminar todas las reservas
        for reservation in reservations:
            db.session.delete(reservation)
        db.session.commit()

        return jsonify({"msg": "All reservations have been removed"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error deleting reservations", "details": str(e)}), 500