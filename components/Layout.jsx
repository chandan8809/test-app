
import { ProgressSpinner } from 'primereact/progressspinner';
import Header from './common/Header';
import { useRouter } from 'next/router';
import { useGlobalData } from '../contexts/GlobalContext';


export default function Layout({ children }) {
 const {globalLoader} =useGlobalData()
 const router = useRouter();

if (router.pathname.includes('/login')) {
    return (
        <div className='max-w-screen-md mx-auto'>
          <Header/>
          <main>
            <div>{children}</div>
          </main>
           {globalLoader && ( 
            <div className='modal-overlay grid grid-cols-1 gap-2 place-content-center z-100'>
                <ProgressSpinner  style={{width: '75px', height: '75px'}} strokeWidth="6"></ProgressSpinner>
            </div>
            )} 
        </div>
      );
}
return (
  <div className='max-w-screen-md mx-auto'>
    <main>
      <div>{children}</div>
    </main>
     {globalLoader && ( 
      <div className='modal-overlay grid grid-cols-1 gap-2 place-content-center z-100'>
          <ProgressSpinner  style={{width: '75px', height: '75px'}} strokeWidth="6"></ProgressSpinner>
      </div>
      )} 
  </div>
);

}
