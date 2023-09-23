import { SAMAAN_HOST_URL } from '../../constants/urlContants';

async function checkExternalServices() {
    try {
      const response = await fetch(`${SAMAAN_HOST_URL}/api/server-status/?format=json`);
      const data = await response.json();
      
      if(data){
         return true;
      }
      else{
         return false
      }
    } catch (error) {
      return false;
    }
  }


export default async function handler(req, res) {

    try {
        const isReady = await checkExternalServices();
    
        if (isReady) {
          res.status(200).json({ status: 'Application is ready' });
        } else {
          res.status(503).json({ status: 'Application is still starting up or external services are unavailable' });
        }
    }
    catch (error) {
        console.error('Error checking application readiness:', error);
        res.status(500).json({ status: 'Internal Server Error' });
    }
    
}