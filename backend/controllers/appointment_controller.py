from bson import ObjectId
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from flask import jsonify, request
from utils.mongo_utils import db
import bcrypt

appointment_db = db['appointment']

def create_appointment():
    appointment = request.json
    try:
        result = appointment_db.insert_one(appointment)
        appointment['_id'] = str(result.inserted_id)
        return jsonify(appointment), 200
    except DuplicateKeyError:
        return jsonify({"error": "Appointment already exists"}), 400
    
def update_appointment(id):
    appointment = request.json
    try:
        result = appointment_db.update_one({"_id": ObjectId(id)}, {"$set": appointment})
        if result.modified_count > 0:
            return jsonify({"message": "Appointment updated successfully"}), 200
        else:
            return jsonify({"error": "Appointment not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def delete_appointment(id):
    try:
        result = appointment_db.delete_one({"_id": ObjectId(id)})
        if result.deleted_count > 0:
            return jsonify({"message": "Appointment deleted successfully"}), 200
        else:
            return jsonify({"error": "Appointment not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def get_doctors_all_appointments():
    doctor_id = request.json['doctor_id']
    appointments = list(appointment_db.find({"doctor_id": doctor_id}))
    for appointment in appointments:
        appointment['_id'] = str(appointment['_id'])
    return jsonify(appointments), 200
    
def get_users_all_appointments():
    user_id = request.json['user_id']
    appointments = list(appointment_db.find({"user_id": user_id}))
    for appointment in appointments:
        appointment['_id'] = str(appointment['_id'])
        doctor = db['doctor'].find_one({"_id": ObjectId(appointment['doctor_id'])})
        if doctor:
            doctor['_id'] = str(doctor['_id'])
            del doctor['password']
            appointment['doctor'] = doctor
    return jsonify(appointments), 200
