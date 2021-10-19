from flask import Flask, render_template, request, redirect, jsonify
import os

from data_utils import SearchInfo, Course, CourseDirectory, Program, ProgramDirectory

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Load course info
    resources_dir = os.path.join(os.path.join(os.path.join(
        os.path.abspath(__file__), '..'), '..'), "resources")
    course_dir = CourseDirectory(os.path.join(
        resources_dir, "df_processed.pickle"))
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

    @app.route('/results')
    def search_results(search):
        """
        Returns search results given search
        """
        # TODO: implement
        return

    @app.route('/course/<code>')
    def retrieve_course(code):
        """
        Retrieve detailed course info for a given course
        """
        # TODO: status done, need to write automated test
        return course_dir.get_course_json_from_code(code)
    return app

# Open files
app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
