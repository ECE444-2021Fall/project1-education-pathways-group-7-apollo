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
    # This should work as an absolute path
    course_dir = CourseDirectory('resources/df_processed.pickle')
    # Load program info
    program_dir = ProgramDirectory(course_dir)
    # TODO: load user info

    @app.route('/')
    def display_home_info():
        """
        Return home page info
        """
        # TODO: don't need this
        return "Hello World!"

    @app.route('/api/supported_search_headers')
    def retrieve_supported_search_headers():
        """
        Retrieve a list of supported search headers and their options
        """
        # TODO: status done, tested, need to write automated test
        return course_dir.get_supported_search_headers()
    
    @app.route('/api/all_courses_id')
    def retrieve_all_courses_indexed_by_id():
        """
        Retrieve all courses indexed by id
        """
        # TODO: status done, tested, need to write automated test
        return course_dir.get_all_courses_id()

    @app.route('/api/all_courses_code')
    def retrieve_all_courses_indexed_by_code():
        """
        Retrieve all courses indexed by course code
        """
        # TODO: status done, tested, need to write automated test
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
        """
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
        """
        # TODO: status done, tested, need to write automated test
        return course_dir.get_course_json_from_code(code)

    @app.route('/api/course_id/<course_id>')
    def retrieve_course_from_id(course_id):
        """
        Retrieve detailed course info for a given course id
        """
        # TODO: status done, tested, need to write automated test
        return course_dir.get_course_json_from_id(course_id)

    return app

# Open files
app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
