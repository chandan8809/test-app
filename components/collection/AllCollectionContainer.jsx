import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { collectionServiceObj } from '../../services/collectionService';
import {priceBodyTemplate} from "../common/Helper"
import { useRouter } from 'next/router';


const AllCollectionContainer = () => {
  const [showSRModal,setShowSRModal]=useState(false)
  const [collectionSummary,setCollectionSummary]=useState({})
  const [exceedLimit,setExceedLimit]=useState(false)
  const router = useRouter();

  useEffect(()=>{
    getAllCollection()
  },[])

  const getAllCollection = async () => {
    //const response = await collectionServiceObj.getCollectionSummary()
    const response = {
      cash: {
          count: 4,
          amount: 10000,
          n_stores:3
       },
      cheque: {
          count: 4,
          amount: 10000,
          n_stores:4
      },
      limit: 10000
    }

    if(response?.cash?.amount > response?.limit){
      setExceedLimit(true)
    }else{
      setExceedLimit(false)
    }

    setCollectionSummary(response)
  };

  


  const renderFooter = () => {
    return (
      <div className='mx-auto text-center mt-2'>
          <Button label="Submit" icon="pi pi-check" className='p-button-info'/>
      </div>
    );
  }
  console.log('coll',collectionSummary)

  const goToListInHandPage=()=>{
    router.push(`/collection/in-hand-collection`)
  }

  const goToListPendingCollection=()=>{
    router.push(`/collection/pending-collection`)
  }
 

  return (
    <div className='text-center px-4 '>
        <h1 className='text-xl font-semibold pt-10 text-blue-700'>All Collection</h1>
        <div className='flex gap-2 justify-around pt-10 text-gray-700 '>
          <div className={`flex-1 rounded-xl flex flex-col p-2 bg-green-100 shadow-md ${exceedLimit && "border-red-500 border"}`}>
            <p className='text-[18px] font-light text-gray-500'>Cash in Hand</p>
            <p className='text-xl font-bold mt-1'>{priceBodyTemplate(collectionSummary?.cash?.amount)}</p>
            <p className='text-gray-500 mt-0.5 text-sm'>({collectionSummary?.cash?.n_stores} Stores)</p>

          </div>
          <div className={`flex-1 rounded-xl flex flex-col p-2 bg-blue-100 shadow-md`}>
            <p className='text-[18px] font-light text-gray-500'>Cheques in Hand</p>
            <p className='text-xl font-bold mt-1'>{collectionSummary?.cheque?.count}</p>
            <p className='text-gray-500 mt-0.5 text-sm'>({collectionSummary?.cheque?.n_stores} Stores)</p>
          </div>
        </div>

        {exceedLimit && <div className='flex flex-col gap-2 justify-around pt-2 text-gray-700 '>
          <div className='flex-1 rounded-xl flex justify-between  bg-red-100 gap-4 p-4'>
            <Image src='/WarningIcon.svg' alt='Tez POS Logo' width={40} height={30} />
            <p className='text-md font-light text-left leading-5' style={{color:"#FF1818"}}>In Hand Collection is over the limit. Please deposit immediately to continue collections</p>
          </div>
        </div>}

        <div className='flex flex-col gap-2 justify-around pt-14 text-gray-700 '>
          <div 
            className='flex-1 rounded-xl flex justify-between  bg-gray-100 gap-4 p-4'
            onClick={goToListInHandPage}
            >
            <p className='text-[18px] font-semibold'>In Hand Collections</p>
            <Image src='/ArrowSign.svg' alt='Tez POS Logo' width={12} height={22} />
           

          </div>
          <div 
            className='flex-1 rounded-xl flex justify-between bg-gray-100 gap-4 p-4'
            onClick={goToListPendingCollection}
            >
            <p className='text-[18px] font-semibold'>Pending Requests</p>
            <Image src='/ArrowSign.svg' alt='Tez POS Logo' width={12} height={22} />
          

          </div>
        </div>

        <div className='bottom-6 absolute left-0 right-0 mx-auto'>
        <Button label='Enter SR Number' className='p-button-info' icon="pi pi-external-link" onClick={() => setShowSRModal(true)} />
        <Dialog 
          header="Enter SR Number" 
          visible={showSRModal} 
          onHide={() => setShowSRModal(false)} 
          breakpoints={{'960px': '75vw'}} 
          style={{width: '90vw'}}
          footer={renderFooter('displayResponsive')} 
          >
          <div className='pt-4'>
          <InputText style={{width:"75vw"}}/>
          </div>
        </Dialog>
        {/* <Button className='p-button-info' label='Enter SR Number'/> */}
        </div>
    </div>
    
  )
}

export default AllCollectionContainer