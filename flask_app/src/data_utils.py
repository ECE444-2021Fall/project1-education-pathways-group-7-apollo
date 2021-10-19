# ------------------------------------------------------------------------------
# Classes and functions to manage user, course, and program data
# ------------------------------------------------------------------------------
import pandas as pd
import numpy as np
import os

def jsonify_dict(input):
    """
    Returns jsonified dict
    """
    ret = {}
    for k, v in input.items():
        if isinstance(k, np.ndarray):
            k = k.tolist()
        if isinstance(v, np.ndarray):
            v = v.tolist()
        ret[k] = v
    return ret

class SearchInfo():
    """
    Search object
    """

    def __init__(self, search_field="", search_filters={}):
        """
        Initialize search object
        search_field is string searched
        search_field is dictionary of headers + values
        """
        self.set_search_field(search_field)
        self.set_search_filters(search_filters)

    def set_search_field(self, search_field):
        self.search_field = search_field
        return

    def set_search_filters(self, search_filters, course_dir):
        """
        Validate search filters against supported headers
        search_filters is a dictionary of headers + values
        course_dir is a CourseDirectory() object
        """
        search_filters = {}
        supported_search_headers = course_dir.get_supported_search_headers()
        for header, value in search_filters.items():
            if header in supported_search_headers:
                header_options = course_dir.get_header_options(header)
                if value in header_options:
                    search_filters[header] = value

        self.search_filters = search_filters
        return


class Course():
    """
    Class to represent one course's info for detailed course info purposes
    """

    def __init__(self, id=-1, course_dict={}):
        self.set_course_id(id)  # TODO: Want to hide id? if so make it _
        self.set_course_dict(course_dict)
    
    def set_course_id(id):
        self.id = id

    def set_course_dict(course_dict):
        self.course_dict = jsonify_dict(course_dict)

    def match_search(self, input="", filters={}):
        """
        Returns True/False depending on if course matches given search input/filters
        """
        # TODO: implement?
        return

    def get_course_id(self):
        return self.id

    def get_course_json(self, headers=[]):
        """
        Returns jsonified version of course (dict)
        If headers are specified, will only return those info
        """
        return self.course_dict


class CourseDirectory():
    """
    Class to take care of handling course info
    """

    def __init__(self, course_pickle=None):
        """
        Initialize course headers and data from pickle
        """
        self.df_processed = None
        # List of all headers
        self.headers = []
        # Default supported headers
        self.default_supported_search_headers = [
            'Division', 'Department', 'Campus', 'Course Level']
        # Dictionary of supported headers and their supported options
        # Key: header, Value: list of options for header
        self.supported_search_headers = {}
        # Dictionary of course objects where
        # the key is the index and the value is the course dictionary
        self.courses = {}
        # Dictionary of course objects where
        # keys are course codes, and the values are course info dictionaries
        self.code_courses = {}
        self.load_course_pickle(course_pickle)

    def load_course_pickle(self, course_pickle):
        """
        Update/load course info given course pickle
        """
        if not course_pickle:
            print("%s: Error - Unable to load course info", __func__)
            return
        self.df_processed = pd.read_pickle(course_pickle)
        self.clean_course_df()
        self.headers = self.df_processed.columns.tolist()

        # Generate supported search headers and values
        self.supported_search_headers = {}
        for h in self.default_supported_search_headers:
            if h in self.headers:
                self.supported_search_headers[h] = [('Any')] + \
                    sorted([t for t in set(self.df_processed[h].values)])
        self.load_courses()

    def clean_course_df(self):
        """
        Apply all dataframe modifications here
        TODO: implement this as loading from a log file of changes so that the
        database architecture is modifiable in the future
        """
        # Remove "Activity" and "Last updated" columns
        self.df_processed = self.df_processed.drop("Activity", 1)
        self.df_processed = self.df_processed.drop("Last updated", 1)

    def load_courses(self):
        """
        Load list of courses as dictionaries
        self.courses: keys are the course indexes, and the values are course info dictionaries
        ie.
        {0 : {'Code' : 'ECE444H1', 'Name': 'Software Engineering', ...}}
        self.code_courses: keys are course codes, and the values are course info dictionaries (excluding course code)
        ie.
        {'ECE444H1' : {'Name': 'Software Engineering', 'Division': 'Faculty of Applied Science & Engineering', 'Course Description': 'The software development process. Software requirements and specifications. Software design techniques. Techniques for developing large software systems; CASE tools and software development environments. Software testing, documentation and maintenance.', 'Department': 'Edward S. Rogers Sr. Dept. of Electrical & Computer Engin.', 'Pre-requisites': ['ECE344H1', 'ECE353H1'], 'Course Level': 4, 'UTSC Breadth': nan, 'APSC Electives': nan, 'Campus': 'St. George', 'Term': array(['2021 Fall'], dtype=object), 'Exclusion': [], 'UTM Distribution': nan, 'Corequisite': [], 'Recommended Preparation': [], 'Arts and
Science Breadth': nan, 'Arts and Science Distribution': nan, 'Later term course details': nan, 'Course': '<a href=/course/ECE444H1>ECE444H1</a>', 'FASEAvailable': False, 'MaybeRestricted': False, 'MajorsOutcomes': ['AECPEBASC', 'AEESCBASER', 'AEESCBASEL'], 'MinorsOutcomes': ['AECERBUS',
'AEMINBUS'], 'AIPreReqs': ['ECE326H1', 'ROB311H1', 'ECE368H1', 'ECE363H1', 'CSC309H1', 'ECE367H1', 'APS360H1', 'ECE353H1', 'ECE344H1', 'ECE318H1', 'ECE358H1', 'ECE361H1', 'ECE355H1', 'ECE311H1', 'ECE352H1', 'ECE354H1', 'ECE345H1', 'ECE302H1', 'ECE356H1', 'CSC384H1', 'ECE349H1', 'ECE360H1', 'ESC301H1', 'ECE320H1', 'MAT389H1', 'ECE342H1']}
        """
        self.courses = self.df_processed.to_dict('index')
        self.code_courses = self.df_processed.set_index(
            'Code').T.to_dict('dict')
        return

    # TODO: implement adding course and saving info to new course pickle

    def set_default_supported_search_headers(self, default_supported_search_headers):
        """
        Update default supported headers list and update supported_search_headers dict
        """
        # TODO: implement this
        return

    def get_course_df(self):
        return self.df_processed

    def get_headers(self):
        """
        Return all the possible headers for course data
        """
        return {"headers": self.headers}

    def get_supported_search_headers(self):
        """
        Returns a dict with a list of all the supported headers for course data
        """
        return self.supported_search_headers

    def get_supported_header_options(self, header):
        """
        For a given supported header, return all the possible options
        If header not supported, return nothing
        """
        return self.supported_search_headers

    def search(self, input="", filters={}):
        """
        For a given input or filters, search for all valid courses
        @param input is the input text user gives
        @param filters is a dictionary of filters applied key: header, value: header option value
        # TODO: determine which return best
        Returns a list of course objects or course ids?
        """
        # TODO: implement this
        return []

    def jsonify_course_list(self, course_list=[]):
        """
        Given a list of courses, jsonify the output for search display (dict)
        where x is the number of results, and each result will be numbered from
        0 to x-1
        Format:
        {
            num_results : x,
            0 : {course0_info},
            1 : {course1_info},
            ...
            x-1 : {coursex-1_info},
        }
        """
        # TODO: implement this
        return ""

    def retrieve_courses(self, course_id_list=[]):
        """
        For a given list of course ids, returns a list of course objects
        """
        course_list = []
        for id in course_id_list:
            if id in self.courses.keys():
                course_list.append(Course(id=id, course_dict=self.courses[id]))

        return course_list

    def get_course_from_id(self, course_id):
        """
        For a given course id, return course object
        """
        return Course(id=id, course_dict=self.courses[course_id])

    def get_course_json_from_code(self, course_code):
        """
        For a given course code, return course json
        """
        if course_code not in self.code_courses.keys():
            # No course code found
            # TODO: allow for looser lookups (ie, ECE444, ECE444H1 would both return)
            return {}
        course_json = self.code_courses[course_code]
        course_json['Code'] = course_code
        return jsonify_dict(course_json)
    # TODO; remove this, this is temporary function

    def print_data(self):
        resources_dir = os.path.join(os.path.join(os.path.join(
            os.path.abspath(__file__), '..'), '..'), "resources")
        df_processed = pd.read_pickle(os.path.join(
            resources_dir, "df_processed.pickle"))
        pd.set_option("display.max_rows", None, "display.max_columns", None)
        print(df_processed.head(5))
        return


class Program():
    """
    TODO: implement this
    """

    def __init__(self):
        """
        TODO: implement this
        """
        return


class ProgramDirectory():
    """
    TODO: implement this
    """

    def __init__(self, course_pickle=None):
        """
        TODO: implement this to initialze program data from course data
        or load from new data
        """
        return

    def load_program_info(self, course_pickle=None):
        """
        TODO: implement this to load program info from course pickle
        """
        return
