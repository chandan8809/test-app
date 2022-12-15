import React, { useRef, useState } from 'react'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useAuth } from '../contexts/UserContext';
import { Toast } from 'primereact/toast';
import { Password } from 'primereact/password';
import { useRouter } from 'next/router';

const LoginContainer = () => {
  const [username,setUsername]=useState("")
  const [password,setPassword]=useState("")
  const [loadingBtn,setLoadingBtn]=useState(false)
  const [errorLogin,setErrorLogin]=useState(false)
  const { login, userData, setUserData } = useAuth();
  const router = useRouter();


  const handleSubmit=async()=>{
    setLoadingBtn(true)
    const loginResponse = await login(username,password);
    console.log("loginRes",userData)
    setLoadingBtn(false)
    
    const { success, error } = loginResponse ?? {};
    if (error) {
      showError()
      setErrorLogin(true)
    
    } else if (success) {
      setErrorLogin(false)
      router.push(`/collection`)
      
    }
  }
  const toast = useRef(null);

 
  const showError = () => {
    toast.current.show({severity:'error', summary: 'Error', detail:'Wrong Username Or Password', life: 3000});
  }

  console.log("loginRes",username)

  return (
    <div className='pt-20 flex flex-col items-center'>
      <Toast ref={toast} position="bottom-center"/>
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
            className={errorLogin && "p-invalid block"} />
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