import axios from 'axios';

const API_BASE_URL = "http://localhost:5000/api";

class CourseService {

    getCoursesForMajor(majorName){
        return axios.get(API_BASE_URL + '/major/' + majorName);
    }

    getRequirementsForMinor(minorName){
        return axios.get(API_BASE_URL + '/eng_minor/'+ minorName)
    }
}

export default new CourseService()