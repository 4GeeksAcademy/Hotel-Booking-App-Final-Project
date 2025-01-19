  
import os
from flask_admin import Admin
from .models import db, User, Favorites, Stay_History, Hotel, Hotel_Admin_Package, Payment, Reservation, Stay_Package, User_Hotel_Admin_Package
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Favorites, db.session))
    admin.add_view(ModelView(Stay_Package, db.session))
    admin.add_view(ModelView(Stay_History, db.session))
    admin.add_view(ModelView(Hotel, db.session))
    admin.add_view(ModelView(Hotel_Admin_Package, db.session))
    admin.add_view(ModelView(Payment, db.session))
    admin.add_view(ModelView(Reservation, db.session))
    admin.add_view(ModelView(User_Hotel_Admin_Package, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))