from dotenv import load_dotenv
from pymongo import MongoClient
from flask import Flask, render_template, request, redirect, jsonify
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

    @app.route('/api/mongo')
    def fetch_collections():
        db = client['cocktails']
        collections = db.list_collection_names()
        return {"cols": collections}

    return app

# Open files
app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
