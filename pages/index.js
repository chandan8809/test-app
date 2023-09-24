import { ProgressBar } from 'primereact/progressbar';
import { useEffect } from 'react';
import { useRouter } from 'next/router';



export default function Home() {
  const router = useRouter();
  const localStorageKey = 'user';
  const getSessionUserData = () => {
      return JSON.parse(localStorage.getItem(localStorageKey));
  };

  const logout = () => {
    localStorage.removeItem(localStorageKey);
    router.push({
        pathname: '/login',
    });
  };


  // useEffect(() => {
  //   const sessionUserData = getSessionUserData();
  //   if (sessionUserData) {
  //       if (!sessionUserData.user_data) {
  //           router.push({
  //               pathname: '/login',
  //           });
  //       }
  //       else{
  //         router.push({
  //           pathname: '/collection',
  //         });
  //       }
  //   } else {
  //       logout();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <div className='flex flex-col  items-center  h-screen gap-6'>
      
      <div className="flex flex-col card text-4xl items-center gap-5 pt-36">
                <h5>Loading...</h5>
                <ProgressBar mode="indeterminate" style={{ height: '6px', width:"300px" }}></ProgressBar>
            </div>
     
    </div>
  )
}
