# app.py
import eventlet
eventlet.monkey_patch()  # must be first!

import os
import gridfs
from werkzeug.utils import secure_filename
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from flask_socketio import SocketIO, join_room, leave_room, emit

from routes.user_routes import user_routes
from routes.ai_routes import ai_routes
from routes.docter_routes import docter_routes
from routes.appointment_routes import appointment_routes
from utils.mongo_utils import db

# --- Config ---
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://healthai-frontend-o32c.onrender.com")
ALLOWED_ORIGINS = [FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"]

# --- App / CORS / Socket.IO ---
app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": ALLOWED_ORIGINS}},
    supports_credentials=True,
)
socketio = SocketIO(
    app,
    cors_allowed_origins=ALLOWED_ORIGINS,
    async_mode="eventlet",
    ping_interval=25,
    ping_timeout=60,
)

# --- Mongo GridFS ---
fs = gridfs.GridFS(db)

# --- Blueprints ---
app.register_blueprint(user_routes)
app.register_blueprint(ai_routes)
app.register_blueprint(docter_routes)
app.register_blueprint(appointment_routes)

# --- Health check ---
@app.get("/healthz")
def healthz():
    return jsonify({"ok": True}), 200

# --- Root ---
@app.get("/")
def index():
    return jsonify({"message": "Welcome to the HealthAI API!"})

# --- Model storage (local disk example) ---
MODEL_DIR = "aimodels"
os.makedirs(MODEL_DIR, exist_ok=True)

@app.post("/models")
def save_model():
    if "model" not in request.files:
        return jsonify({"error": "No model file provided"}), 400
    model_file = request.files["model"]
    filename = secure_filename(model_file.filename or "model.bin")
    path = os.path.join(MODEL_DIR, filename)
    model_file.save(path)  # writes in binary automatically
    return jsonify({"message": f"Model saved: {filename}"}), 201

@app.get("/models/<model_name>")
def load_model(model_name):
    filename = secure_filename(model_name)
    path = os.path.join(MODEL_DIR, filename)
    if not os.path.exists(path):
        return jsonify({"error": "Model not found"}), 404
    # stream back the file (binary-safe)
    return send_file(path, as_attachment=False)

# --- Socket.IO events ---
@socketio.on("join_room")
def handle_join_room(data):
    room = data.get("room")
    username = data.get("name", "Guest")
    if not room:
        return
    join_room(room)
    emit("joinRoom", {"name": "System", "message": f"{username} joined."}, room=room)

@socketio.on("leave_room")
def handle_leave_room(data):
    room = data.get("room")
    username = data.get("name", "Guest")
    if not room:
        return
    leave_room(room)
    emit("leftRoom", {"name": "System", "message": f"{username} left."}, room=room)

@socketio.on("send_message")
def handle_send_message(data):
    room = data.get("room")
    if room:
        emit("message", data, room=room)

# --- Local dev entrypoint (Render uses gunicorn) ---
if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    socketio.run(app, host="0.0.0.0", port=port, debug=True)
