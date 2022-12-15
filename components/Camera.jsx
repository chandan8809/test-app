import React, {  useRef } from "react";
import Webcam from "react-webcam";
import Image from 'next/image'
import { Button } from "primereact/button";
import { useGlobalData } from "../contexts/GlobalContext";

const videoConstraints = {
  width: 350,
  facingMode: "environment"
};

const Camera = () => {
  const webcamRef = useRef(null);
  //const [url, setUrl] = React.useState(null);
  const { moneyDepositeUrl,setMoneyDepositeUrl}=useGlobalData()

  const capturePhoto = React.useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    //setUrl(imageSrc);
    setMoneyDepositeUrl(imageSrc)
    
  }, [webcamRef]);

  const onUserMedia = (e) => {
    console.log(e);
  };

  return (
    <>
      {!moneyDepositeUrl && <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        onUserMedia={onUserMedia}
      />}
      
     {!moneyDepositeUrl &&<div className="flex justify-evenly pt-6">
        <Button 
          label="Click"
          onClick={capturePhoto}
          icon="pi pi-check" className="p-button-rounded  p-button-success" aria-label="Submit"
           />
      </div>}

      {/* <button onClick={capturePhoto}>Capture</button>
      <button onClick={() => setUrl(null)}>Refresh</button> */}

      {moneyDepositeUrl && (
        <div className="pt-2">
          <Image src={moneyDepositeUrl} alt="Screenshot" width={300} height={200}/>
        </div>
      )}

      {moneyDepositeUrl &&<div className="flex justify-evenly pt-1">
        <Button 
          label="Retake"
          onClick={() => {
             setMoneyDepositeUrl(null)
            }} 
          icon="pi pi-times" className="p-button-rounded p-button-danger p-button-outlined" aria-label="Cancel" 
          />
      </div>} 
    </>
  );
};

export default Camera;
