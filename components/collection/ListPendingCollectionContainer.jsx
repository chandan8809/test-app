import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { collectionServiceObj } from '../../services/collectionService';
import moment from "moment";
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import { useGlobalData } from '../../contexts/GlobalContext';
import { notify } from '../Notify';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { TabMenu } from 'primereact/tabmenu';
import { priceBodyTemplate } from '../common/Helper';



const ListPendingCollectionContainer = () => {
  const [inHandCollectionList,setInHandCollectionList]=useState([])
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
      const responseData=response?.data?.reverse()
      if(responseData.length===0){
        setShowEmptyMessage(true)
      }
      setInHandCollectionList(responseData)
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

  const gotoCollectionPage=()=>{
    router.push({
      pathname: `/payment-collection/${SRNumber}`,
    });
  }

  const searchByStoreName = (data)=>{
    const searchedStore = dataForSearch.filter(item=>item.source_name.toLowerCase().includes(data.trim().toLowerCase()))
    setInHandCollectionList(searchedStore)
  }

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
        
          <div className='pt-5 flex justify-center'>
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

          <div className='pt-5 text-center'>
           <InputText 
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

            {inHandCollectionList.map((item,index)=>(

             <div key={index} 
               className='flex-1 rounded-xl flex p-2 bg-gray-100 shadow-md justify-between mt-3 '>
               <div className='flex flex-col flex-[60%]'>
                  <p className='text-[16px]  font-semibold  mt-0.5'>{item?.instrument_mode}</p>
                  <p className=' mt-0.5 text-xs'>Store : {item?.source_name}</p>
                  <p className=' mt-0.5 text-xs'>Request Date : {moment(item.requested_at).utc().format('Do MMM, YYYY')}</p>
               </div>
               <div className='flex flex-col felx-[40%] justify-between'>
                 <p className='text-[18px] font-bold text-right'>{priceBodyTemplate(item?.request_amount)}</p>
                 
               </div>
             </div>

            ))}

            {showEmptyMessage && <p className='text-base mt-10 text-center text-gray-500'>No Pending collection</p>}
           
          </div>
          <Dialog 
            header="Enter Pickup OTP" 
            visible={showSRModal} 
            onHide={() => setShowSRModal(false)} 
            breakpoints={{'960px': '75vw'}} 
            //position={'top'}
            >
            <div className='pt-2 mx-auto'>
              <InputNumber
                autoFocus
                useGrouping={false}
                style={{width:"250px",padding:"0px 16px"}}
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
              onClick={getSRDetails}
              />
          </div>
          </Dialog>
      </div>
    )
}

export default ListPendingCollectionContainer