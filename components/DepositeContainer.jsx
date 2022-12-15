import Image from 'next/image'
import { Button } from 'primereact/button'
import { InputNumber } from 'primereact/inputnumber'
import React, { useState } from 'react'
import moment from "moment"
import { useRouter } from 'next/router';
import { useGlobalData } from '../contexts/GlobalContext';
import { collectionServiceObj } from '../services/collectionService'
import { priceBodyTemplate } from './common/Helper'

const DepositeContainer = () => {
  const [referenceNo,setReferenceNo]=useState(null)
  const router=useRouter()
  //const {depositeRequestDetails}=useGlobalData()
  const depositeRequestDetails= {
    store_name: "ASM Adalhatu Morabadi",
    store_id: 4,
    request_id: 1,
    instrument_mode_tag: "CHQ",
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

  console.log("del",depositeRequestDetails)
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

  const updateCollectionRequestDeposited = async() =>{
    const formData = new FormData();
    formData.append("status", "CDP");
    formData.append("file", "fileData");

    if(SRDetails.instrument_mode_tag === "CHQ"){
      formData.append("ref_no", "123455");
     
    }
    const response= await collectionServiceObj.updateCollectionRequestDeposited(SRDetails?.request_id, formData, {"Content-Type" : "multipart/form-data"})
  }

  return (
    <div className=' px-4'>
    <div className='flex items-center pt-8 gap-2'>
      <Image 
        src='/Back.svg' 
        alt='Tez POS Logo' 
        width={26} 
        height={26} 
        onClick={()=> router.push(`/collection/in-hand-collection`)}
        />
      <h1 className='text-[18px] font-semibold text-blue-700'>Deposite</h1>
    </div>

    <div className='flex flex-col  justify-around pt-8 text-gray-900 gap-2 '>
     
      <div className='flex'>
        <div className='flex flex-col p-2 flex-1'>
          <p className='text-sm '>Amount</p>
          <p className='text-2xl font-bold'>{priceBodyTemplate(depositeRequestDetails?.collected_amount)}</p>
        </div>

        <div className='flex flex-col p-2 flex-1'>
          <p className='text-sm '>Mode</p>
          <p className='text-2xl font-bold'>{depositeRequestDetails?.instrument_mode}</p>
        </div>
      </div>
     
      <div className='flex flex-col p-2'>
        <p className='text-sm'>Store</p>
        <p className='text-[16px]'>{depositeRequestDetails?.store_name}</p>
      </div>
      
      <div className='flex flex-col p-2'>
        <p className='text-sm'>Account Number</p>
        <p className='text-[16px]'>{depositeRequestDetails?.account_number}</p>
      </div>
      {depositeRequestDetails.instrument_mode_tag=="CSH" && <div className='flex flex-col p-2'>
        <p className='text-sm'>IFSC Code</p>
        <p className='text-[16px]'>{depositeRequestDetails?.ifsc}</p>
      </div> }
       
      {depositeRequestDetails.instrument_mode_tag=="CHQ" && <div className='flex flex-col p-2'>
        <p className='text-sm'>Cheque Number</p>
        {/* <p className='text-[16px]'>{depositeRequestDetails?.cheque_number}</p> */}
        <p className='text-[16px]'>Dummy</p>
      </div> }
      
      <div className='flex flex-col p-2'>
        <p className='text-sm'>Beneficiary Name</p>
        <p className='text-[16px]'>{depositeRequestDetails?.beneficiary_name}</p>
      </div>

      {depositeRequestDetails.instrument_mode_tag=="CHQ" && <div className='flex flex-col p-2'>
        <p className='text-sm'>Reference Number</p>
        <InputNumber 
            value={referenceNo} 
            onChange={(e) => setReferenceNo(e.value)}   
            useGrouping={false}
            />
      </div>}

      <div className='flex flex-col p-2'>
        <p className='text-sm'>Deposite Slip Image</p>
        <div className='flex items-center gap-2'>
        <Image 
          src='/openCamera.svg' 
          alt='Tez POS Logo' 
          width={34} 
          height={34} 
          onClick={()=> router.push(`/collection/in-hand-collection`)}
          />
        <h1 className='text-sm text-blue-700'>Upload File or Open Camera</h1>
      </div>
      </div>
     
    </div>
    <div className='text-center  bottom-0 left-0 right-0 mx-auto'>
      <Button 
        disabled={!referenceNo}
        label='Deposite' 
        className='p-button-info'
        onClick={updateCollectionRequestDeposited}
        />
    </div>
    
</div>
    
  )
}

export default DepositeContainer