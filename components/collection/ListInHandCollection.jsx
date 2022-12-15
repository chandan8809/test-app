import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import {priceBodyTemplate} from "../common/Helper"
import { collectionServiceObj } from '../../services/collectionService';
import moment from "moment"
import { useRouter } from 'next/router';
import { useGlobalData } from '../../contexts/GlobalContext';

const ListInHandCollection = () => {
  const [inHandCollectionList,setInHandCollectionList]=useState([])
  const router = useRouter();
  const {setDepositeRequestDetails}=useGlobalData()

  useEffect(()=>{
    getInHandCollectionList()
  },[])

  const getInHandCollectionList= async()=>{
    //const response= await collectionServiceObj.getCollectionListingInHand()
    const response=[
      {
        id: 1,
        source_id: 4,
        status: "Collection requested",
        requested_at: "2022-12-13T14:33:52Z",
        completed_at: null,
        instrument_mode: "Cash",
        collected_amount: 100.0,
        status_tag: "CRQ",
        instrument_mode_tag: "CSH",
        source_name: "ASM Adalhatu Morabadi"
      },
      {
        id: 2,
        source_id: 4,
        status: "Collection requested",
        requested_at: "2022-12-13T14:33:52Z",
        completed_at: null,
        instrument_mode: "Cash",
        collected_amount: 2000.0,
        status_tag: "CRQ",
        instrument_mode_tag: "CSH",
        source_name: "ASM Adalhatu Morabadi"
      },
      {
        id: 3,
        source_id: 4,
        status: "Collection requested",
        requested_at: "2022-12-13T14:33:52Z",
        completed_at: "2022-12-13T14:33:52Z",
        instrument_mode: "Cheque",
        collected_amount: 30000.0,
        status_tag: "CRQ",
        instrument_mode_tag: "CSH",
        source_name: "ASM Adalhatu Morabadi ASM Adalhatu Morabadi"
      }
    ]
    setInHandCollectionList(response)
  }

  const getDepositeRequestDetails = async(request_id)=>{
     //const response = await collectionServiceObj.depositeRequestDetails(request_id)
     const response= {
      store_name: "ASM Adalhatu Morabadi",
      store_id: 4,
      request_id: 1,
      instrument_mode_tag: "CSH",
      instrument_id: null,
      beneficiary_name: "Fleet Labs Technologies private limited",
      collected_amount: 1000.0,
      account_number: "635005500202",
      ifsc: "ICIC0006350",
      instrument_mode: "Cash",
      request_date: "2022-12-13T14:33:52Z",
      status_tag: "CBP",
      status: "Collection in progress"
     }
     setDepositeRequestDetails(response)
     gotoDepositePage()

  }

  const gotoDepositePage=()=>{
    router.push("/deposite")
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
               className='flex-1 rounded-xl flex p-2 bg-gray-100 shadow-md justify-between mt-3 active:bg-gray-200'
               onClick={()=>getDepositeRequestDetails(item.id)}
               >
               <div className='flex flex-col flex-[60%]'>
                  <p className='text-[18px] font-bold'>{priceBodyTemplate(item?.collected_amount)}</p>
                  <p className='text-[16px]  font-semibold  mt-0.5'>{item?.instrument_mode}</p>
                  <p className=' mt-0.5 text-xs'>store : {item?.source_name}</p>
                  {item.completed_at!==null && <p className=' mt-0.5 text-xs'>Pickup Date : {moment(item.completed_at).utc().format('YYYY-MM-DD')}</p>}
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