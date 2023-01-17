import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { collectionServiceObj } from '../../services/collectionService';
import moment from "moment";
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import { useGlobalData } from '../../contexts/GlobalContext';
import { notify } from '../Notify';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { TabMenu } from 'primereact/tabmenu';
import { priceBodyTemplate } from '../common/Helper';



const ListPendingCollectionContainer = () => {
  const [modalDataStoreWise,setModalDataStoreWise]=useState([])
  const [storeName,setStoreName]=useState("")
  const [showStoreData,setShowStoreData]=useState(false)
  const [pendingCollectionList,setPendingCollectionList]=useState([])
  const [dataForSearch,setDataForSearch]=useState([])
  const [activeIndex,setActiveIndex]=useState(0)
  const [showEmptyMessage,setShowEmptyMessage]=useState(false)
  const [dataForFilter,setDataForFilter]=useState([])
  const router = useRouter();
  const [searchVal,setSearchVal]=useState("")

  const [showSRModal,setShowSRModal]=useState(false)
  const [SRNumber,setSRNumber]=useState(null)
  const [loadingSRBtn,setLoadingSRBtn]=useState(false)
  const {setSRDetails,setGlobalLoader}=useGlobalData()

  const items = [
    {label: 'All'},
    {label: 'Cash'},
    {label: 'Cheque'},
  ];

  const excerpt=(str,count)=>{
    if(str.length>count){
        str=str.substring(0,count)+"..."
    }
    return str
  }

  useEffect(()=>{
    getCollectionListPending()
  },[])
  
  function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
 
  const getCollectionListPending= async()=>{
    setGlobalLoader(true)
    const response= await collectionServiceObj.getCollectionListPending()
    if(response.ok){
      const responseData=response?.data?.sort((date1, date2) => new Date(date2.requested_at)-new Date(date1.requested_at))
      if(responseData.length===0){
        setShowEmptyMessage(true)
      }
     
      setPendingCollectionList(responseData)
      setDataForFilter(responseData)
      setDataForSearch(responseData)
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

  const selectCashOrCheque=(data)=>{
    if(data==="All"){
      setModalDataStoreWise(dataForFilter)
      return;
    }
    const cashFilter=dataForFilter.filter(item=>item.instrument_mode==data)
    setModalDataStoreWise(cashFilter)
  }


  const gotoCollectionPage=()=>{
    router.push({
      pathname: `/payment-collection/${SRNumber}`,
    });
  }

  const searchByStoreName = (data)=>{
    const searchedStore = dataForSearch.filter(item=>item.source_name.toLowerCase().includes(data.trim().toLowerCase()))
    setPendingCollectionList(searchedStore)
  }


  const convertDataIntoStorewise=(data)=>{
    const _items = [...data]
    const storeItems = {}
    for (let index = 0; index < _items.length; index++) {
        const item = _items[index];
        if (!storeItems[item.source_name]) {
            storeItems[item.source_name] = {
              ...item,
              CASH:item.instrument_mode_tag==="CSH" ? item.request_amount : 0 ,
              CHEQUE:item.instrument_mode_tag==="CHQ" ? item.request_amount : 0,
            }
        } else {
            storeItems[item.source_name] = {
                ...storeItems[item.source_name],
                request_amount: storeItems[item.source_name].request_amount + item.request_amount,
                CASH: storeItems[item.source_name].CASH + (item.instrument_mode_tag==="CSH" ? item.request_amount : 0),
                CHEQUE: storeItems[item.source_name].CHEQUE + (item.instrument_mode_tag==="CHQ" ? item.request_amount : 0),
            }
        }
     }
     return storeItems
  }

  const openCashChequeListModal=(data)=>{
 
    const cashChequeModalData = pendingCollectionList.filter(each=>each.source_name===data.source_name)
    
    setModalDataStoreWise(cashChequeModalData)
    setStoreName(data.source_name)
    setShowStoreData(true)
    setDataForFilter(cashChequeModalData)

  }

  
 const storeWiseData= convertDataIntoStorewise(pendingCollectionList)


  return (
      <div>
         <div className='sticky top-0 bg-white px-4 pb-8'>
         <div className='flex items-center pt-8 justify-between'>
            <div className='flex items-center gap-2'>
              <Image 
                src='/Back.svg' 
                alt='Logo' 
                width={26} 
                height={26} 
                onClick={()=> router.push(`/collection`)}
                />
              <h1 className='text-[18px] font-semibold' style={{color:"#185DBF"}}>Pending Requests</h1>
            </div>

            <Button  className='p-button-sm'  onClick={() => setShowSRModal(true)} >Pickup OTP</Button>
          </div>
        
         

          <div className='pt-5 text-center'>
           <InputText 
             autoComplete="off"
             maxLength="50"
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

            {Object.values(storeWiseData).map((item,index)=>(

             <div key={index} 
               onClick={()=>openCashChequeListModal(item)}
               className='h-[90px] rounded-xl flex py-2 pl-0.5 md:px-2 bg-gray-100 shadow-md justify-between mt-4'
               >
               <div className='flex flex-col  w-[50%]'>
                  <p className=' mt-0.5 text-md'>{excerpt(item?.source_name,26)}</p>
                  <p className=' mt-0.5 text-xs'>Req Date : {moment(item.requested_at).utc().format('Do MMM, YYYY')}</p>
               </div>

               <div className='flex flex-col justify-between  w-[25%]'>
                 <p className='text-[16px] mt-0.5 text-center'>{"CASH"}</p>
                 <p className='text-[18px] font-bold  text-center'>{priceBodyTemplate(item?.CASH)}</p>
               </div>

               <div className='flex flex-col justify-between w-[25%] ml-3'>
                 <p className='text-[16px]  mt-0.5 text-center'>{"CHEQUE"}</p>
                 <p className='text-[18px] font-bold  text-center'>{priceBodyTemplate(item?.CHEQUE)}</p>
               </div>
             </div>

            ))}

            {showEmptyMessage && <p className='text-base mt-10 text-center text-gray-500'>No Pending collection</p>}
          </div>

          <Dialog 
            header={storeName}
            visible={showStoreData} 
            onHide={() => {
              setShowStoreData(false)
              setActiveIndex(0)
              setSearchVal("")
              searchByStoreName("")
             
            }} 
            breakpoints={{'960px': '75vw'}} 
            position={'top-left'}
            style={{width:"100vw",maxWidth:"400px"}}
           
            >
               <div className='pt-5 flex justify-center sticky top-0 bg-white'>
                <TabMenu 
                
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
               
              <div className='flex flex-col  justify-around text-gray-700 px-4 pb-6'>

                {modalDataStoreWise.map((item,index)=>(

                <div key={index} 
                  className='flex-1 rounded-xl flex p-2 bg-gray-100 shadow-md justify-between mt-3 '>
                  <div className='flex flex-col flex-[60%]'>
                      <p className='text-[16px]  font-semibold  mt-0.5'>{item?.instrument_mode}</p>
                     
                      <p className=' mt-0.5 text-xs'>Request Date : {moment(item.requested_at).utc().format('Do MMM, YYYY')}</p>
                  </div>
                  <div className='flex flex-col felx-[40%] justify-between'>
                    <p className='text-[18px] font-bold text-right'>{priceBodyTemplate(item?.request_amount)}</p>
                    
                  </div>
                </div>

                ))}
                </div>
           
          </Dialog>

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
      </div>
    )
}

export default ListPendingCollectionContainer