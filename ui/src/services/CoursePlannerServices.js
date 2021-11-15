import axios from 'axios';

const COURSEPLANNER_API_BASE_URL = "http://localhost:5000/api/courseplanner";
const API_BASE_URL = "http://localhost:5000/api";

class CoursePlannerService {

    createCoursePlanner(user){
        return axios.post(COURSEPLANNER_API_BASE_URL, user);
    }

    getCoursePlannerByID(userId){
        return axios.get(COURSEPLANNER_API_BASE_URL + '/' + userId);
    }

    updateCoursePlanner(user, userId){
        return axios.put(COURSEPLANNER_API_BASE_URL + '/' + userId, user);
    }

    deleteCoursePlanner(userId){
        return axios.delete(COURSEPLANNER_API_BASE_URL + '/' + userId);
    }

    authenticateUser(payload){
        return axios.post(API_BASE_URL + '/authenticate', payload)
    }
}

export default new CoursePlannerService()