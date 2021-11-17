import axios from 'axios';

const COURSEPLANNER_API_BASE_URL = "http://localhost:5000/api/courseplanner";
const SAVEPLANNER_API_BASE_URL = "http://localhost:5000/api/saveplanner";

class CoursePlannerService {

    createCoursePlanner(user){
        return axios.post(COURSEPLANNER_API_BASE_URL, user);
    }

    getCoursePlannerByID(email){
        return axios.post(COURSEPLANNER_API_BASE_URL, email);
    }

    updateCoursePlanner(email){
        return axios.put(COURSEPLANNER_API_BASE_URL, email);
    }

    deleteCoursePlanner(email){
        return axios.delete(COURSEPLANNER_API_BASE_URL, email);
    }

    saveCoursePlanner(email){
        return axios.post(SAVEPLANNER_API_BASE_URL, email);
    }
}

export default new CoursePlannerService()