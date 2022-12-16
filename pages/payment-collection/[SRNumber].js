import React from 'react'
import PaymentCollectionContainer from '../../components/PaymentCollectionContainer'


const PaymentCollection = ({contexts}) => {
  return (
    <PaymentCollectionContainer SRNumber={contexts.SRNumber}/>
  )
}

export async function getServerSideProps(context) {

  const contexts=context.query;
 
  return { 
    props: { contexts }
  }
}

export default PaymentCollection