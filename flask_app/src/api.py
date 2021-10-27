from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime
from flask_cors import CORS
from flask import Flask, render_template, request, redirect, jsonify, json

import certifi
import os

# Load config from a .env file:
load_dotenv()
MONGODB_URI = os.environ['MONGODB_URI']
# Connect to your MongoDB cluster:
client = MongoClient(MONGODB_URI, tlsCAFile=certifi.where())

from data_utils import SearchInfo, Course, CourseDirectory, Program, ProgramDirectory

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Load course info
    # this should work as an absolute path
    # resources_dir = os.path.join(os.path.join(os.path.join(
    #     os.path.abspath(__file__), '..'), '..'), "resources")
    course_dir = CourseDirectory('resources/df_processed.pickle')
    # TODO: load program info
    # TODO: load user info

    @app.route('/')
    def display_home_info():
        """
        Return home page info
        """
        # TODO: don't know what to do for homepage
        return "Hello World!"

    @app.route('/api/supported_search_headers')
    def retrieve_supported_search_headers():
        """
        Retrieve a list of supported search headers and their options
        """
        # TODO: status: done, need to write automated test
        return course_dir.get_supported_search_headers()
    
    @app.route('/api/all_courses_id')
    def retrieve_all_courses_indexed_by_id():
        """
        Retrieve all courses indexed by id
        """
        return course_dir.get_all_courses_id()

    @app.route('/api/all_courses_code')
    def retrieve_all_courses_indexed_by_code():
        """
        Retrieve all courses indexed by course code
        """
        return course_dir.get_all_courses_code()

    @app.route('/api/search/')
    def search_results(search):
        """
        Returns search results given search
        """
        # TODO: implement
        return

    @app.route('/api/course/<code>')
    def retrieve_course(code):
        """
        Retrieve detailed course info for a given course
        """
        # TODO: status done, need to write automated test
        return course_dir.get_course_json_from_code(code)

    @app.route('/api/users', methods=['POST', 'GET'])
    def users():
        db = client['user_management']

        # POST a data to database
        if request.method == 'POST':
            body = request.json
            firstName = body['first_name']
            lastName = body['last_name']
            email = body['email'] 
            password = body['password']
            major = body['major']
            year = body['year']
            coursesTaken = body['courses_taken']
            # db.users.insert_one({
            db['registration'].insert_one({
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "password": password,
                "major": major,
                "year": year,
                "coursesTaken": coursesTaken
            })
            return jsonify({
                'status': 'Data is posted to MongoDB!',
                'firstName': firstName,
                'lastName': lastName,
                'email': email,
                "password": password,
                "major": major,
                "year": year,
                "coursesTaken": coursesTaken
            })
        
        # GET all data from database
        if request.method == 'GET':
            allData = db['registration'].find()
            dataJson = []
            for data in allData:
                id = data['_id']
                firstName = data['firstName']
                lastName = data['lastName']
                email = data['email'] 
                password = data['password']
                major = data['major']
                year = data['year']
                coursesTaken = data['coursesTaken']
                dataDict = {
                    'id': str(id),
                    "firstName": firstName,
                    "lastName": lastName,
                    "email": email,
                    "password": password,
                    "major": major,
                    "year": year,
                    "coursesTaken": coursesTaken
                }
                dataJson.append(dataDict)
            print(dataJson)
            return jsonify(dataJson)

    return app

# Open files
app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
