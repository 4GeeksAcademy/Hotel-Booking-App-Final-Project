from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    # Datos del Usuario
    id_user = db.Column(db.Integer, primary_key=True) 
    name = db.Column(db.String(60), unique=False, nullable=False)
    last_name = db.Column(db.String(60), unique=False, nullable=False)
    #se puede obtener token con username o con email
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(60), unique=True, nullable=False)
    password = db.Column(db.String(120), unique=False, nullable=False)
    user_type = db.Column(db.Enum('cliente', 'hotel', 'admin', name='user_type_enum'), nullable=False)
    password_reset = db.Column(db.String(4), unique=True, nullable=True)
    password_reset_date = db.Column(db.String(120), unique=True, nullable=True)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    hotels = db.relationship('Hotel', back_populates='user', lazy=True)  # Relationship to hotels
        # Campos específicos para usuarios tipo 'hotel'
  

    
    # faltan las foreign keys, van acá
    
    #Foreign keys
    favorites = db.relationship("Favorites", back_populates = "user", lazy = True)
    stay_history = db.relationship("Stay_History", back_populates = "user", lazy = True)
    user_hotel_admin_package = db.relationship("User_Hotel_Admin_Package", back_populates = "user", lazy = True)


    def _repr_(self):
        # ver como agregar también el username
        return f'<User {self.email}>' 

    def serialize(self):
        return {
            "id_user": self.id_user,
            "name": self.name,
            "last_name": self.last_name,
            "email": self.email,
            "username": self.username,
            "user_type": self.user_type,
           
            "is_active": self.is_active,
        }

        #Serializar favoritos
    def serialize_favorites(self):
        return [favorite.serialize() for favorite in self.favorites]
    
    def serialize_stay_history(self):
        return [stay_history.serialize() for stay_history in self.stay_history]
    
    def serialize_hotels(self):
        return [hotel.serialize() for hotel in self.hotels]


class Hotel(db.Model):
    # Datos del Hotel
    id_hotel = db.Column(db.Integer, primary_key=True) 
    name = db.Column(db.String(60), unique=False, nullable=False)
    location = db.Column(db.String(120), unique=False, nullable=False)
    country = db.Column(db.String(20), unique=False, nullable=False)
    description = db.Column(db.String(500), unique=False, nullable=False)
    image_url = db.Column(db.String(255), nullable=True) # URL DE LA IMAGEN
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    # faltan las foreign keys, van acá
    id_user = db.Column(db.Integer, db.ForeignKey('user.id_user'), nullable=False)
    user = db.relationship('User')
    #Foreign Keys
    favorites = db.relationship("Favorites", back_populates = "hotel", lazy = True)
    stay_packages = db.relationship("Stay_Package", back_populates="hotel", lazy=True) #relationship to stay_packages
    #stay_history = db.relationship("Stay_History", back_populates = "hotel", lazy = True)

    def _repr_(self):
        return f'<Hotel {self.id_hotel}>' 

    def serialize(self):
        return {
            "id_hotel": self.id_hotel,
            "name": self.name,
            "location": self.location,
            "country": self.country,
            "description": self.description,
            "image_url": self.image_url,
            "is_active": self.is_active
        }
    def serialize_stay_packages(self):
        return {
            "stay_packages": [package.serialize() for package in self.stay_packages]
        }

class Hotel_Admin_Package(db.Model):
    # Datos de los Paquetes de pago por usuario hotel
    id_admin_package = db.Column(db.Integer, primary_key=True) 
    package_name = db.Column(db.String(120), unique=False, nullable=False)
    description = db.Column(db.String(120), unique=False, nullable=False)
    price = db.Column(db.Integer, unique=False, nullable=False)

    # faltan las foreign keys, van acá
    #Foreign Keys
    user_hotel_admin_package = db.relationship("User_Hotel_Admin_Package", back_populates = "admin_package", lazy = True)
   

    def _repr_(self):
        return f'<Hotel_Admin_Package {self.id_admin_package}>' 

    def serialize(self):
        return {
            "id_admin_package": self.id_admin_package,
            "package_name": self.package_name,
            "description": self.description,
            "price": self.price
        }
    
class User_Hotel_Admin_Package(db.Model):
    # Conexion en los usuarios con el hotel admin package
    id_user_admin_package = db.Column(db.Integer, primary_key=True)

    #Foreign Keys
    id_user = db.Column(db.Integer, db.ForeignKey(User.id_user), nullable=False)
    user = db.relationship(User)
    id_hotel_Admin_Package = db.Column(db.Integer, db.ForeignKey(Hotel_Admin_Package.id_admin_package), nullable=False)
    admin_package = db.relationship(Hotel_Admin_Package)

    def _repr_(self):
        return f'<User_Hotel_Admin_Package {self.id_user_admin_package}>' 

    def serialize(self):
        return {
            "id_hotel_package": self.id_user_admin_package,
            "id_user_reservation": self.id_user_reservation,
            "id_hotel_Admin_Package": self.id_hotel_Admin_Package
        }

class Stay_Package(db.Model):
    # Datos de los Paquetes de estadia a ofrecer a usuarios clientes
    id_hotel_package = db.Column(db.Integer, primary_key=True) 
    hotel_package_name = db.Column(db.String(100), nullable=False) 
    description = db.Column(db.String(1000), unique=False, nullable=False)
    price = db.Column(db.Integer, unique=False, nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)

    # faltan las foreign keys, van acá
    #Foreign Keys
    id_hotel = db.Column(db.Integer, db.ForeignKey('hotel.id_hotel'), nullable=False)
    hotel = db.relationship("Hotel", back_populates="stay_packages")
    stay_history = db.relationship("Stay_History", back_populates = "package", lazy = True) #relationship with hotel
    favorites = db.relationship("Favorites", back_populates = "stay_package", lazy = True) #relationship with hotel
    
    # hotel_package = db.relationship("Hotel_Package", back_populates = "hotel", lazy = True)

    def _repr_(self):
        return f'<Stay_Package {self.id_hotel_package}>' 

    def serialize(self):
        return {
            "id_hotel_package": self.id_hotel_package,
            "hotel_package_name": self.hotel_package_name,
            "description": self.description,
            "price": self.price,
            "start_date": self.start_date.isoformat(),
            "end_date": self.end_date.isoformat(),
            "id_hotel": self.id_hotel,
            "hotel": self.hotel.serialize()
        }

class Reservation(db.Model):
    # Datos por cada Reservación
    id_reservation = db.Column(db.Integer, primary_key=True)
    # Día para el que se reservó para ir
    reservation_date = db.Column(db.Date, nullable=False)
    reservation_payment = db.Column(db.Integer, nullable=False)

    # faltan las foreign keys, van acá
    #Foreign Keys
    user_reservation = db.Column(db.Integer, db.ForeignKey(User.id_user), nullable=False)
    user = db.relationship(User)

    stay_history = db.relationship("Stay_History", back_populates = "reservation", lazy = True)

    def _repr_(self):
        return f'<Reservation {self.id_reservation}>' 

    def serialize(self):
        return {
            "id_reservation": self.id_reservation,
            "reservation_date": self.reservation_date,
            "reservation_payment": self.reservation_payment,
        }

class Payment(db.Model):
    # Datos de los pagos 
    id_payment = db.Column(db.Integer, primary_key=True)
    total_amount = db.Column(db.Integer, nullable=False)
    payment_date = db.Column(db.Date, nullable=False)

    # faltan las foreign keys, van acá
    #Foreign Keys
    user_reservation = db.Column(db.Integer, db.ForeignKey(User.id_user), nullable=False)
    user = db.relationship(User)

    def _repr_(self):
        return f'<Reservation {self.id_reservation}>' 

    def serialize(self):
        return {
            "id_reservation": self.id_reservation,
            "reservation_date": self.reservation_date,
            "total_payment": self.total_payment,
        }

class Favorites(db.Model):
    #Datos de los hoteles favoritos
    id_favorites = db.Column(db.Integer, primary_key=True)
    
    #Foreign keys
    user_favorites = db.Column(db.Integer, db.ForeignKey(User.id_user), nullable=True)
    user = db.relationship(User)
    hotel_favorites = db.Column(db.Integer, db.ForeignKey(Hotel.id_hotel), nullable=True)
    hotel = db.relationship(Hotel)
    stay_package_favorites = db.Column(db.Integer, db.ForeignKey(Stay_Package.id_hotel_package), nullable=True)
    stay_package = db.relationship(Stay_Package)
    

    def _repr_(self):
        return '<Favorites %r>' % self.id_favorites
    
    def serialize(self):
        return {
            "id": self.id,
            "User": self.user_favorites.serialize(),
            "Hotel": self.hotel_favorites.serialize()
        }

class Stay_History(db.Model):
    #Datos de los historial de estadias
    id_stay_history = db.Column(db.Integer, primary_key=True)
    
    #Foreign keys
    user_stay_history = db.Column(db.Integer, db.ForeignKey(User.id_user), nullable=True)
    user = db.relationship(User)
    package_stay_history = db.Column(db.Integer, db.ForeignKey(Stay_Package.id_hotel_package), nullable=True)
    package = db.relationship(Stay_Package)
    reservation_stay_history = db.Column(db.Integer, db.ForeignKey(Reservation.id_reservation), nullable=True)
    reservation = db.relationship(Reservation)

    def _repr_(self):
        return '<Stay_History %r>' % self.id_stay_history
    
    def serialize(self):
        return {
            "id": self.id,
            "User": self.user_stay_history.serialize(),
            "Paquete": self.package_stay_history.serialize(),
            "Fecha de reserva": self.reservation_stay_history.serialize()
}