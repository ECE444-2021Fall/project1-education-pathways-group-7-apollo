# ------------------------------------------------------------------------------
# Classes and functions to manage user, course, and program data
# ------------------------------------------------------------------------------
import json
import simplejson
import numpy as np
import os
import pandas as pd
import random
import re

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
        if isinstance(k, dict):
            k = jsonify_dict(k)
        if isinstance(v, dict):
            v = jsonify_dict(v)
        ret[k] = v
    return simplejson.loads(simplejson.dumps(ret, ignore_nan=True))

def listify_ndarray(input):
    """
    Returns list version of ndarray
    """
    if isinstance(input, np.ndarray):
        return listify_ndarray(input.tolist())
    else:
        return input
            
class SearchInfo():
    """
    Search object
    """

    def __init__(self, course_dir=None, search_field="", search_filters={}):
        """
        Initialize search object
        course_dir is a CourseDirectory object
        search_field is string searched
        search_field is dictionary of headers + values
        """
        self.set_course_dir(course_dir)
        self.set_search_field(search_field)
        self.set_search_filters(search_filters)

    def set_course_dir(self, course_dir):
        if course_dir is None:
            return False
        self.course_dir = course_dir
        return True

    def set_search_field(self, search_field):
        self.search_field = search_field
        return True

    def set_search_filters(self, search_filters):
        """
        Validate search filters against supported headers
        search_filters is a dictionary of headers + values
        """
        if self.course_dir is None:
            return False
        search_filters = json.loads(search_filters)
        supported_search_headers = self.course_dir.get_supported_search_headers()
        for header, value in search_filters.items():
            if header in supported_search_headers:
                header_options = self.course_dir.get_supported_search_headers()[header]
                if value in header_options:
                    search_filters[header] = value

        self.search_filters = search_filters
        return True

    def search(self):
        """
        Assuming search field and search filters have been set, make search
        """
        if self.course_dir is None:
            return {}

        search_result = None
        if self.search_field == "":
            search_result = self.course_dir.get_course_df()
        else:
            # Filter course df for those that have search field as a substring in
            # Code, Name, or Course Description
            df = self.course_dir.get_course_df()
            code_result = df[df["Code"].str.contains(self.search_field, flags=re.IGNORECASE, na=False)]
            name_result = df[df["Name"].str.contains(self.search_field, flags=re.IGNORECASE, na=False)]
            description_result = df[df["Course Description"].str.contains(self.search_field, flags=re.IGNORECASE, na=False)]
            search_result = pd.concat([code_result, name_result, description_result], axis=0)
        
        # Drop duplicates
        search_result = search_result[~search_result.index.duplicated(keep='first')]
        
        # Set filters to be only those that were specified
        filters = {}
        for k, v in self.search_filters.items():
            if v == "Any":
                continue
            filters[k] = v
        
        # Filter the results for each of the filters
        final_df = None
        for k, v in filters.items():
            if final_df is None:
                final_df = search_result[search_result[k].astype(str).str.contains(v, flags=re.IGNORECASE, na=False)]
            else:
                # Keep results that match all filters
                final_df = final_df[final_df[k].astype(str).str.contains(v, flags=re.IGNORECASE, na=False)]
                # If want to keep all results that match at least 1 filter, then do the following:
                # final_df = pd.concat([final_df, filter_result], axis = 0)

        # Drop duplicates
        final_df = final_df[~final_df.index.duplicated(keep='first')]
        
        if final_df is not None:
            return jsonify_dict(final_df.to_dict('index'))
        else:
            return {}

class Course():
    """
    Class to represent one course's info for detailed course info purposes
    """

    def __init__(self, id=-1, course_dict={}):
        self.set_course_id(id)
        self.set_course_dict(course_dict)

    def set_course_id(id):
        self.id = id

    def set_course_dict(course_dict):
        self.course_dict = jsonify_dict(course_dict)

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
            'Division', 'Department', 'Campus', 'Course Level', 'Term']
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
        self.update_course_df()
        self.headers = self.df_processed.columns.tolist()

        # Generate supported search headers and values
        self.supported_search_headers = {}
        for h in self.default_supported_search_headers:
            if h in self.headers:
                if h == 'Term':
                    # Fixup for term
                    s = set()
                    for i in self.df_processed[h].values:
                        if isinstance(i, list) or isinstance(i, np.ndarray):
                            for j in i:
                                s.add(j)
                        else:
                            s.add(i)
                    s = list(s)
                    self.supported_search_headers[h] = [('Any')] + sorted(s)
                else:
                    self.supported_search_headers[h] = [('Any')] + \
                        sorted([t for t in set(self.df_processed[h].values)])
        self.load_courses()

    def update_course_df(self):
        """
        Apply all dataframe modifications here
        TODO: implement this as loading from a log file of changes so that the
        database architecture is modifiable in the future
        """
        # Remove "Activity" and "Last updated" columns
        self.df_processed = self.df_processed.drop("Activity", 1)
        self.df_processed = self.df_processed.drop("Last updated", 1)
        # Generate random average percentages
        percent_grades = np.random.randint(55, 95, self.df_processed.shape[0])
        self.df_processed['Average Percent'] = percent_grades
        # Generate random average letter grades
        letter_grades = []
        for i in percent_grades:
            if 90 <= i <= 100:
                letter_grades.append("A+")
            elif 85 <= i <= 89:
                letter_grades.append("A")
            elif 80 <= i <= 84:
                letter_grades.append("A-")
            elif 77 <= i <= 79:
                letter_grades.append("B+")
            elif 73 <= i <= 76:
                letter_grades.append("B")
            elif 70 <= i <= 72:
                letter_grades.append("B-")
            elif 67 <= i <= 69:
                letter_grades.append("C+")
            elif 63 <= i <= 66:
                letter_grades.append("C")
            elif 60 <= i <= 62:
                letter_grades.append("C-")
            elif 57 <= i <= 59:
                letter_grades.append("D+")
            elif 53 <= i <= 56:
                letter_grades.append("D")
            elif 50 <= i <= 52:
                letter_grades.append("D-")
            else:
                letter_grades.append("null")
        self.df_processed['Average Grade'] = letter_grades

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
        self.courses = jsonify_dict(self.df_processed.to_dict('index'))
        self.code_courses = jsonify_dict(self.df_processed.set_index(
            'Code').T.to_dict('dict'))
        return

    # TODO: implement adding course and saving info to new course pickle for maintenance
    def get_default_supported_search_headers(self):
        """
        Retrieve default supported headers list
        """
        return self.default_supported_search_headers

    def set_default_supported_search_headers(self,
                                             default_supported_search_headers=['Division', 'Department', 'Campus', 'Course Level']):
        """
        Update default supported headers list if it's a valid header
        """
        new_default_headers = []
        for i in default_supported_search_headers:
            if i in self.headers:
                new_default_headers.append(i)
        self.default_supported_search_headers = new_default_headers
        return

    def get_course_df(self):
        """
        Return course info pandas dataframe
        """
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

    def get_all_courses_id(self):
        """
        Returns all the courses indexed by id
        """
        return self.courses

    def get_all_courses_code(self):
        """
        Returns all the courses indexed by course code
        """
        return self.code_courses

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
        return course_json

    def get_course_json_from_id(self, course_id):
        """
        For a given course code, return course json
        """
        course_id = str(course_id)
        if course_id not in self.courses.keys():
            # No course id found
            return {}
        course_json = self.courses[course_id]
        return course_json

class ProgramDirectory():
    """
    This class will manage program majors and minors
    """

    def __init__(self, course_directory=None):
        """
        Initialize program directory from a course directory object
        """
        # Majors
        # Dictionary of majors where
        # key: major name, value: list of course indexes for that major
        self.major_id = {}
        # Dictionary of majors where
        # key: major name, value: list of course codes for that major
        self.major_code = {}
        # Minors
        # Dictionary of minors where
        # key: minor name, value: list of course indexes for that minor
        self.minor_id = {}
        # Dictionary of minors where
        # key: minor name, value: list of course codes for that minor
        self.minor_code = {}
        # Engineering minors (detailed info) where the key is the minor index
        # and the value is a dictionary containing information
        self.eng_minors_id = {}
        # Engineering minors (detailed info) where the key is the minor name
        # and the value is a dictionary containing information
        self.eng_minors_name = {}
        # Course directory object
        self.course_dir = course_directory
        if course_directory is not None:
            self.course_df = course_directory.df_processed
        # Load program information
        self.load_programs()
        return
    
    def load_programs(self):
        """
        Initialize majors and minors from course directory and
        load engineering minor information
        """
        if self.course_dir is None:
            print("Error: course_dir not found")
            return
        
        major_id = {}
        major_code = {}
        minor_id = {}
        minor_code = {}
        # For every course, add the majors/minors to the major/minor info
        # data structures
        for index, row in self.course_df.iterrows():
            mjr = row["MajorsOutcomes"]
            mnr = row["MinorsOutcomes"]
            # Check if there are majors specified
            for m in mjr:
                if m in major_id.keys():
                    major_id[m].append(index)
                else:
                    major_id[m] = [index]

                if m in major_code.keys():
                    major_code[m].append(row["Code"])
                else:
                    major_code[m] = [row["Code"]]
            
            # Check if there are minors specified
            for m in mnr:
                if m in minor_id.keys():
                    minor_id[m].append(index)
                else:
                    minor_id[m] = [index]

                if m in minor_code.keys():
                    minor_code[m].append(row["Code"])
                else:
                    minor_code[m] = [row["Code"]]
            
        self.major_id = major_id
        self.major_code = major_code
        self.minor_id = minor_id
        self.minor_code = minor_code
        self.load_eng_minors()

    def load_eng_minors(self):
        """
        Load engineering minor information manually
        """
        # Returns a dictionary of minor_info dictionaries
        # minor_info dictionary
        # minor_info = {"Name": "name of minor", "Requirements": {1: ["List of courses", "Course 2"]}}
        # There are 3 keys:
        # "Name" which has the name of the minor as a value
        # "Requirements" which has a list of list of course codes for each
        # requirement group
        # "Requirement Credits" which has a list of dictionaries where key is #
        # of courses required and value is a list of groups that the courses
        # must be from (indexed by 0 according to "Requirements" list indexes)

        # Example: 
        # minor_info["Requirement Credits"] = [{1 : [0]}, {1: [1]}, {1: [2]}, {1 : [3]}, {1: [4]}, {6: [0,1,2,3,4,5]}]
        # For this example, there must be a total of 6 credits between the
        # requirement groups indexed 0-5
        self.eng_minors_id = {}
        self.eng_minors_name = {}

        # Artificial Intelligence Engineering
        minor_info = {}
        minor_info["Name"] = "Artificial Intelligence Engineering"
        minor_info["Requirements"] = [["APS360H1"]]
        minor_info["Requirements"].append(["CSC263H1", "ECE345H1", "ECE358H1", "MIE335H1"])
        minor_info["Requirements"].append(["CSC384H1", "MIE369H1", "ROB311H1"])
        minor_info["Requirements"].append(["CSC311H1", "ECE421H1", "MIE424H1", "ROB313H1"])
        minor_info["Requirements"].append(["CHE507H1", "CSC401H1", "CSC413H1", "CSC420H1", "CSC485H1", "CSC486H1", "ECE368H1", "HPS345H1", "HPS346H1", "MIE368H1", "MIE451H1", "MIE457H1", "MIE562H1", "MIE566H1", "ROB501H1"])
        minor_info["Requirements"].append(["AER336H1", "BME595H1", "CHE322H1", "CSC343H1", "CSC412H1", "ECE344H1", "ECE353H1", "ECE356H1", "ECE367H1", "ECE411H1", "ECE419H1", "ECE431H1", "ECE444H1", "ECE454H1", "ECE470H1", "ECE516H1", "ECE532H1", "ECE557H1", "ECE568H1", "MAT336H1", "MAT389H1", "STA302H1", "STA410H1"])
        minor_info["Requirement Credits"] = [{1 : [0]}, {1: [1]}, {1: [2]}, {1 : [3]}, {1: [4]}, {6: [0,1,2,3,4,5]}]
        idx = len(self.eng_minors_id)
        self.eng_minors_id[idx] = minor_info
        self.eng_minors_name[minor_info["Name"]] = minor_info

        # Advanced Manufacturing
        minor_info = {}
        minor_info["Name"] = "Advanced Manufacturing"
        minor_info["Requirements"] = [["MIE304H1", "MIE221H1", "MIE364H1", "MSE351H1", "CHE324H1"]]
        minor_info["Requirements"].append(["MIE519H1"])
        minor_info["Requirements"].append(["TEP343H1", "TEP442H1", "CHE488H1", "CIV488H1", "ECE488H1", "MSE488H1", "MIE488H1", "JRE420H1"])
        minor_info["Requirements"].append(["CHE441H1", "MIE304H1", "MIE342H1", "MIE354H1", "MIE364H1"])
        minor_info["Requirements"].append(["AER525H1", "CHE562H1", "CHE462H1", "CHE475H1", "CHE561H1", "ECE470H1", "FOR424H1", "MIE368H1", "MIE422H1", "MIE440H1", "MIE441H1", "MIE443H1", "MIE469H1", "MIE510H1", "MIE540H1", "MIE562H1", "MIE566H1", "MSE419H1", "MSE421H1", "MSE431H1", "MSE438H1", "MSE443H1", "MSE455H1", "MSE461H1", "MSE478H1"])
        minor_info["Requirement Credits"] = [{1 : [0]}, {1: [1]}, {1: [2]}, {3 : [3, 4]}, {2: [4]}]
        idx = len(self.eng_minors_id)
        self.eng_minors_id[idx] = minor_info
        self.eng_minors_name[minor_info["Name"]] = minor_info

        # Bioengineering
        minor_info = {}
        minor_info["Name"] = "Bioengineering"
        minor_info["Requirements"] = [["CHE353H1", "BME205H1"]]
        minor_info["Requirements"].append(["CHE354H1", "MIE331H1", "BME331H1", "BME395H1", "BME350H1"])
        minor_info["Requirements"].append(["BME330H1", "BME350H1", "BME440H1", "CIV342H1", "FOR308H1", "HMB201H1", "HMB265H1", "HPS318H1", "HPS319H1", "HPS346H1", "MIE242H1", "MIE343H1", "MIE439H1", "BME331H1", "MSE343H1", "PCL201H1", "PHL281H1", "PSL300H1"])
        minor_info["Requirements"].append(["BCB420H1", "BCH441H1", "BME395H1", "BME530H1", "BME435H1", "BME455H1", "BME595H1", "CHE354H1", "CHE416H1", "CHE450H1", "CHE462H1", "CHE471H1", "CHE475H1", "CHE564H1", "CHM446H1", "CIV541H1", "BME445H1", "ECE446H1", "ECE448H1", "FOR421H1", "FOR424H1", "FOR425H1", "IMM250H1", "MGY377H1", "MIE458H1", "MIE523H1", "MIE520H1", "MIE561H1", "MSE440H1", "PCL302H1"])
        minor_info["Requirement Credits"] = [{1 : [0]}, {1: [1]}, {4: [2, 3]}, {2 : [3]}]
        idx = len(self.eng_minors_id)
        self.eng_minors_id[idx] = minor_info
        self.eng_minors_name[minor_info["Name"]] = minor_info

        # Environmental Engineering
        minor_info = {}
        minor_info["Name"] = "Environmental Engineering"
        minor_info["Requirements"] = [["CME259H1", "ESC203H1", "ENV221H1", "GGR223H1"]]
        minor_info["Requirements"].append(["CIV220H1", "CIV440H1", "CHE467H1", "CHE460H1"])
        minor_info["Requirements"].append(["CHE230H1", "CHE460H1", "CHE467H1", "CHM210H1", "CHM310H1", "CIV220H1", "CIV250H", "CIV300H1", "CIV375H1", "CIV440H1", "ENV222H1", "ENV234H1", "ENV350H1", "FOR308H1", "GGR314H1", "MIE315H1"])
        minor_info["Requirements"].append(["APS420H1", "APS530H1", "CHE471H1", "CHE475H1", "CHE564H1", "CHE565H1", "CHM410H1", "CHM415H1", "CIV531H1", "CIV541H1", "CIV549H1", "CIV536H1", "CIV550H1", "CIV575H1", "CIV576H1", "CIV577H1", "CIV578H1", "CME500H1", "FOR421H1", "FOR424H1", "MIE515H1", "MIN330H1", "MIN511H1", "MSE415H1"])
        minor_info["Requirement Credits"] = [{1 : [0]}, {1: [1]}, {4: [2, 3]}, {2 : [3]}]
        idx = len(self.eng_minors_id)
        self.eng_minors_id[idx] = minor_info
        self.eng_minors_name[minor_info["Name"]] = minor_info

        # Sustainable Energy
        minor_info = {}
        minor_info["Name"] = "Sustainable Energy"
        minor_info["Requirements"] = [["CIV300H1"]]
        minor_info["Requirements"].append(["APS305H1", "ENV350H1"])
        minor_info["Requirements"].append(["CME259H1", "APS301H1", "CHE260H1", "CHE323H1", "CHE460H1", "CHE467H1", "CIV440H1", "CIV375H1", "ECE313H1", "ECE314H1", "ECE349H1", "FOR310H1", "GGR347H1", "GGR348H1", "MIE311H1", "MIE313H1"])
        minor_info["Requirements"].append(["AER507H1", "APS510H1", "APS530H1", "CHE451H1", "CHE469H1", "CHE566H1", "CHE568H1", "CIV531H1", "CIV576H1", "CIV577H1", "ECE463H1", "ECE520H:", "ECE526H1", "FOR425H1", "MIE407H1", "MIE408H1", "MIE507H1", "MIE515H1", "MIE516H1", "MIE517H1", "MSE458H1"])
        minor_info["Requirement Credits"] = [{1 : [0]}, {1: [1]}, {4: [2, 3]}, {2 : [3]}]
        idx = len(self.eng_minors_id)
        self.eng_minors_id[idx] = minor_info
        self.eng_minors_name[minor_info["Name"]] = minor_info

        # Engineering Business
        minor_info = {}
        minor_info["Name"] = "Engineering Business"
        minor_info["Requirements"] = [["CHE249H1", "CHE374H1", "CME368H1", "ECE472H1", "MIE258H1", "MIE358H1"]]
        minor_info["Requirements"].append(["JRE300H1"])
        minor_info["Requirements"].append(["JRE410H1"])
        minor_info["Requirements"].append(["JRE420H1"])
        minor_info["Requirements"].append(["TEP234H1", "TEP343H1", "TEP432H1", "TEP442H1", "TEP444H1", "TEP445H1", "APS500H1", "APS502H1", "APS510H1", "APS511H1", "APS420H1", "CHE488H1", "CIV488H1", "ECE488H1", "MIE488H1", "MSE488H1", "MIE354H1", "MIE540H1", "ECO101H1", "ECO102H1", "FOR308H1", "GGR251H1", "GGR252H1", "HPS283H1", "PHL295H1"])
        minor_info["Requirement Credits"] = [{1 : [0]}, {1: [1]}, {1: [2]}, {1: [3]}, {2: [4]}]
        idx = len(self.eng_minors_id)
        self.eng_minors_id[idx] = minor_info
        self.eng_minors_name[minor_info["Name"]] = minor_info

        # Robotics and Mechatronics
        minor_info = {}
        minor_info["Name"] = "Robotics and Mechatronics"
        minor_info["Requirements"] = [["CHE322H1", "ECE311H1", "ECE356H1", "MIE404H1", "AER372H1", "BME344H1"]]
        minor_info["Requirements"].append(["AER525H1", "ECE470H1", "MIE422H1", "MIE443H1", "MIE444H1"])
        minor_info["Requirements"].append(["AER301H1", "APS360H1", "ECE316H1", "ECE334H1", "ECE345H1", "ECE353H1", "ECE358H1", "ECE363H1", "MIE301H1", "BME331H1", "BME350H1", "MIE243H1", "MIE346H1", "ROB310H1", "ROB311H1", "ROB313H1"])
        minor_info["Requirements"].append(["AER407H1", "BME445H1", "CHE507H1", "CSC384H1", "CSC311H1", "CSC428H1", "ECE410H1", "ECE411H1", "ECE421H1", "ECE431H1", "ECE516H1", "ECE532H1", "ECE557H1", "MAT363H1", "MIE438H1", "MIE442H1", "MIE443H1", "MIE444H1", "MIE505H1", "MIE506H1", "ROB521H1"])
        minor_info["Requirement Credits"] = [{1 : [0]}, {1: [1]}, {4: [2, 3]}, {2: [3]}]
        idx = len(self.eng_minors_id)
        self.eng_minors_id[idx] = minor_info
        self.eng_minors_name[minor_info["Name"]] = minor_info

        # Biomedical Engineering
        minor_info = {}
        minor_info["Name"] = "Biomedical Engineering"
        minor_info["Requirements"] = [["CHE353H1"]]
        minor_info["Requirements"].append(["BME331H1"])
        minor_info["Requirements"].append(["BME440H1"])
        minor_info["Requirements"].append(["MIE439H1", "BME530H1", "BME430H1"])
        minor_info["Requirements"].append(["BME498Y1"])
        minor_info["Requirement Credits"] = [{1 : [0]}, {1: [1]}, {1: [2]}, {1: [3]}, {1: [4]}]
        idx = len(self.eng_minors_id)
        self.eng_minors_id[idx] = minor_info
        self.eng_minors_name[minor_info["Name"]] = minor_info

        # Nanoengineering
        minor_info = {}
        minor_info["Name"] = "Nanoengineering"
        minor_info["Requirements"] = [["MSE219H1"]]
        minor_info["Requirements"].append(["APS490Y1"])
        minor_info["Requirements"].append(["BME346H1", "ECE330H1", "ECE335H1", "ECE350H1", "PHY358H1"])
        minor_info["Requirements"].append(["BME440H1", "CHE475H1", "CHE562H1", "CHM325H1", "CHM328H1", "CHM338H1", "ECE427H1", "FOR424H1", "MSE430H1", "MSE443H1", "MSE438H1", "MSE459H1", "MSE462H1", "MSE451H1", "MSE458H1", "MIE506H1", "MIE517H1", "PHY427H1", "PHY450H1", "PHY452H1", "PHY456H1", "PHY485H1", "PHY487H1"])
        minor_info["Requirement Credits"] = [{1 : [0]}, {1: [1]}, {0: [2]}, {4: [2, 3]}, {2: [3]}]
        idx = len(self.eng_minors_id)
        self.eng_minors_id[idx] = minor_info
        self.eng_minors_name[minor_info["Name"]] = minor_info

        # Engineering Music Performance
        minor_info = {}
        minor_info["Name"] = "Engineering Music Performance"
        minor_info["Requirements"] = [["PMU299Y1"]]
        minor_info["Requirements"].append(["TMU130H1"])
        minor_info["Requirements"].append(["ECE446H1"])
        minor_info["Requirements"].append(["TMU111H1", "TMU319H1", "TMU320H1", "TMU313H1", "TMU330H1", "TMU406H1"])
        minor_info["Requirements"].append(["HMU111H1", "TMU131H1", "MUS110H1", "MUS111H1", "MUS200H1", "MUS202H1", "MUS204H1", "MUS209H1", "MUS211H1", "MUS212H1", "MUS215H1", "MUS240H1", "MUS302H1", "MUS305H1", "MUS306H1", "MUS308H1", "MUS321H1", "MUS335H1"])
        minor_info["Requirement Credits"] = [{1 : [0]}, {1: [1]}, {1: [2]}, {1: [3]}, {2: [3, 4]}]
        idx = len(self.eng_minors_id)
        self.eng_minors_id[idx] = minor_info
        self.eng_minors_name[minor_info["Name"]] = minor_info

        self.eng_minors_id = jsonify_dict(self.eng_minors_id)
        self.eng_minors_name = jsonify_dict(self.eng_minors_name)
        return

    def get_majors_id(self):
        """
        Return dictionary of majors
        key: major name
        value: list of course ids
        """
        return self.major_id

    def get_majors_code(self):
        """
        Return dictionary of majors
        key: major name
        value: list of course codes
        """
        return self.major_code

    def get_minors_id(self):
        """
        Return dictionary of minors
        key: minor name
        value: list of course ids
        """
        return self.minor_id

    def get_minors_code(self):
        """
        Return dictionary of minors
        key: minor name
        value: list of course codes
        """
        return self.minor_code

    def get_eng_minors_id(self):
        """
        Return dictionary of engineering minors
        key: engineering minor index
        value: minor_info dictionary:
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
        """
        return self.eng_minors_id

    def get_eng_minors_name(self):
        """
        Return dictionary of engineering minors
        key: engineering minor name
        value: minor_info dictionary:
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
        """
        return self.eng_minors_name

    def get_major_info_course_id(self, major_id):
        """
        Given major id, if it is a valid major, return major list of courses
        as course ids
        Return dictionary of {major : [list of courses]}
        """
        if str(major_id) not in self.major_id.keys():
            return {}
        return {major_id : self.major_id[str(major_id)]}

    def get_major_info_course_name(self, major_name):
        """
        Given major name, if it is a valid major, return major list of courses
        as course names
        Return dictionary of {major : [list of courses]}
        """
        if major_name not in self.major_code.keys():
            return {}
        return {major_name : self.major_code[major_name]}

    def get_minor_info_course_id(self, minor_id):
        """
        Given minor id, if it is a valid minor, return minor list of courses
        as course ids
        Checks against minor dictionary
        Return dictionary of {minor : [list of courses]}
        """
        if minor_id not in self.minor_id.keys():
            return {}
        return {minor_id : self.minor_id[minor_id]}

    def get_minor_info_course_name(self, minor_name):
        """
        Given minor name, if it is a valid minor, return minor list of courses
        as course names
        Checks against minor dictionary
        Return dictionary of {minor : [list of courses]}
        """
        if minor_name not in self.minor_code.keys():
            return {}
        return {minor_name : self.minor_code[minor_name]}

    def get_eng_minor_info_from_id(self, eng_minor_id):
        """
        Given engineering minor id, if it is a valid minor id,
        return minor list of courses
        Checks against minor dictionary

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
        """
        if eng_minor_id not in self.eng_minors_id.keys():
            return {}
        return self.eng_minors_id[eng_minor_id]

    def get_eng_minor_info_from_name(self, eng_minor_name):
        """
        Given engineering minor name, if it is a valid minor,
        return minor list of courses
        Checks against minor dictionary

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
        """
        if eng_minor_name not in self.eng_minors_name.keys():
            return {}
        return self.eng_minors_name[eng_minor_name]
    
    def get_recommended_courses(self, major_name, minor_name, courses_taken):
        """
        Input:
        major : major_name
        minor : minor_name
        courses_taken : [list, of, courses, by, course code]

        Output:
        recommended_courses : [list, of, courses, by, course code]
        """        
        # No suggested courses, return all course codes
        if major_name == None and minor_name == None:
            return {"recommended_courses" : self.course_dir.get_all_courses_code().keys()}

        rec_courses = set()
        # Get courses from major
        if major_name in self.major_code.keys():
            rec_courses.update(self.major_code[major_name])

        # Get courses from minor
        if minor_name in self.minor_code.keys():
            rec_courses.update(self.minor_code[minor_name])
        
        if minor_name in self.eng_minors_name.keys():
            eng_minor_info = self.eng_minors_name[minor_name]
            for group in eng_minor_info["Requirements"]:
                rec_courses.update(group)
        
        # Remove courses that they already took
        for c in courses_taken:
            if c in rec_courses:
                rec_courses.remove(c)

        rec_courses = list(rec_courses)
        rec_courses.sort()
        return {"recommended_courses": rec_courses}
