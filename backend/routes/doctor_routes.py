from flask import Blueprint
from controllers.user_controller import get_all_users, get_user_by_id, add_user, signin
from controllers.doctor_controller import add_doctor, get_all_doctors, get_doctor_by_id, signin, get_doctors_by_specialization, update_doctor
doctor_routes = Blueprint('doctor', __name__)

doctor_routes.route('/doctor/register', methods=['POST'])(add_doctor)
doctor_routes.route('/doctor/signin', methods=['POST'])(signin)

doctor_routes.route('/doctor/<id>', methods=['GET'])(get_doctor_by_id)
doctor_routes.route('/doctor/<id>', methods=['PUT'])(update_doctor)
doctor_routes.route('/doctors', methods=['GET'])(get_all_doctors)
doctor_routes.route('/doctors/get-by-specialization', methods=['GET'])(get_doctors_by_specialization)
