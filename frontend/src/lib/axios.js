import axios from 'axios';

const axiosInstance=axios.create({
    baseURL:`${process.env.SERVER_URL}/api`,
    withCredentials:true
})
export default axiosInstance;