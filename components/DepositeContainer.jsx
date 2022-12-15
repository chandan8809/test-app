import Image from 'next/image'
import { Button } from 'primereact/button'
import { InputNumber } from 'primereact/inputnumber'
import React, { useRef, useState, ChangeEvent } from 'react'
import moment from "moment"
import { useRouter } from 'next/router';
import { collectionServiceObj } from '../services/collectionService'
import { priceBodyTemplate } from './common/Helper'
import Camera from './camera'
import { Dialog } from 'primereact/dialog'
import { useGlobalData } from '../contexts/GlobalContext'
import { InputText } from 'primereact/inputtext'

const DepositeContainer = () => {
  const [showSRModal,setShowSRModal]=useState(false)
  const [referenceNo,setReferenceNo]=useState(null)
  const [file, setFile] = useState()
  const {moneyDepositeUrl,setMoneyDepositeUrl,depositeRequestDetails}=useGlobalData()


  const router=useRouter()
  


 



  const updateCollectionRequestDeposited = async() =>{
    const formData = new FormData();
    formData.append("status", "CDP");
    formData.append("file", file);
    formData.append("ref_no",referenceNo)

    const response= await collectionServiceObj.updateCollectionRequestDeposited(depositeRequestDetails?.request_id, formData, {"Content-Type" : "multipart/form-data"})
    
  }

  function handleFileChange(event) {
    setFile(event.target.files[0])
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
        <p className='text-[16px]'>{depositeRequestDetails?.instrument_id}</p>
      </div>}
      
      <div className='flex flex-col p-2'>
        <p className='text-sm'>Beneficiary Name</p>
        <p className='text-[16px]'>{depositeRequestDetails?.beneficiary_name}</p>
      </div>

      <div className='flex flex-col p-2'>
        <p className='text-sm'>Reference Number</p>
        <InputText value={referenceNo} onChange={(e) => setReferenceNo(e.target.value)} />
      </div>

      <div className="form-group flex flex-col p-2">
          <label htmlFor="invoiceNumber" className='text-m text-gray'  >
            Image upload
          </label>
          <input id="fileInput" type="file" ref={inputRef}
          onChange={handleFileChange}/>
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
      </div>
</div>
    
  )
}

export default DepositeContainer