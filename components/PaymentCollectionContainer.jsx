import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useGlobalData } from '../contexts/GlobalContext';
import moment from "moment"
import { InputNumber } from 'primereact/inputnumber';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { collectionServiceObj } from '../services/collectionService';

const PaymentCollectionContainer = () => {
  const [counter, setCounter] = useState(0);
  const [startTimer,setStartTimer]=useState(false)
  const [collectedAmount,setCollectedAmount]=useState(null)
  const router=useRouter()

  useEffect(() => {
    if(startTimer)
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    if(counter===0){
      setStartTimer(false)
    }
  }, [counter,startTimer]);

  //const {SRDetails}=useGlobalData()
  const SRDetails={
    store_name: "ASM Adalhatu Morabadi",
    store_id: 4,
    request_id: 1,
    instrument_mode_tag: "CSH",
    instrument_mode: "Cash",
    request_date: "2022-12-13T14:33:52Z",
    status_tag: "CRQ",
    status: "Collection requested"
  }
  console.log("srDt",SRDetails)

  const updateCollectionRequestUpdate = async() =>{
    const formData = new FormData();
    formData.append("status", "CBP");
    formData.append("collected_amount", collectedAmount);

    if(SRDetails.instrument_mode_tag === "CHQ"){
      formData.append("status", "CBP");
      formData.append("collected_amount", collectedAmount);
    }
    const response= await collectionServiceObj.updateCollectionRequestPicked(SRDetails?.request_id, formData, {"Content-Type" : "multipart/form-data"})
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

    <div className='flex flex-col  justify-around pt-8 text-gray-600 '>

      <div className='flex flex-col p-2 '>
        <p className='text-sm '>Store</p>
        <p className='text-[18px]'>{SRDetails?.store_name}</p>
      </div>
     

      {SRDetails.instrument_mode_tag ==="CHQ" &&<div className='flex flex-col p-2'>
        <p className='text-sm'>Beneficiary Name</p>
        <p className='text-[18px]'>Fleet Labs Technologies Private Limited</p>
      </div>}

      {SRDetails.instrument_mode_tag ==="CHQ" &&
      <div className='flex'>
        <div className='flex flex-col p-2 flex-1'>
          <p className='text-sm'>Mode</p>
          <p className='text-[18px]'>{SRDetails?.instrument_mode}</p>
        </div>
        <div className='flex flex-col p-2 flex-1'>
          <p className='text-sm'>Cheque Number</p>
          <p className='text-[18px]'>88096615430</p>
        </div>
      </div>}

      <div className='flex flex-col p-2'>
        <p className='text-sm'>Mode</p>
        <p className='text-[18px]'>{SRDetails?.instrument_mode}</p>
      </div>
      
      <div className='flex flex-col p-2'>
        <p className='text-sm'>Request Date</p>
        <p className='text-[18px]'>{moment(SRDetails?.request_date).utc().format('YYYY-MM-DD')}</p>
      </div>
      <div className='flex flex-col p-2'>
        <p className='text-[16px] text-gray-900 mb-2'>Cash Pickup Amount</p>
      
          <InputNumber 
            inputId="locale-indian" 
            value={collectedAmount} 
            onChange={(e) => setCollectedAmount(e.value)} 
            mode="decimal" 
            locale="en-IN" 
            maxFractionDigits={2}
            className="p-inputtext-lg block"
            />
        
      </div>
      
    </div>

    <div className='text-center absolute bottom-8 left-0 right-0 mx-auto'>
      {counter !==0 && <p className='pb-4 text-red-600'>Retry sending OTP in {counter}</p>}
      <Button 
        disabled={startTimer || collectedAmount==null}
        label='Pickup and Get OTP' 
        className='p-button-info'
        onClick={()=>{
          setStartTimer(true)
          setCounter(10)
          updateCollectionRequestUpdate()
        }}
        />
    </div>
    
</div>
    
  )
}

export default PaymentCollectionContainer