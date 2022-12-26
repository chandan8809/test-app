import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { useGlobalData } from '../contexts/GlobalContext';
import moment from "moment"
import {InputText} from "primereact/inputtext";
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { collectionServiceObj } from '../services/collectionService';
import { Dialog } from 'primereact/dialog';
import Camera from './camera';
import { Toast } from 'primereact/toast';
import { notify } from './Notify';


const PaymentCollectionContainer = ({SRNumber}) => {
  const [OTPsendCount,setOTPsendCount]=useState(0)
  const [SRDetails,setSRDetails]=useState()
  const [counter, setCounter] = useState(0);
  const [startTimer,setStartTimer]=useState(false)
  const [collectedAmount,setCollectedAmount]=useState("")
  const [cameraModal,setCameraModal]=useState(false)
  const router=useRouter()
  const {moneyDepositeUrl,setMoneyDepositeUrl,setGlobalLoader}=useGlobalData()
  const inputRef=useRef()
  const [file, setFile] = useState(null)

  useEffect(() => {
    if(startTimer)
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    if(counter===0){
      setStartTimer(false)
    }
  }, [counter,startTimer]);

  useEffect(()=>{
      getSRDetails()
  },[])


  const getSRDetails = async()=>{
    setGlobalLoader(true)
    const response = await collectionServiceObj.getSRDetails(SRNumber)
  
    if(response.ok){
      const responseData=response.data
      setSRDetails(responseData)
    }
    else{
      const error=response.error
      notify("error",error.error_message)
    }
    setGlobalLoader(false)
  }


  const toast = useRef(null);
  const showError = () => {
    toast.current.show({severity:'error', summary: 'Error', detail:'Wrong Username Or Password', life: 3000});
  }

  const resendOTPcall=async()=>{
    setGlobalLoader(true)
    const response = await collectionServiceObj.resendOTP(SRDetails?.request_id)
    if(response.ok){
      const responseData=response.data
      setStartTimer(true)
      setCounter(30)
      setOTPsendCount(prev=>prev+1)
    }
    else{
      const error=response.error
      notify("error",error.error_message)
    }
    setGlobalLoader(false)
  }

  const updateCollectionRequestUpdate = async() =>{
    setGlobalLoader(true)
    const formData = new FormData();
    formData.append("status", "CBP");
    formData.append("collected_amount", collectedAmount);

    if(SRDetails?.instrument_mode_tag === "CHQ"){
      formData.append("instrument_id",SRDetails?.instrument_id );
      formData.append("file", file);
    }
    
    const response= await collectionServiceObj.updateCollectionRequestPicked(SRDetails?.request_id, formData, {"Content-Type" : "multipart/form-data"})
    if(response.ok){
      const responseData=response.data
      setSRDetails((prev)=>({...prev,status_tag:responseData.status_tag}))
      setStartTimer(true)
      setCounter(30)
      setOTPsendCount(prev=>prev+1)
    }
    else{
      const error=response.error
      notify("error",error.error_message)
    }
    setGlobalLoader(false)
  }

  const onDepositeButtonClick=()=>{
    if(OTPsendCount>=3){
      notify("error","OTP send limit exceed")
      return;
    }
    if(SRDetails?.status_tag === "CRQ"){
      updateCollectionRequestUpdate()
    }
    else if(SRDetails?.status_tag === "CBP"){
      resendOTPcall()
    }
  }

  function handleFileChange(event) {
    setFile(event.target.files[0])
  }

  
  return (
    <div className=' px-4'>
      <Toast ref={toast} position="bottom-center"/>
    <div className='flex items-center pt-8 gap-2'>
      <Image 
        src='/Back.svg' 
        alt='Logo' 
        width={26} 
        height={26} 
        onClick={()=> router.push(`/collection`)}
        />
      <h1 className='text-[18px] font-semibold' style={{color:"#185DBF"}}>Pending Requests</h1>
    </div>

    <div className='flex flex-col  justify-around pt-8 text-gray-600 gap-2'>

      <div className='flex flex-col p-2 '>
        <p className='text-sm '>Store</p>
        <p className='text-[16px]'>{SRDetails?.store_name}</p>
      </div>
     

      {SRDetails?.instrument_mode_tag ==="CHQ" &&<div className='flex flex-col p-2'>
        <p className='text-sm'>Beneficiary Name</p>
        <p className='text-[16px]'>{SRDetails?.beneficiary_name}</p>
      </div>}

      {SRDetails?.instrument_mode_tag ==="CHQ" &&
      <div className='flex'>
        <div className='flex flex-col p-2 flex-1'>
          <p className='text-sm'>Mode</p>
          <p className='text-[16px]'>{SRDetails?.instrument_mode}</p>
        </div>
        <div className='flex flex-col p-2 flex-1'>
          <p className='text-sm'>Cheque Number</p>
          <p className='text-[16px]'>{SRDetails?.instrument_id}</p>
        </div>
      </div>}

      {SRDetails?.instrument_mode_tag ==="CSH" &&
       <div className='flex flex-col p-2'>
        <p className='text-sm'>Mode</p>
        <p className='text-[16px]'>{SRDetails?.instrument_mode}</p>
      </div>}
      
      <div className='flex flex-col p-2'>
        <p className='text-sm'>Request Date</p>
        <p className='text-[16px]'>{moment(SRDetails?.request_date).utc().format('Do MMM, YYYY')}</p>
      </div>
      <div className='flex flex-col p-2'>
        <p className='text-[16px] text-gray-900 mb-2'>{SRDetails?.instrument_mode_tag ==="CSH" ?"Cash Pickup Amount":"Cheque Amount"}</p>
      
         {SRDetails?.status_tag === "CBP"?
            <p className='text-[20px] font-bold'>{SRDetails?.request_amount}</p>: 
            <InputText
              autoComplete="off"
              value={collectedAmount}
              type={'number'}
              onChange={(e) => setCollectedAmount(e.target.value)}
              mode="decimal"
              maxFractionDigits={2}
              className="p-inputtext"
              
              onKeyDown={(e) => {
                (e.code === 'Enter' || e.code === 'NumpadEnter') && onDepositeButtonClick()
                // getStocks(e.target.value)
            }}
            />}
      </div>

     {SRDetails?.instrument_mode_tag ==="CHQ" && SRDetails?.status_tag === "CRQ" && 
      <div className="form-group flex flex-col p-2">
          <label htmlFor="invoiceNumber" className='text-m text-gray'  >
            Cheque Image
          </label>
          <input id="fileInput" type="file" ref={inputRef}
          onChange={handleFileChange}/>
      </div>
      // <div className='flex flex-col p-2'>
      //   <p className='text-sm'>Cheque Image</p>
      //   <div 
      //     className='flex items-center gap-2'
          
      //     >
      //     <Image 
      //       src='/openCamera.svg' 
      //       alt='Tez POS Logo' 
      //       width={34} 
      //       height={34}
            
      //       />
            
      //     <h1 
      //       onClick={() => setCameraModal(true)} 
      //       className='text-sm text-blue-700'>{moneyDepositeUrl ? "Dummy Image name" : "Upload File or Open Camera"}
      //     </h1>

      //     {moneyDepositeUrl && <Button 
      //       onClick={() => {
      //         setMoneyDepositeUrl(null)
      //         }} 
      //       icon="pi pi-times" 
      //       className="p-button-rounded p-button-danger p-button-text" 
      //       aria-label="Cancel"
      //     />}
            
      //   </div>
      // </div>

      }

      <div className='bottom-8 absolute left-0 right-0 mx-auto'>
        <Dialog 
          header="Click Picture" 
          visible={cameraModal} 
          onHide={() => {
            setCameraModal(false)
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
         {moneyDepositeUrl && <Button onClick={() => setCameraModal(false)} label='Done' className=' p-button-success'/>}
         </div>
         
        </Dialog>
      </div>

    </div>

    <div className='text-center absolute bottom-8 left-0 right-0 mx-auto'>
      {counter !==0 && <p className='pb-4' style={{color:"#185DBF"}}>Please Share OTP (Retry sending OTP {counter})</p>}
      <Button 
       style={{width:"88%",maxWidth:"500px"}}
        disabled={SRDetails?.instrument_mode_tag ==="CHQ" ?startTimer || collectedAmount=="" || !file : startTimer || collectedAmount==""}
        label={SRDetails?.status_tag === "CBP" ?"Resend OTP":"Pickup and Get OTP"}
        onClick={onDepositeButtonClick}
        />
       

    </div>
    
</div>
    
  )
}

export default PaymentCollectionContainer