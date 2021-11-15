# Flask App Setup

This section will describe how to setup the flask app.
Initial course information data obtained from https://github.com/nelaturuk/education_pathways.

## Setup - Unix
### TODO: implement unix setup

## Setup - Windows
To run this repo, need to install python 3.8 and add it to your path.  

Create the virtual environment and activate:   
virtualenv venv  
.\venv\Scripts\activate  

Go to flask app root
cd <FLASK_APP_ROOT>  

Install flask and dependencies for repo:  
py -3.8 -m pip install -r .\requirements.txt  

To update requirements.txt:
pip3 freeze > requirements.txt 

If any messages appear saying "WARNING: The script flask.exe is installed in '<location>' which is not on PATH.
  Consider adding this directory to PATH or, if you prefer to suppress this warning, use --no-warn-script-location.", add the location to your path.  

Run the app:  
py -3.8 src/api.py

## Testing

Testing can be done via postman after running the app,
or can run automated tests as specified:

For example, postman:
127.0.0.1:5000/api/supported_search_headers

For testing the app, run the following:
py -3.8 -m pytest

To test with prints:
py -3.8 -m  pytest -s

## .env file
The environment variables used to connect to the mongo container should NOT be shared publicly, as they
contain passwords. The .env file shall be shared internally and not committed to GitHub.

