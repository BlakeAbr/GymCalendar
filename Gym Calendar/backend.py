from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///gym_progress.db'
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this to a secure secret key
db = SQLAlchemy(app)
jwt = JWTManager(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    workouts = db.relationship('Workout', backref='user', lazy=True)

class Workout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    mood = db.Column(db.String(20))
    exercises = db.relationship('Exercise', backref='workout', lazy=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Exercise(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    sets_reps = db.Column(db.String(20), nullable=False)
    weight = db.Column(db.String(20))
    workout_id = db.Column(db.Integer, db.ForeignKey('workout.id'), nullable=False)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already exists'}), 400
    
    hashed_password = generate_password_hash(data['password'])
    new_user = User(username=data['username'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user and check_password_hash(user.password, data['password']):
        token = create_access_token(identity=user.id)
        return jsonify({'token': token}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/workout', methods=['POST'])
@jwt_required()
def save_workout():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    workout = Workout(
        date=datetime.strptime(data['date'], '%m/%d/%Y').date(),
        mood=data['mood'],
        user_id=user_id
    )
    db.session.add(workout)
    
    for exercise_data in data['exercises']:
        exercise = Exercise(
            name=exercise_data['exercise'],
            sets_reps=exercise_data['setsReps'],
            weight=exercise_data['weight'],
            workout=workout
        )
        db.session.add(exercise)
    
    db.session.commit()
    return jsonify({'message': 'Workout saved successfully'}), 201

@app.route('/api/workouts', methods=['GET'])
@jwt_required()
def get_workouts():
    user_id = get_jwt_identity()
    workouts = Workout.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'date': workout.date.strftime('%m/%d/%Y'),
        'mood': workout.mood,
        'exercises': [{
            'name': exercise.name,
            'sets_reps': exercise.sets_reps,
            'weight': exercise.weight
        } for exercise in workout.exercises]
    } for workout in workouts]), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
