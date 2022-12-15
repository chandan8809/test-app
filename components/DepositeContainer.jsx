import Image from 'next/image'
import { Button } from 'primereact/button'
import { InputNumber } from 'primereact/inputnumber'
import React, { useState } from 'react'
import moment from "moment"
import { useRouter } from 'next/router';
import { collectionServiceObj } from '../services/collectionService'
import { priceBodyTemplate } from './common/Helper'
import Camera from './camera'
import { Dialog } from 'primereact/dialog'
import { useGlobalData } from '../contexts/GlobalContext'

const DepositeContainer = () => {
  const [showSRModal,setShowSRModal]=useState(false)
  const [referenceNo,setReferenceNo]=useState(null)
  const {moneyDepositeUrl,setMoneyDepositeUrl}=useGlobalData()

  console.log("delo",moneyDepositeUrl)

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


  const updateCollectionRequestDeposited = async() =>{
    const formData = new FormData();
    formData.append("status", "CDP");
    formData.append("file", moneyDepositeUrl);
    formData.append("ref_no",referenceNo)

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

      <div className='flex flex-col p-2'>
        <p className='text-sm'>Reference Number</p>
        <InputNumber 
            value={referenceNo} 
            onChange={(e) => setReferenceNo(e.value)}   
            useGrouping={false}
            />
      </div>

      <div className='flex flex-col p-2'>
        <p className='text-sm'>Deposite Slip Image</p>
        <div 
          className='flex items-center gap-2'
          
          >
          <Image 
            src='/openCamera.svg' 
            alt='Tez POS Logo' 
            width={34} 
            height={34}
            
            />
            
          <h1 
            onClick={() => setShowSRModal(true)} 
            className='text-sm text-blue-700'>{moneyDepositeUrl ? "Dummy Image name" : "Upload File or Open Camera"}
          </h1>

          {moneyDepositeUrl && <Button 
            onClick={() => {
              setMoneyDepositeUrl(null)
              }} 
            icon="pi pi-times" 
            className="p-button-rounded p-button-danger p-button-text" 
            aria-label="Cancel"
          />}
            
        </div>
      </div>
     
    </div>
    <div className='text-center  bottom-0 left-0 right-0 mx-auto'>
      <Button 
        disabled={!referenceNo || !moneyDepositeUrl}
        label='Deposite' 
        className='p-button-info'
        onClick={updateCollectionRequestDeposited}
        />
    </div>

      <div className='bottom-8 absolute left-0 right-0 mx-auto'>
        <Dialog 
          header="Click Picture" 
          visible={showSRModal} 
          onHide={() => {
            setShowSRModal(false)
            setMoneyDepositeUrl(null)
          }} 
          breakpoints={{'960px': '75vw'}} 
          style={{width: '90vw',minHeight:"400px"}}
          position={'top'}
          >
          <div className='mx-auto text-center mt-6'>
            <Camera/>
         </div>
         <div className='text-center pt-8'>
         {moneyDepositeUrl && <Button onClick={() => setShowSRModal(false)} label='Done' className=' p-button-success'/>}
         </div>
         
        </Dialog>
        {/* <Button className='p-button-info' label='Enter SR Number'/> */}
      </div>
</div>
    
  )
}

export default DepositeContainer