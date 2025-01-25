from flask import Flask, request, jsonify, Blueprint, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models import db, User, Hotel
import cloudinary.uploader

api = Blueprint('api', __name__)

# Endpoint to add a hotel
@api.route('/hotels', methods=['POST'])
@jwt_required()
def add_hotel():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if not user or user.user_type != 'hotel':
        return jsonify({"message": "Access denied"}), 403

    data = request.get_json()
    required_fields = ["name", "location", "country", "description"]
    if not all(field in data for field in required_fields):
        return jsonify({"message": "Missing required fields"}), 400

    try:
        new_hotel = Hotel(
            name=data["name"],
            location=data["location"],
            country=data["country"],
            description=data["description"],
            is_active=True,
            id_user=user.id_user
        )
        db.session.add(new_hotel)
        db.session.commit()
        return jsonify(new_hotel.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error creating hotel: {str(e)}"}), 500

# Endpoint to deactivate a hotel
@api.route('/hotels/<int:hotel_id>', methods=['PUT'])
@jwt_required()
def update_hotel_status(hotel_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if not user or user.user_type != 'hotel':
        return jsonify({"message": "Access denied"}), 403

    hotel = Hotel.query.get(hotel_id)
    if not hotel:
        return jsonify({"message": "Hotel not found"}), 404

    data = request.get_json()
    hotel.is_active = data.get("is_active", hotel.is_active)

    try:
        db.session.commit()
        return jsonify(hotel.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error updating hotel: {str(e)}"}), 500

# Endpoint to upload images to Cloudinary
@api.route('/upload', methods=['POST'])
def upload_image():
    file = request.files.get("image")
    if not file:
        return jsonify({"error": "File is required"}), 400

    try:
        result = cloudinary.uploader.upload(file)
        return jsonify({"message": "Image uploaded successfully", "image_url": result["secure_url"]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
