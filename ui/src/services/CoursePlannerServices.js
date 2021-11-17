import axios from 'axios';

const COURSEPLANNER_API_BASE_URL = "http://localhost:5000/api/courseplanner";
const API_BASE_URL = "http://localhost:5000/api";

class CoursePlannerService {

    createCoursePlanner(user){
        return axios.post(COURSEPLANNER_API_BASE_URL, user);
    }

    getCoursePlannerByID(email){
        return axios.get(COURSEPLANNER_API_BASE_URL, email);
    }

    updateCoursePlanner(user, email){
        return axios.put(COURSEPLANNER_API_BASE_URL + '/' + email, user);
    }

    deleteCoursePlanner(email){
        return axios.delete(COURSEPLANNER_API_BASE_URL + '/' + email);
    }
}

export default new CoursePlannerService()