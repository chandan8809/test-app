import axios from 'axios';

/**
 * 
 * @param {String} url 
 * @param {Object} queryParams 
 * @param {Object} headers 
 * @returns {Object}
 */
export const apiGetCall = async (url, queryParams = {}, headers = {}) => {
    try{
        const response = await axios.get(url, {
            params: queryParams,
            headers: headers,
        });
        return response;
    }catch(err){
        return err;
    }
}

export const apiPostCall = async (url, body={}, queryParams = {}, headers = {}) => {
    try{
        const response = await axios.post(url, body, {
            params: queryParams,
            headers: headers,
        });
        return response;
    }catch(err){
        return err;
    }
}

export const apiPutCall = async (url, body={}, queryParams = {}, headers = {}) => {
    try{
        const response = await axios.put(url, body, {
            params: queryParams,
            headers: headers,
        });
        return response;
    }catch(err){
        return err;
    }
}

export const apiPatchCall = async (url, body={}, queryParams = {}, headers = {}) => {
    try{
        const response = await axios.patch(url, body, {
            params: queryParams,
            headers: headers,
        });
        return response;
    }catch(err){
        return err;
    }
}

export const apiDeleteCall = async (url, queryParams = {}, headers = {}) => {
    try{
        const response = await axios.delete(url, {
            params: queryParams,
            headers: headers,
        });
        return response;
    }catch(err){
        return err;
    }
}