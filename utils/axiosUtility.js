import axios from "axios"
import { logout } from '../contexts/UserContext';
//Utility to initialize axios
export const initializeAxios = () => {
    interceptResponse();
    setDefaultAxiosHeaders();
}

export const setDefaultAxiosHeaders = () => {
    setAxiosDefaultTokenFromLocalStorage();
    axios.defaults.headers.post['Content-Type'] = 'application/json';
}

//Set auth token to axios default header if user present in local storage
export const setAxiosDefaultTokenFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
        const userData = JSON.parse(localStorage.getItem('user')??'{}');
        
        if(userData?.token){
            setCommonAuthorizationToken(userData?.token);
        }
    }
}

export const setCommonAuthorizationToken = (token) => {
    axios.defaults.headers.common['Authorization'] = `token ${token}`;
}


//Response interceptor
const interceptResponse = () => {
    axios.interceptors.response.use(
        (response) => {
            return {
                ...response,
                ok: true,
            };
        },
        (error) => {
            if(error?.response?.data){
                const {status} = error.response;
                if (status === 403 || status===401) {
                    logout()
                    return       
                }
                return {
                    ok: false,
                    error: {
                        error_message: error?.response?.data?.error,
                        data: error?.response?.data,
                        status: error?.response?.status,
                        headers: error?.response?.headers,
                    }
                }
            }else if(error?.request){
                return {
                    ok: false,
                    error: {
                        error_message: "Request failed",
                        data: error?.request,
                    }
                }
            }else{
                return {
                    ok: false,
                    error: {
                        error_message: "Unkown error!",
                        data: {error: "Unkown error!"},
                    }
                }
            }
        }
    )
}

