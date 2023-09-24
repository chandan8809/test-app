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
import { InputText } from "primereact/inputtext";

const MainPage = () => {
  const [showSRModal,setShowSRModal]=useState(false)
  const [collectionSummary,setCollectionSummary]=useState({})
  const [exceedLimit,setExceedLimit]=useState(false)
  const [SRNumber,setSRNumber]=useState(null)
  const [loadingSRBtn,setLoadingSRBtn]=useState(false)
  const router = useRouter();
  const {setSRDetails,setGlobalLoader}=useGlobalData()
  const {logout}=useAuth()
  const [logoutDialog,setLogoutDialog]=useState(false)


  // useEffect(()=>{
  //   getAllCollection()
  // },[])

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
      if(responseData?.cash?.amount > (responseData?.limit*0.8)){
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




  const goToTestpage=()=>{
    router.push({
      pathname: `/mock-test`,
    });
  }

  const goToListDeposited=()=>{
    router.push({
      pathname: `/collection/list-deposited`,
    });
  }

 

  return (
    <div className='text-center px-4'>  
        <h1 className='text-xl font-semibold pt-10' style={{color:"#185DBF"}}>Dashbord</h1>
        <div className='flex gap-2 justify-around pt-10 text-gray-700 '>
          <div 
            className={`flex-1 cursor-pointer rounded-xl flex flex-col p-2 bg-green-100 shadow-md ${exceedLimit && "border-red-500 border"}`}
            // onClick={goToListInHandPageCash}
            >
            <p className='text-[18px] font-light text-gray-500'>Total Marks</p>
            <p className='text-xl font-bold mt-1'>{collectionSummary?.cash?.amount ? priceBodyTemplate(collectionSummary?.cash?.amount) :"---"}</p>

          </div>
          <div 
            className={`flex-1 cursor-pointer rounded-xl flex flex-col p-2 bg-blue-100 shadow-md`}
            // onClick={goToListInHandPageCheque}
            >
            <p className='text-[18px] font-light text-gray-500'>Rank</p>
            <p className='text-xl font-bold mt-1'>{collectionSummary?.cheque?.count ?? "---"}</p>
          </div>
        </div>

        {exceedLimit && <div className='flex flex-col gap-2 justify-around pt-2 text-gray-700 '>
          <div className='flex-1 rounded-xl flex justify-between  bg-red-100 gap-4 p-4'>
            <Image src='/WarningIcon.svg' alt='Logo' width={40} height={30} />
           {collectionSummary?.limit - collectionSummary?.cash?.amount === 0 ? 
                       <p className='text-md font-light text-left leading-5' style={{color:"#FF1818"}}>In Hand Collection limit reached. Please deposit immediately to continue collections</p>:
            <p className='text-md font-light text-left leading-5' style={{color:"#FF1818"}}>In Hand Collection is about to reach the limit. Please deposit immediately to continue collections ( limit left {priceBodyTemplate(collectionSummary?.limit - collectionSummary?.cash?.amount)})</p>

            }
          </div>
        </div>}

        <div className='flex flex-col gap-2 justify-around pt-14 text-gray-700 '>
          <div 
            className='flex-1 rounded-xl flex justify-between bg-gray-100 gap-4 p-4 active:bg-gray-200 cursor-pointer'
            onClick={goToTestpage}
            >
            <p className='text-[18px] font-semibold'>Mock Tests</p>
            <Image src='/ArrowSign.svg' alt='Logo' width={12} height={22} />
          </div>

         

          <div 
            className='flex-1 rounded-xl flex justify-between bg-gray-100 gap-4 p-4 active:bg-gray-200 cursor-pointer'
            onClick={goToListDeposited}
            >
            <p className='text-[18px] font-semibold'>Daily News</p>
            <Image src='/ArrowSign.svg' alt='Logo' width={12} height={22} />
          </div>
        </div>

        <div className='absolute top-9'>
          <Image  onClick={()=>setLogoutDialog(true)}  src='/logout.svg' alt='Logo' width={30} height={30} />
        </div>
       
        <div className='bottom-8 absolute left-0 right-0 mx-auto'>
        <Button style={{width:"90%",maxWidth:"500px"}} label='Start Test'  icon="pi pi-external-link" onClick={() => setShowSRModal(true)} />
        <Dialog 
          header="Enter Pickup OTP" 
          visible={showSRModal} 
          onHide={() => {
            setShowSRModal(false)
            setSRNumber(null)
          }} 
          breakpoints={{'960px': '75vw'}} 
         
          //position={'top'}
          >
          <div className='pt-2 flex justify justify-center px-4'>
            <InputText
              autoFocus
              useGrouping={false}
              type={'number'}
              value={SRNumber}
              onChange={(e)=>setSRNumber(e.target.value)}
              onKeyDown={(e) => {
                (e.code === 'Enter' || e.code === 'NumpadEnter') && getSRDetails()
              }}
              />
          </div>
          <div className='mx-auto text-center mt-6'>
            <Button 
             disabled={!SRNumber}
             label="Submit" 
       
             loading={loadingSRBtn}
            
             onClick={getSRDetails}
             />
         </div>
        </Dialog>

        <Dialog 
          header="Logout" 
          visible={logoutDialog} 
          onHide={() => setLogoutDialog(false)} 
          breakpoints={{'960px': '75vw'}} 
          style={{width: '300px'}}
          //position={'top'}
          >
          <div className='pb-4 text-center'>
            Are You Sure?
          </div>
          <div className='mx-auto text-center mt-6 flex justify-around'>
            <Button 
             style={{width:"90px"}}
             label="Yes" 
             className='p-button-sm'
             onClick={logout}
             />

            <Button 
             style={{width:"90px"}}
             label="No" 
             className=' p-button-sm'
             onClick={()=>setLogoutDialog(false)}
             />
         </div>
        </Dialog>
      
        </div>
    </div>
    
  )
}

export default MainPage