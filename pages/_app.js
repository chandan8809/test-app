import '../styles/globals.css'
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css"; 

import { AuthProvider } from '../contexts/UserContext';
import { GlobalDataProvider } from '../contexts/GlobalContext';
import { initializeAxios } from '../utils/axiosUtility';
import Layout from '../components/Layout';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

initializeAxios()

function MyApp({ Component, pageProps }) {
  return (
  <AuthProvider>
    <GlobalDataProvider>
      <Layout>
      <Component {...pageProps} />
      <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            draggable={false}
            pauseOnVisibilityChange
            closeOnClick
            pauseOnHover
        />
      </Layout>
    </GlobalDataProvider>
  </AuthProvider>
  )
}

export default MyApp
