import React from 'react'
import DepositeContainer from '../../components/DepositeContainer'

const DepositeAmount = ({contexts}) => {

  return (
    <DepositeContainer requestId={contexts.requestId}/>
  )
}

export async function getServerSideProps(context) {

  const contexts=context.query;
 
  return { 
    props: { contexts }
  }
}


export default DepositeAmount