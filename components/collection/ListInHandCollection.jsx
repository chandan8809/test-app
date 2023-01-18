import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import {priceBodyTemplate} from "../common/Helper"
import { collectionServiceObj } from '../../services/collectionService';
import moment from "moment"
import { useRouter } from 'next/router';
import { useGlobalData } from '../../contexts/GlobalContext';
import { notify } from '../Notify';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { TabMenu } from 'primereact/tabmenu';

const ListInHandCollection = () => {
  const [inHandCollectionList,setInHandCollectionList]=useState([])
  const [dataForSearch,setDataForSearch]=useState([])
  const [activeIndex,setActiveIndex]=useState(0)
  const [searchVal,setSearchVal]=useState("")
  const [showEmptyMessage,setShowEmptyMessage]=useState(false)
  const [dataForFilter,setDataForFilter]=useState([])
  const router = useRouter();
  const {setDepositeRequestDataAvailable,setGlobalLoader}=useGlobalData({})

  const items = [
    {label: 'All'},
    {label: 'Cash'},
    {label: 'Cheque'},
  ];

  useEffect(()=>{
    loadInitalData()
  },[router])

  function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  const loadInitalData = async()=>{
    if(router?.query?.request){
      const listData= await getInHandCollectionList()
      // selectCashOrCheque(router.query.request)
      selectCashOrChequeInitail(router.query.request,listData)
    }else{
      getInHandCollectionList()
    }
  }

  const getInHandCollectionList= async()=>{
    setGlobalLoader(true)
    const response= await collectionServiceObj.getCollectionListingInHand()
   
    if(response.ok){
      
      const responseData=response.data.sort((date1, date2) => new Date(date2.completed_at)-new Date(date1.completed_at))
      if(responseData.length===0){
        setShowEmptyMessage(true)
      }
      setGlobalLoader(false)
      setInHandCollectionList(responseData)
      setDataForFilter(responseData)
      setDataForSearch(responseData)
      return responseData
      
    }
    else{
      const error=response.error
      notify("error",error.error_message)
    }
    setGlobalLoader(false)
 
  }

  const getDepositeRequestDetails = async(request_id)=>{
    setGlobalLoader(true)
     const response = await collectionServiceObj.depositeRequestDetails(request_id)

    if(response.ok){
      const responseData=response.data
      setDepositeRequestDataAvailable(responseData)
      gotoDepositePage(request_id)
    }
    else{
      const error=response.error
      notify("error",error.error_message)
    }
    setGlobalLoader(false)
  }

  const gotoDepositePage=(requestId)=>{
    router.push(`/deposite/${requestId}`)
  }

  const gotoMainPage=()=>{
    router.push("/collection")
  }

  const selectCashOrCheque=(data)=>{
    if(data==="All"){
      setInHandCollectionList(dataForFilter)
      setDataForSearch(dataForFilter)
      setSearchVal("")
      return;
    }
    const cashFilter=dataForFilter.filter(item=>item.instrument_mode==data)
    setInHandCollectionList(cashFilter)
    setDataForSearch(cashFilter)
    setSearchVal("")
  }

  const selectCashOrChequeInitail=(data,initalData)=>{
    if(data==="Cash"){
      setActiveIndex(1)
    }
    if(data==="Cheque"){
      setActiveIndex(2)
    }
    const cashFilter=initalData.filter(item=>item.instrument_mode==data)
    setInHandCollectionList(cashFilter)
    setDataForSearch(cashFilter)
  }

  const searchByStoreName = (data)=>{
    const searchedStore = dataForSearch.filter(item=>item.source_name.toLowerCase().includes(data.trim().toLowerCase()))
    setInHandCollectionList(searchedStore)
  }

  return (
      <div >
        <div className='px-4 pb-8 sticky bg-white top-0 '>
         <div className='flex items-center pt-8 gap-2'>
            <Image 
              src='/Back.svg' 
              alt='Logo' 
              width={26} 
              height={26} 
              onClick={gotoMainPage}
              />
            <h1 className='text-[18px] font-semibold' style={{color:"#185DBF"}}>In Hand Collections</h1>
          </div>
          
           <div className='pt-5 flex justify-center'>
          <TabMenu 
            style={{color:"#185DBF"}}
            model={items} 
            activeIndex={activeIndex} 
            className="p-tabmenu-nav w-[240px]" 
            onTabChange={(e) => {
              setActiveIndex(e.index)
              selectCashOrCheque(e.value.label)
              topFunction() 
         
            }} 
            />
          </div>
          <div className='pt-5 text-center'>
           <InputText 
             autoComplete="off"
             className='p-inputtext-sm w-[300px]' 
             placeholder='search by store' 
             value={searchVal}
             onChange={(e)=>{
               setSearchVal(e.target.value)
               searchByStoreName(e.target.value)
              }}
             />
          </div>
        </div>
          
          <div className='flex flex-col  justify-around text-gray-700 px-4 pb-6'>

            {inHandCollectionList.map((item,index)=>(
             <div key={index} 
               className='flex-1 rounded-xl flex p-2 bg-gray-100 shadow-md justify-between mt-3 active:bg-gray-200 cursor-pointer'
               onClick={()=>getDepositeRequestDetails(item.id)}
               >
               <div className='flex flex-col flex-[60%]'>
                  
                  <p className='text-[16px]  font-semibold  mt-0.5'>{item?.instrument_mode}</p>
                  <p className=' mt-0.5 text-xs'>Store : {item?.source_name}</p>
                  {<p className=' mt-0.5 text-xs'>Request Date : {moment(item.requested_at).utc().format('Do MMM, YYYY')}</p>}
                  {<p className=' mt-0.5 text-xs'>Pickup Date : {moment(item.completed_at).utc().format('Do MMM, YYYY')}</p>}
               </div>

               <div className='flex flex-col felx-[40%] justify-between'>
                 <p className='text-[18px] font-bold text-right'>{priceBodyTemplate(item?.collected_amount)}</p>
                  <p className=' mt-0.5 font-semibold text-[18px] text-right' style={{color:"#185DBF"}}>Deposit Now</p>
               </div>
             </div>
    
            ))}
           
            {showEmptyMessage && <p className='text-base mt-10 text-center text-gray-500'>No In-Hand collection</p>}
          </div>
      </div>
    )
}

export default ListInHandCollection