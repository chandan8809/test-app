import React, { useRef, useState } from 'react'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useAuth } from '../contexts/UserContext';

import { Password } from 'primereact/password';
import { useRouter } from 'next/router';
import { notify } from './Notify';

const LoginContainer = () => {
  const [username,setUsername]=useState("")
  const [password,setPassword]=useState("")
  const [loadingBtn,setLoadingBtn]=useState(false)
  const [errorLogin,setErrorLogin]=useState(false)
  const { login } = useAuth();
  const router = useRouter();


  const handleSubmit=async()=>{
    setLoadingBtn(true)
    const loginResponse = await login(username,password);
    
    const { success, error } = loginResponse ?? {};
    if (error) {
      notify("error","wrong password or username")
      setErrorLogin(true)
    
    } else if (success) {
      setErrorLogin(false)
      router.push(`/collection`)
    }
    setLoadingBtn(false)
  }
  
 



  return (
    <div className='pt-20 flex flex-col items-center'>
      {/* <Toast ref={toast} position="bottom-center"/> */}
        <span className="p-float-label" >
          <InputText 
             style={{width:"233px"}}
             id="username" 
             value={username}
             onChange={(e)=>setUsername(e.target.value)}
             className={errorLogin && "p-invalid block"} />
          <label htmlFor="username">Username</label>
        </span>

        <span className="p-float-label mt-8" >
          <Password 
            style={{width:"233px"}} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            feedback={false} 
            toggleMask
            className={errorLogin && "p-invalid block"} 
            onKeyDown={(e) => {
              (e.code === 'Enter' || e.code === 'NumpadEnter') && handleSubmit()
              // getStocks(e.target.value)
            }}
            />
          <label htmlFor="username">Password</label>
        </span>
 
        <div className='pt-6 items-center'>
          <Button 
            loading={loadingBtn}
            label="Submit" 
            className="p-button-info w-40"
            onClick={handleSubmit}
             />
        </div>
    </div>
  )
}

export default LoginContainer