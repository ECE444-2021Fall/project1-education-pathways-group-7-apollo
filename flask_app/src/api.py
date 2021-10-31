from flask import Flask, render_template, request, redirect, jsonify
import os
from pathlib import Path
from data_utils import SearchInfo, Course, CourseDirectory, Program, ProgramDirectory

def create_app():
    app = Flask(__name__, instance_relative_config=True)
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
    # TODO: load user info

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

    @app.route('/api/all_detailed_eng_minors')
    def retrieve_detailed_eng_minors():
        """
        Retrieve all detailed engineering minor info
        Example: TODO
        """
        return program_dir.get_eng_minors()

    @app.route('/api/major/<major_name>')
    def retrieve_major_from_name(major_name):
        """
        Retrieve major courses for a given major name
        Example: TODO
        """
        return program_dir.get_major_info(major_name)

    @app.route('/api/minor/<minor_name>')
    def retrieve_minor_from_name(minor_name):
        """
        Retrieve minor courses for a given minor name
        Example: TODO
        """
        return program_dir.get_minor_info(minor_name)
    
    @app.route('/api/eng_minor/<eng_minor_name>')
    def retrieve_eng_minor_from_name(eng_minor_name):
        """
        Retrieve engineering minor info for a given minor name
        Example: TODO
        """
        return program_dir.get_eng_minor_info(eng_minor_name)

    return app

# Open files
app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
