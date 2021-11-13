from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime
from flask_cors import CORS
from flask import Flask, render_template, request, redirect, jsonify, json
import certifi
import os
from pathlib import Path
import simplejson as json

# Load config from a .env file:
load_dotenv()
MONGODB_URI = os.environ['MONGODB_URI']
# Connect to your MongoDB cluster:
client = MongoClient(MONGODB_URI, tlsCAFile=certifi.where())

from data_utils import SearchInfo, Course, CourseDirectory, ProgramDirectory

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Load course info
    course_dir_path = Path(os.path.dirname(os.path.abspath(__file__)))
    course_dir_path = os.path.join(os.path.join(course_dir_path.parent.absolute(), 'resources'), 'df_processed.pickle')

    # This should work as an absolute path
    course_dir = CourseDirectory(course_dir_path)
    # Load program info
    program_dir = ProgramDirectory(course_dir)

    @app.route('/')
    def display_home_info():
        """
        Return home page info
        Example: 127.0.0.1:5000/
        """
        # TODO: don't need this
        return "Hello World!"

    @app.route('/api/supported_search_headers')
    def retrieve_supported_search_headers():
        """
        Retrieve a list of supported search headers and their options
        Example: 127.0.0.1:5000/api/supported_search_headers
        """
        return course_dir.get_supported_search_headers()
    
    @app.route('/api/all_courses_id')
    def retrieve_all_courses_indexed_by_id():
        """
        Retrieve all courses indexed by id
        Example: 127.0.0.1:5000/api/all_courses_id
        """
        return course_dir.get_all_courses_id()

    @app.route('/api/all_courses_code')
    def retrieve_all_courses_indexed_by_code():
        """
        Retrieve all courses indexed by course code
        Example: 127.0.0.1:5000/api/all_courses_code
        """
        return course_dir.get_all_courses_code()

    @app.route('/api/search/')
    def search_results():
        """
        Returns search results given search
        Query input params passed in must have the following
        key: "search_field"
        value: <string user types>
        key: "search_filters"
        value: dictionary of filters where the key is one of the supported search
        headers (retrieved by /api/supported_search_headers), and value is the option for that header

        Output format as a list of courses with index

        Example: 127.0.0.1:5000/api/search/?search_field=software&search_filters={"Campus" : "St. George", "Course Level" : "4", "Department" : "Edward S. Rogers Sr. Dept. of Electrical %26 Computer Engin.", "Division" : "Faculty of Applied Science %26 Engineering", "Term": "2022 Winter" }
        """
        # TODO: status done, tested, need to write automated test
        if "search_field" not in request.args or \
            "search_filters" not in request.args:
            return {}
        search_info = SearchInfo(course_dir=course_dir,
                                 search_field=request.args["search_field"],
                                 search_filters=request.args["search_filters"])
        return search_info.search()

    @app.route('/api/course/<code>')
    def retrieve_course(code):
        """
        Retrieve detailed course info for a given course code
        Example: 127.0.0.1:5000/api/course/ECE444H1
        """
        return course_dir.get_course_json_from_code(code)

    @app.route('/api/course_id/<course_id>')
    def retrieve_course_from_id(course_id):
        """
        Retrieve detailed course info for a given course id
        Example: localhost:5000/api/course_id/2
        """
        # TODO: status done, tested, need to write automated test
        return course_dir.get_course_json_from_id(course_id)

    @app.route('/api/all_majors_id')
    def retrieve_all_majors_id():
        """
        Retrieve all major info
        Example: localhost:5000/api/all_majors_id
        """
        # TODO: status done, tested, need to write automated test
        return program_dir.get_majors_id()

    @app.route('/api/all_majors_code')
    def retrieve_all_majors_code():
        """
        Retrieve all major info
        Example: localhost:5000/api/all_majors_code
        """
        # TODO: status done, tested, need to write automated test
        return program_dir.get_majors_code()

    @app.route('/api/all_minors_id')
    def retrieve_all_minors_id():
        """
        Retrieve all minor info
        Example: localhost:5000/api/all_minors_id
        """
        # TODO: status done, tested, need to write automated test
        return program_dir.get_minors_id()

    @app.route('/api/all_minors_code')
    def retrieve_all_minors_code():
        """
        Retrieve all minor info
        Example: localhost:5000/api/all_minors_code
        """
        # TODO: status done, tested, need to write automated test
        return program_dir.get_minors_code()

    @app.route('/api/all_detailed_eng_minors_id')
    def retrieve_detailed_eng_minors_id():
        """
        Retrieve all detailed engineering minor info

        Returns a dictionary of minor_info dictionaries indexed by minor_id
        minor_info dictionary:
        minor_info = {"Name": "name of minor", "Requirements": {1: ["List of courses", "Course 2"]}}
        There are 3 keys:
        "Name" which has the name of the minor as a value
        "Requirements" which has a list of list of course codes for each
        requirement group
        "Requirement Credits" which has a list of dictionaries where key is #
        of courses required and value is a list of groups that the courses
        must be from (indexed by 0 according to "Requirements" list indexes)
        Example: 
        minor_info["Requirement Credits"] = [{1 : [0]}, {1: [1]}, {1: [2]}, {1 : [3]}, {1: [4]}, {6: [0,1,2,3,4,5]}]
        For this example, there must be a total of 6 credits between the
        requirement groups indexed 0-5

        Example: localhost:5000/api/all_detailed_eng_minors_id
        """
        # TODO: status done, tested, need to write automated test
        return program_dir.get_eng_minors_id()

    @app.route('/api/all_detailed_eng_minors_name')
    def retrieve_detailed_eng_minors_name():
        """
        Retrieve all detailed engineering minor info

        Returns a dictionary of minor_info dictionaries indexed by minor name
        minor_info dictionary:
        minor_info = {"Name": "name of minor", "Requirements": {1: ["List of courses", "Course 2"]}}
        There are 3 keys:
        "Name" which has the name of the minor as a value
        "Requirements" which has a list of list of course codes for each
        requirement group
        "Requirement Credits" which has a list of dictionaries where key is #
        of courses required and value is a list of groups that the courses
        must be from (indexed by 0 according to "Requirements" list indexes)
        Example: 
        minor_info["Requirement Credits"] = [{1 : [0]}, {1: [1]}, {1: [2]}, {1 : [3]}, {1: [4]}, {6: [0,1,2,3,4,5]}]
        For this example, there must be a total of 6 credits between the
        requirement groups indexed 0-5

        Example: localhost:5000/api/all_detailed_eng_minors_name
        """
        # TODO: status done, tested, need to write automated test
        return program_dir.get_eng_minors_name()

    @app.route('/api/major_id/<major_name>')
    def retrieve_major_course_id(major_name):
        """
        Retrieve major courses as course ids for a given major name
        Example: localhost:5000/api/major_id/AECHEBASC
        """
        # TODO: status done, tested, need to write automated test
        return program_dir.get_major_info_course_id(major_name)

    @app.route('/api/major/<major_name>')
    def retrieve_major_course_name(major_name):
        """
        Retrieve major courses as course codes for a given major name
        Example: localhost:5000/api/major/AECHEBASC
        """
        # TODO: status done, tested, need to write automated test
        return program_dir.get_major_info_course_name(major_name)

    @app.route('/api/minor_id/<minor_id>')
    def retrieve_minor_from_id(minor_id):
        """
        Retrieve minor courses as course ids for a given minor name
        Example: localhost:5000/api/minor_id/AECERAIEN
        """
        # TODO: status done, tested, need to write automated test
        return program_dir.get_minor_info_course_id(minor_id)

    @app.route('/api/minor/<minor_name>')
    def retrieve_minor_from_name(minor_name):
        """
        Retrieve minor courses as course codes for a given minor name
        Example: localhost:5000/api/minor/AECERAIEN
        """
        # TODO: status done, tested, need to write automated test
        return program_dir.get_minor_info_course_name(minor_name)

    @app.route('/api/eng_minor_id/<eng_minor_id>')
    def retrieve_eng_minor_from_id(eng_minor_id):
        """
        Retrieve engineering minor info for a given minor id

        Returns a minor_info dictionary:
        minor_info = {"Name": "name of minor", "Requirements": {1: ["List of courses", "Course 2"]}}
        There are 3 keys:
        "Name" which has the name of the minor as a value
        "Requirements" which has a list of list of course codes for each
        requirement group
        "Requirement Credits" which has a list of dictionaries where key is #
        of courses required and value is a list of groups that the courses
        must be from (indexed by 0 according to "Requirements" list indexes)
        Example: 
        minor_info["Requirement Credits"] = [{1 : [0]}, {1: [1]}, {1: [2]}, {1 : [3]}, {1: [4]}, {6: [0,1,2,3,4,5]}]
        For this example, there must be a total of 6 credits between the
        requirement groups indexed 0-5

        Example: localhost:5000/api/eng_minor_id/0
        """
        # TODO: status done, tested, need to write automated test
        return program_dir.get_eng_minor_info_from_id(eng_minor_id)

    @app.route('/api/eng_minor/<eng_minor_name>')
    def retrieve_eng_minor_from_name(eng_minor_name):
        """
        Retrieve engineering minor info for a given minor name

        Returns a minor_info dictionary:
        minor_info = {"Name": "name of minor", "Requirements": {1: ["List of courses", "Course 2"]}}
        There are 3 keys:
        "Name" which has the name of the minor as a value
        "Requirements" which has a list of list of course codes for each
        requirement group
        "Requirement Credits" which has a list of dictionaries where key is #
        of courses required and value is a list of groups that the courses
        must be from (indexed by 0 according to "Requirements" list indexes)
        Example: 
        minor_info["Requirement Credits"] = [{1 : [0]}, {1: [1]}, {1: [2]}, {1 : [3]}, {1: [4]}, {6: [0,1,2,3,4,5]}]
        For this example, there must be a total of 6 credits between the
        requirement groups indexed 0-5

        Example: localhost:5000/api/eng_minor/Artificial Intelligence Engineering
        """
        # TODO: status done, tested, need to write automated test
        return program_dir.get_eng_minor_info_from_name(eng_minor_name)
    
    @app.route('/api/recommended_courses', methods=['GET'])
    def get_recommended_courses():
        """
        Retrieve a list of recommended course given user's major/minor and
        taken courses

        Input:
        major : major_name
        minor : minor_name
        courses_taken : [list, of, courses, by, course code]

        Output:
        recommended_courses : [list, of, courses, by, course code]

        Example: localhost:5000/api/recommended_courses?major_name=""&courses_taken=["AER525H1"]&minor_name=Advanced Manufacturing
        """
        # TODO: test and write automated tests

        req_args = request.args
        if "major_name" not in req_args.keys():
            major_name = None
        else:
            major_name = req_args["major_name"]
        if "minor_name" not in req_args.keys():
            minor_name = None
        else:
            minor_name = req_args["minor_name"]
        if "courses_taken" not in req_args.keys():
            courses_taken = []
        else:
            courses_taken = req_args["courses_taken"].strip(']["').split(', ')


        return program_dir.get_recommended_courses(major_name, minor_name, courses_taken)


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
            minor = body['minor']
            year = body['year']
            coursesTaken = body['courses_taken']
            # db.users.insert_one({
            db['registration'].insert_one({
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "password": password,
                "major": major,
                "minor": minor,
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
                "minor": minor,
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
                minor = data['minor']
                year = data['year']
                coursesTaken = data['coursesTaken']
                dataDict = {
                    'id': str(id),
                    "firstName": firstName,
                    "lastName": lastName,
                    "email": email,
                    "password": password,
                    "major": major,
                    "minor": minor,
                    "year": year,
                    "coursesTaken": coursesTaken
                }
                dataJson.append(dataDict)
            print(dataJson)
            return jsonify(dataJson)
    
    @app.route('/api/authenticate', methods=['POST'])
    def authenticate():
        """
        Check that username and password match an existing user
        """
        db = client['user_management']
        request_body = json.loads(request.get_json()['body'])

        email = request_body['username']
        password = request_body['password']

        matching_user = list(db['registration'].find({'email': email, 'password': password}))

        # Returning the below is equivalent to "no user found"
        dataDict = {"id": None}

        # No matching user will result in [], otherwise, it'll be a [dict()]
        if matching_user:
            data = matching_user[0]
            id = data['_id']
            firstName = data['firstName']
            lastName = data['lastName']
            major = data['major']
            minor = data['minor']
            year = data['year']
            coursesTaken = data['coursesTaken']
            dataDict = {
                    'id': str(id),
                    "firstName": firstName,
                    "lastName": lastName,
                    "major": major,
                    "minor": minor,
                    "year": year,
                    "coursesTaken": coursesTaken
                }

        response = jsonify(dataDict)
        return response
    
    return app

# Open files
app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
