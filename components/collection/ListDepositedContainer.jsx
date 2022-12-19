import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { collectionServiceObj } from '../../services/collectionService';
import moment from "moment"
import { useRouter } from 'next/router';
import { useGlobalData } from '../../contexts/GlobalContext';
import { notify } from '../Notify';
import { Button } from 'primereact/button';


const ListDepositedContainer = () => {
  const [inHandCollectionList,setInHandCollectionList]=useState([])
  const [showEmptyMessage,setShowEmptyMessage]=useState(false)
  const [dataForFilter,setDataForFilter]=useState([])
  const router = useRouter();
  const {setGlobalLoader}=useGlobalData()

  useEffect(()=>{
    getListDeposited()
  },[])

 
  const getListDeposited= async()=>{
    setGlobalLoader(true)
    const response= await collectionServiceObj.getDepositedList()
    if(response.ok){
      const responseData=response.data
      if(responseData.length===0){
        setShowEmptyMessage(true)
      }
      setInHandCollectionList(responseData)
      setDataForFilter(responseData)
    }
    else{
      const error=response.error
      notify("error",error.error_message)
    }
    setGlobalLoader(false)
  }

  const selectCashOrCheque=(data)=>{
    const cashFilter=dataForFilter.filter(item=>item.instrument_mode==data)
    setInHandCollectionList(cashFilter)
  }
 

  return (
      <div className=' px-4'>
          <div className='flex items-center pt-8 gap-2'>
            <Image 
              src='/Back.svg' 
              alt='Logo' 
              width={26} 
              height={26} 
              onClick={()=> router.push(`/collection`)}
              />
            <h1 className='text-[18px] font-semibold text-blue-700'>Deposited</h1>
          </div>

          <div className='flex justify-around pt-10'>
              <Button 
                label='CASH' 
                className='w-[150px] p-button-info p-button-raised p-button-outlined'
                onClick={()=>selectCashOrCheque("Cash")}
                />
              <Button 
                label='CHEQUE' 
                className='w-[150px] p-button-info p-button-raised p-button-outlined'
                onClick={()=>selectCashOrCheque("Cheque")}
                />
          </div>

          <div className='flex flex-col  justify-around pt-8 text-gray-700 '>
            {inHandCollectionList.map((item,index)=>(

             <div key={index} 
               className='flex-1 rounded-xl flex p-2 bg-gray-100 shadow-md justify-between mt-3 cursor-pointer'>
               <div className='flex flex-col flex-[60%]'>
                  <p className='text-[16px]  font-semibold  mt-0.5'>{item?.instrument_mode}</p>
                  <p className=' mt-0.5 text-xs'>store : {item?.source_name}</p>
                  <p className=' mt-0.5 text-xs'>Pickup Date : {moment(item.requested_at).utc().format('Do MMM, YYYY')}</p>
               </div>
             </div>
            ))}
            {showEmptyMessage && <p className='text-base mt-10 text-center text-gray-500'>No Deposited collection</p>}
          </div>
         
      </div>
    )
}

export default ListDepositedContainer