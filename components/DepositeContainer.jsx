import Image from 'next/image'
import { Button } from 'primereact/button'
import React, { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import { collectionServiceObj } from '../services/collectionService'
import { priceBodyTemplate } from './common/Helper'

import { Dialog } from 'primereact/dialog'
import { useGlobalData } from '../contexts/GlobalContext'
import { InputText } from 'primereact/inputtext'
import { notify } from './Notify';

const DepositeContainer = ({requestId}) => {
  const [showSRModal,setShowSRModal]=useState(false)
  const [referenceNo,setReferenceNo]=useState("")
  const [file, setFile] = useState(null)
  const [depositeRequestDetails,setDepositeRequestDetails]=useState()
  const {moneyDepositeUrl,setMoneyDepositeUrl,setGlobalLoader,depositeRequestDataAvailable}=useGlobalData()
  const inputRef=useRef(null)

  const router=useRouter()

  useEffect(()=>{
    getDepositeRequestDetails(requestId)
  },[])

  const updateCollectionRequestDeposited = async() =>{
    setGlobalLoader(true)
    const formData = new FormData();
    formData.append("status", "CDP");
    formData.append("file", file);
    formData.append("ref_no",referenceNo)

    const response= await collectionServiceObj.updateCollectionRequestDeposited(depositeRequestDetails?.request_id, formData, {"Content-Type" : "multipart/form-data"})
    if(response.ok){
      const responseData=response.data
      notify("success",responseData.message)
      router.push("/")
    }
    else{
      const error=response.error
      notify("error",error.error_message)
    }
    setGlobalLoader(false)
  }


  const getDepositeRequestDetails = async(request_id)=>{
    
     const response = await collectionServiceObj.depositeRequestDetails(request_id)

    if(response.ok){
      const responseData=response.data
      setDepositeRequestDetails(responseData)
     
    }
    else{
      const error=response.error
      notify("error",error.error_message)
    }
  
  }


  function handleFileChange(event) {
    setFile(event.target.files[0])
  }

  return (
   
    <div className=' px-4'>
    <div className='flex items-center pt-8 gap-2'>
      <Image 
        src='/Back.svg' 
        alt='Logo' 
        width={26} 
        height={26} 
        onClick={()=> router.push(`/collection/in-hand-collection`)}
        />
      <h1 className='text-[18px] font-semibold text-blue-700'>Deposit</h1>
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
      {depositeRequestDetails?.instrument_mode_tag=="CSH" && <div className='flex flex-col p-2'>
        <p className='text-sm'>IFSC Code</p>
        <p className='text-[16px]'>{depositeRequestDetails?.ifsc}</p>
      </div> }
       
      {depositeRequestDetails?.instrument_mode_tag=="CHQ" && <div className='flex flex-col p-2'>
        <p className='text-sm'>Cheque Number</p>
        <p className='text-[16px]'>{depositeRequestDetails?.instrument_id}</p>
      </div>}
      
      <div className='flex flex-col p-2'>
        <p className='text-sm'>Beneficiary Name</p>
        <p className='text-[16px]'>{depositeRequestDetails?.beneficiary_name}</p>
      </div>

      <div className='flex flex-col p-2'>
        <p className='text-sm'>Reference Number</p>
        <InputText  autoComplete="off" value={referenceNo} maxLength="50" onChange={(e) => setReferenceNo(e.target.value)} />
      </div>

      <div className="form-group flex flex-col p-2">
          <label htmlFor="invoiceNumber" className='text-m text-gray'  >
            Deposit Slip Image
          </label>
          <input id="fileInput" type="file" ref={inputRef}
          onChange={handleFileChange}/>
      </div>
     
    </div>
    <div className='text-center  bottom-0 left-0 right-0 mx-auto'>
      <Button 
        style={{width:"95%",maxWidth:"500px"}}
        disabled={!referenceNo || !file}
        label='Deposit' 
        
        onClick={updateCollectionRequestDeposited}
        />
    </div>

     
</div>
    
  )
}

export default DepositeContainer