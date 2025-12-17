from bson import ObjectId
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from flask import jsonify, request
from utils.mongo_utils import db
import bcrypt

doctor_db = db['doctor']

def hash_password(password):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def add_doctor():
    doctor = request.json
    
    existing_doctor = doctor_db.find_one({"email": doctor.get("email")}) 
    
    if existing_doctor:
        return jsonify({"error": "Doctor already exists"}), 400
    
    doctor['password'] = hash_password(doctor['password'])
    
    try:
        result = doctor_db.insert_one(doctor)
        doctor['_id'] = str(result.inserted_id) 
        del doctor['password'] 
        return jsonify(doctor), 201
    except DuplicateKeyError:
        return jsonify({"error": "Doctor already exists"}), 400
    
def update_doctor(id):
    doctor = request.json
    try:
        result = doctor_db.update_one({"_id": ObjectId(id)}, {"$set": doctor})
        if result.modified_count > 0:
            return jsonify({"message": "Doctor updated successfully"}), 200
        else:
            return jsonify({"error": "Doctor not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def signin():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    
    # Retrieve the doctor by email
    doctor = doctor_db.find_one({"email": email})
    
    if doctor and bcrypt.checkpw(password.encode('utf-8'), doctor['password'].encode('utf-8')):
        # Successful sign in
        doctor['_id'] = str(doctor['_id'])  # Convert ObjectId to string for the response
        del doctor['password']  # Remove password from the response
        return jsonify(doctor), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

def get_doctor_by_id(id):
    try:
        # Ensure that the provided ID is a valid ObjectId
        if not ObjectId.is_valid(id):
            return jsonify({"error": "Invalid doctor ID"}), 400

        doctor = doctor_db.find_one({"_id": ObjectId(id)})
        
        if doctor:
            doctor['_id'] = str(doctor['_id'])  # Convert ObjectId to string for the response
            del doctor['password']  # Optionally remove password
            return jsonify(doctor), 200
        else:
            return jsonify({"error": "Doctor not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_all_doctors():
    doctors = list(doctor_db.find({}))
    for doctor in doctors:
        doctor['_id'] = str(doctor['_id'])
        if 'password' in doctor:
            del doctor['password']  # Optionally remove passwords
    return jsonify(doctors), 200

def get_doctors_by_specialization():
    specialization = request.args.get('specialization', '')  # Get specialization from query params
    filters = {}
    
    if specialization:
        filters["field"] = specialization
    
    doctors = list(doctor_db.find(filters))
    for doctor in doctors:
        doctor['_id'] = str(doctor['_id'])
    return jsonify(doctors), 200
