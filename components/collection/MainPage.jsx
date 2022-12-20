import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { collectionServiceObj } from '../../services/collectionService';
import {priceBodyTemplate} from "../common/Helper"
import { useRouter } from 'next/router';
import { useGlobalData } from '../../contexts/GlobalContext';
import { notify } from '../Notify';
import {useAuth} from "../../contexts/UserContext"
import { InputNumber } from 'primereact/inputnumber';

const MainPage = () => {
  const [showSRModal,setShowSRModal]=useState(false)
  const [collectionSummary,setCollectionSummary]=useState({})
  const [exceedLimit,setExceedLimit]=useState(false)
  const [SRNumber,setSRNumber]=useState("")
  const [loadingSRBtn,setLoadingSRBtn]=useState(false)
  const router = useRouter();
  const {setSRDetails,setGlobalLoader}=useGlobalData()
  const {logout}=useAuth()
  const [logoutDialog,setLogoutDialog]=useState(false)


  useEffect(()=>{
    getAllCollection()
  },[])

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
      notify("error","Please enter valid Pickup OTP")
    }
    setLoadingSRBtn(false)
  }

  const gotoCollectionPage=()=>{
    router.push({
      pathname: `/payment-collection/${SRNumber}`,
    });
  }


  const getAllCollection = async () => {
    setGlobalLoader(true)
    let response = await collectionServiceObj.getCollectionSummary()
    if(response.ok){
      const responseData=response.data
      if(responseData?.cash?.amount > responseData?.limit){
        setExceedLimit(true)
      }else{
        setExceedLimit(false)
      }
      setCollectionSummary(responseData)
    }
    else{
      const error=response.error
      notify("error",error.error_message)
     
    }
     setGlobalLoader(false) 
  };



  const goToListInHandPage=()=>{
    router.push({
      pathname: `/collection/in-hand-collection`,
    });
  }

  const goToListPendingCollection=()=>{
    router.push({
      pathname: `/collection/pending-collection`,
    });
  }

  const goToListDeposited=()=>{
    router.push({
      pathname: `/collection/list-deposited`,
    });
  }

  const goToListInHandPageCash=()=>{
    router.push({
      pathname: `/collection/in-hand-collection`,
      query:{request:"Cash"}
    });
  }

  const goToListInHandPageCheque=()=>{
    router.push({
      pathname: `/collection/in-hand-collection`,
      query:{request:"Cheque"}
    });
  }
 

  return (
    <div className='text-center px-4'>
        
        <h1 className='text-xl font-semibold pt-10 text-blue-700'>All Collection</h1>
        <div className='flex gap-2 justify-around pt-10 text-gray-700 '>
          <div 
            className={`flex-1 cursor-pointer rounded-xl flex flex-col p-2 bg-green-100 shadow-md ${exceedLimit && "border-red-500 border"}`}
            onClick={goToListInHandPageCash}
            >
            <p className='text-[18px] font-light text-gray-500'>Cash in Hand</p>
            <p className='text-xl font-bold mt-1'>{priceBodyTemplate(collectionSummary?.cash?.amount)}</p>
            <p className='text-gray-500 mt-0.5 text-sm'>({collectionSummary?.cash?.n_stores} Stores)</p>

          </div>
          <div 
            className={`flex-1 cursor-pointer rounded-xl flex flex-col p-2 bg-blue-100 shadow-md`}
            onClick={goToListInHandPageCheque}
            >
            <p className='text-[18px] font-light text-gray-500'>Cheques in Hand</p>
            <p className='text-xl font-bold mt-1'>{collectionSummary?.cheque?.count}</p>
            <p className='text-gray-500 mt-0.5 text-sm'>({collectionSummary?.cheque?.n_stores} Stores)</p>
          </div>
        </div>

        {exceedLimit && <div className='flex flex-col gap-2 justify-around pt-2 text-gray-700 '>
          <div className='flex-1 rounded-xl flex justify-between  bg-red-100 gap-4 p-4'>
            <Image src='/WarningIcon.svg' alt='Logo' width={40} height={30} />
            <p className='text-md font-light text-left leading-5' style={{color:"#FF1818"}}>In Hand Collection is over the limit. Please deposit immediately to continue collections</p>
          </div>
        </div>}

        <div className='flex flex-col gap-2 justify-around pt-14 text-gray-700 '>
          <div 
            className='flex-1 rounded-xl flex justify-between  bg-gray-100 gap-4 p-4 active:bg-gray-200 cursor-pointer'
            onClick={goToListInHandPage}
            >
            <p className='text-[18px] font-semibold'>In Hand Collections</p>
            <Image src='/ArrowSign.svg' alt='Logo' width={12} height={22} />
           

          </div>
          <div 
            className='flex-1 rounded-xl flex justify-between bg-gray-100 gap-4 p-4 active:bg-gray-200 cursor-pointer'
            onClick={goToListPendingCollection}
            >
            <p className='text-[18px] font-semibold'>Pending Requests</p>
            <Image src='/ArrowSign.svg' alt='Logo' width={12} height={22} />
          

          </div>

          <div 
            className='flex-1 rounded-xl flex justify-between bg-gray-100 gap-4 p-4 active:bg-gray-200 cursor-pointer'
            onClick={goToListDeposited}
            >
            <p className='text-[18px] font-semibold'>Deposited</p>
            <Image src='/ArrowSign.svg' alt='Logo' width={12} height={22} />
          </div>
        </div>

        <div className='absolute top-7'>
         <Button 
          onClick={()=>setLogoutDialog(true)} 
          label='Logout' 
          className='p-button-small p-button-danger p-button-rounded p-button-text '
          />
        </div>
       
        <div className='bottom-8 absolute left-0 right-0 mx-auto'>
        <Button label='Enter Pickup OTP' className='p-button-info' icon="pi pi-external-link" onClick={() => setShowSRModal(true)} />
        <Dialog 
          header="Enter Pickup OTP" 
          visible={showSRModal} 
          onHide={() => setShowSRModal(false)} 
          breakpoints={{'960px': '75vw'}} 
        
          //position={'top'}
          >
          <div className='pt-2'>
            <InputNumber
              useGrouping={false}
              style={{width:"300px"}}
              value={SRNumber}
              onChange={(e)=>setSRNumber(e.value)}
              onKeyDown={(e) => {
                (e.code === 'Enter' || e.code === 'NumpadEnter') && getSRDetails()
              }}
              />
          </div>
          <div className='mx-auto text-center mt-6'>
            <Button 
             disabled={SRNumber==""}
             label="Submit" 
            
             loading={loadingSRBtn}
             className='p-button-info'
             onClick={getSRDetails}
             />
         </div>
        </Dialog>

        <Dialog 
          header="Are you sure" 
          visible={logoutDialog} 
          onHide={() => setLogoutDialog(false)} 
          breakpoints={{'960px': '75vw'}} 
          style={{width: '300px'}}
          //position={'top'}
          >
          <div className='pt-2'>
           
          </div>
          <div className='mx-auto text-center mt-6'>
            <Button 
           
             label="Yes" 
             className='p-button-info p-button-danger'
             onClick={logout}
             />
         </div>
        </Dialog>
      
        </div>
    </div>
    
  )
}

export default MainPage