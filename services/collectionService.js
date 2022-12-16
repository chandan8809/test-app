import { apiGetCall, apiPostCall, apiPutCall, apiPatchCall, apiDeleteCall } from '../config/apiConfig';
import { GET_COLLECTION_SUMARY,
         GET_COLLECTION_LISTING,
         GET_SR_DETAILS,
         UPDATE_COLLECTION_STATUS,
         DEPOSITE_REQUSET_DETAILS,
         RESEND_OTP
    } from '../config/urlConfig'


class CollectionService {
    constructor (apiGetCall, apiPostCall, apiPutCall, apiPatchCall, apiDeleteCall){
        this.apiGetCall=apiGetCall,
        this.apiPostCall=apiPostCall,
        this.apiPutCall=apiPutCall,
        this.apiPatchCall=apiPatchCall,
        this.apiDeleteCall=apiDeleteCall
    } 
    
    getCollectionSummary = async()=>{
        const url=GET_COLLECTION_SUMARY
        const response = await this.apiGetCall(url,{source:"store"})
        return response
    }

    getCollectionListingInHand = async()=>{
        const url=GET_COLLECTION_LISTING
        const response = await this.apiGetCall(url,{source: "store",status:"in_hand"})
        return response
    }

    
    getCollectionListPending = async()=>{
        const url=GET_COLLECTION_LISTING
        const response = await this.apiGetCall(url,{source: "store",status:"pending"})
        return response
    }

    getDepositedList = async()=>{
        const url=GET_COLLECTION_LISTING
        const response = await this.apiGetCall(url,{source: "store",status:"deposited"})
        return response
    }

    getSRDetails = async(SRNumber)=>{
        const url = GET_SR_DETAILS
        const response = await this.apiGetCall(url,{sr_number:SRNumber})
        return response
    }

    updateCollectionRequestPicked = async(requestId,payload,header)=>{
        const url = `${UPDATE_COLLECTION_STATUS}${requestId}/`
        const response = await this.apiPutCall(url,payload,{},header)
        return response
    }

    updateCollectionRequestDeposited= async(requestId,payload,header)=>{
        const url = `${UPDATE_COLLECTION_STATUS}${requestId}/`
        const response = await this.apiPutCall(url,payload,{},header)
        return response
    }

    depositeRequestDetails= async(requestId)=>{
        const url = `${DEPOSITE_REQUSET_DETAILS}${requestId}/`
        const response = await this.apiGetCall(url)
        return response
    }

    resendOTP= async(requestId)=>{
        const url = `${RESEND_OTP}${requestId}/`
        const response = await this.apiGetCall(url)
        return response
    }
}

export default CollectionService

export const collectionServiceObj = new CollectionService(
    apiGetCall,
    apiPostCall,
    apiPutCall,
    apiPatchCall,
    apiDeleteCall
);