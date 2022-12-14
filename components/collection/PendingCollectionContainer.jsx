import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import {priceBodyTemplate} from "../common/Helper"
import { collectionServiceObj } from '../../services/collectionService';
import moment from "moment"
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';



const PendingCollectionContainer = () => {
  const [inHandCollectionList,setInHandCollectionList]=useState([])
  const router = useRouter();

  useEffect(()=>{
    getInHandCollectionList()
  },[])

 
  const getInHandCollectionList= async()=>{
    // const response= await collectionServiceObj.getCollectionListPending()
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
        id: 1,
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
        id: 1,
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

  return (
      <div className=' px-4'>
          <div className='flex items-center pt-8 gap-2'>
            <Image 
              src='/Back.svg' 
              alt='Tez POS Logo' 
              width={26} 
              height={26} 
              onClick={()=> router.push(`/collection`)}
              />
            <h1 className='text-[18px] font-semibold text-blue-700'>Pending Requests</h1>
          </div>

          <div className='flex flex-col  justify-around pt-8 text-gray-700 '>

            {inHandCollectionList.map((item,index)=>(

             <div key={index} className='flex-1 rounded-xl flex p-2 bg-gray-100 shadow-md justify-between mt-3'>
               <div className='flex flex-col flex-[60%]'>
                  <p className='text-[18px] font-bold'>{priceBodyTemplate(item?.collected_amount)}</p>
                  <p className='text-[16px]  font-semibold  mt-0.5'>{item?.instrument_mode}</p>
                  <p className=' mt-0.5 text-xs'>store : {item?.source_name}</p>
                  {item.completed_at!==null && <p className=' mt-0.5 text-xs'>Pickup Date : {moment(item.completed_at).utc().format('YYYY-MM-DD')}</p>}
               </div>
             </div>

            ))}
           
          </div>
      </div>
    )
}

export default PendingCollectionContainer