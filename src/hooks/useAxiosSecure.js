import axios from "axios";
import { useContext, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const axiosSecure = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
})

const useAxiosSecure = () => {
    const {logOut} = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        // 1. intercept request(client ---> server)
        axiosSecure.interceptors.request.use(config => {
            const token = `Bearer ${localStorage.getItem('access-token')}`
            if(token) {
                config.headers.Authorization = token;
            }
            return config;
        })
        
        // 2. intercept response(client <--- server)
        axiosSecure.interceptors.response.use(response => response,
         async error => {
            const status = error.response.status;
            if(error.response && status === 401 || status === 403) {
                await  logOut()
                navigate('/login')
            }
            return Promise.reject(error)
        })

    } ,[logOut, navigate])



    return [axiosSecure]
}

export default useAxiosSecure;