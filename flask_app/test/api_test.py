import os
import sys
from pathlib import Path
api_path = Path(os.path.dirname(os.path.abspath(__file__)))
api_path = os.path.join(api_path.parent.absolute(), 'src')
sys.path.insert(0, api_path)
import api
import data_utils
import pytest
import json
import random

"""
Test file for api.py classes and functions
"""
default_headers = ['Division', 'Department', 'Campus', 'Course Level', 'Term']
all_headers = ['AIPreReqs', 'APSC Electives', 'Arts and Science Breadth', 'Arts and Science Distribution', 'Average Grade', 'Average Percent', 'Campus', 'Corequisite', 'Course', 'Course Description', 'Course Level', 'Department', 'Division', 'Exclusion', 'FASEAvailable', 'Later term course details', 'MajorsOutcomes', 'MaybeRestricted', 'MinorsOutcomes', 'Name', 'Pre-requisites', 'Recommended Preparation', 'Term', 'UTM Distribution', 'UTSC Breadth']

@pytest.fixture(scope="session")
def app():
    app = api.create_app()
    return app

# Written by Chen Yan Wang
def test_supported_search_headers(client):
    """Retrieve supported search headers"""
    rv = client.get(
        "/api/supported_search_headers",
        follow_redirects=True,
    )
    data = json.loads(rv.data)
    for i in default_headers:
        assert i in data.keys()

# Written by Chen Yan Wang
def test_all_courses_indexed_by_id(client):
    """Check that courses have been loaded and can be indexed by id"""
    rv = client.get("/api/all_courses_id", follow_redirects=True)
    data = json.loads(rv.data)
    # Assume that there is more than 1 course
    assert len(data) > 1
    
    idx = random.randrange(0, len(data) - 1)
    
    # Check that all headers exist
    for i in all_headers:
        assert i in data[str(idx)].keys()


# Written by Chen Yan Wang
def test_all_courses_indexed_by_code(client):
    """Check that courses have been loaded and can be indexed by code"""
    rv = client.get("/api/all_courses_code", follow_redirects=True)
    data = json.loads(rv.data)
    # Assume that there is more than 1 course
    assert len(data) > 1
    
    code = "ECE444H1"
    
    # Check that all headers exist
    for i in all_headers:
        assert i in data[code].keys()

# Written by Chen Yan Wang
def test_course_by_id(client):
    """ Check that can retrieve course info from course id"""
    #/api/course_id/<code>
    course_id = "2475"
    get_str = "/api/course_id/" + course_id
    rv = client.get(get_str, follow_redirects=True)
    data = json.loads(rv.data)

    # Check that all headers exist
    for i in all_headers:
        assert i in data.keys()

# Written by Chen Yan Wang
def test_course_by_code(client):
    """ Check that can retrieve course info from course code"""
    #/api/course/<code>
    course_code = "ECE444H1"
    get_str = "/api/course/" + course_code
    rv = client.get(get_str, follow_redirects=True)
    data = json.loads(rv.data)

    # Check that all headers exist
    for i in all_headers:
        assert i in data.keys()
