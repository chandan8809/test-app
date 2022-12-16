import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import {priceBodyTemplate} from "../common/Helper"
import { collectionServiceObj } from '../../services/collectionService';
import moment from "moment"
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import { useGlobalData } from '../../contexts/GlobalContext';
import { notify } from '../Notify';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';



const ListPendingCollectionContainer = () => {
  const [inHandCollectionList,setInHandCollectionList]=useState([])
  const router = useRouter();

  const [showSRModal,setShowSRModal]=useState(false)
  const [SRNumber,setSRNumber]=useState("")
  const [loadingSRBtn,setLoadingSRBtn]=useState(false)
  const {setSRDetails,setGlobalLoader}=useGlobalData()

  useEffect(()=>{
    getCollectionListPending()
  },[])

 
  const getCollectionListPending= async()=>{
    setGlobalLoader(true)
    const response= await collectionServiceObj.getCollectionListPending()
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

  const getSRDetails = async()=>{
    setLoadingSRBtn(true)
    const response = await collectionServiceObj.getSRDetails(SRNumber)
  
    if(response.ok){
      const responseData=response.data
      setSRDetails(responseData)
      gotoCollectionPage()
    }
    else{
      const error=response.error
      notify("error",error.error_message)
    }
    setLoadingSRBtn(false)
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

             <div key={index} 
               onClick={()=>setShowSRModal(true)}
               className='flex-1 rounded-xl flex p-2 bg-gray-100 shadow-md justify-between mt-3 cursor-pointer'>
               <div className='flex flex-col flex-[60%]'>
                  <p className='text-[16px]  font-semibold  mt-0.5'>{item?.instrument_mode}</p>
                  <p className=' mt-0.5 text-xs'>store : {item?.source_name}</p>
                  <p className=' mt-0.5 text-xs'>Pickup Date : {moment(item.requested_at).utc().format('Do MMM, YYYY')}</p>
               </div>
             </div>

            ))}
           
          </div>
          <Dialog 
            header="Enter Pickup OTP" 
            visible={showSRModal} 
            onHide={() => setShowSRModal(false)} 
            breakpoints={{'960px': '75vw'}} 
            style={{width: '90vw'}}
            //position={'top'}
            >
            <div className='pt-2'>
              <InputText 
                style={{width:"300px"}}
                value={SRNumber}
                onChange={(e)=>setSRNumber(e.target.value)}
                onKeyDown={(e) => {
                  (e.code === 'Enter' || e.code === 'NumpadEnter') && getSRDetails()
                }}
                />
            </div>
            <div className='mx-auto text-center mt-6'>
              <Button 
              disabled={SRNumber==""}
              label="Submit" 
              icon="pi pi-check" 
              loading={loadingSRBtn}
              className='p-button-info'
              onClick={getSRDetails}
              />
          </div>
          </Dialog>
      </div>
    )
}

export default ListPendingCollectionContainer