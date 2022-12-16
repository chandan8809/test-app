import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import {priceBodyTemplate} from "../common/Helper"
import { collectionServiceObj } from '../../services/collectionService';
import moment from "moment"
import { useRouter } from 'next/router';
import { useGlobalData } from '../../contexts/GlobalContext';
import { notify } from '../Notify';

const ListInHandCollection = () => {
  const [inHandCollectionList,setInHandCollectionList]=useState([])
  const router = useRouter();
  const {setDepositeRequestDataAvailable,setGlobalLoader}=useGlobalData({})

  useEffect(()=>{
    getInHandCollectionList()
  },[])

  const getInHandCollectionList= async()=>{
    setGlobalLoader(true)
    const response= await collectionServiceObj.getCollectionListingInHand()
   
    if(response.ok){
      const responseData=response.data
      setInHandCollectionList(responseData)
    }
    else{
      const error=response.error
      notify("error",error.error_message)
    }
    setGlobalLoader(false)
 
  }

  const getDepositeRequestDetails = async(request_id)=>{
    setGlobalLoader(true)
     const response = await collectionServiceObj.depositeRequestDetails(request_id)

    if(response.ok){
      const responseData=response.data
      setDepositeRequestDataAvailable(responseData)
      gotoDepositePage(request_id)
    }
    else{
      const error=response.error
      notify("error",error.error_message)
    }
    setGlobalLoader(false)
  }

  const gotoDepositePage=(requestId)=>{
    router.push(`/deposite/${requestId}`)
  }

  const gotoMainPage=()=>{
    router.push("/collection")
  }


  return (
      <div className=' px-4'>
         <div className='flex items-center pt-8 gap-2'>
            <Image 
              src='/Back.svg' 
              alt='Tez POS Logo' 
              width={26} 
              height={26} 
              onClick={gotoMainPage}
              />
            <h1 className='text-[18px] font-semibold text-blue-700'>In Hand Collections</h1>
          </div>
          
          <div className='flex flex-col  justify-around pt-8 text-gray-700 '>

            {inHandCollectionList.map((item,index)=>(

             <div key={index} 
               className='flex-1 rounded-xl flex p-2 bg-gray-100 shadow-md justify-between mt-3 active:bg-gray-200 cursor-pointer'
               onClick={()=>getDepositeRequestDetails(item.id)}
               >
               <div className='flex flex-col flex-[60%]'>
                  <p className='text-[18px] font-bold'>{priceBodyTemplate(item?.collected_amount)}</p>
                  <p className='text-[16px]  font-semibold  mt-0.5'>{item?.instrument_mode}</p>
                  <p className=' mt-0.5 text-xs'>store : {item?.source_name}</p>
                  {item.completed_at!==null && <p className=' mt-0.5 text-xs'>Pickup Date : {moment(item.completed_at).utc().format('Do MMM, YYYY')}</p>}
               </div>

               <div className='flex flex-col felx-[40%] justify-between'>
                  <p className='text-[18px]   text-red-500 text-right'>In Hand</p>
                  
                  <p className='text-blue-600 mt-0.5 font-semibold text-[18px]'>Deposit Now</p>
               </div>
             </div>

            ))}
           
          </div>
      </div>
    )
}

export default ListInHandCollection