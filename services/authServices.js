import { apiGetCall, apiPostCall, apiPutCall, apiPatchCall, apiDeleteCall } from '../config/apiConfig';
import { LOGIN_URL } from '../config/urlConfig'


class AuthService {
    constructor (apiGetCall, apiPostCall, apiPutCall, apiPatchCall, apiDeleteCall){
        this.apiGetCall=apiGetCall,
        this.apiPostCall=apiPostCall,
        this.apiPutCall=apiPutCall,
        this.apiPatchCall=apiPatchCall,
        this.apiDeleteCall=apiDeleteCall
    } 
    login = async(body)=>{
        const url=LOGIN_URL
        const response = await this.apiPutCall(url,body)
        return response
    }
}

export default AuthService

export const authServiceObj = new AuthService(
    apiGetCall,
    apiPostCall,
    apiPutCall,
    apiPatchCall,
    apiDeleteCall
);