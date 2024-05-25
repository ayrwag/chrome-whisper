import { useState, useCallback, useEffect } from "react";
import {useDropzone} from 'react-dropzone'
import Button from "../../../../global-components/Button";
import HighlightSvg from "../../../../global-components/HighlightSvg";
import GridSvg from "../../../../global-components/GridSvg";
const ReadyPage = () => {
    const [fileData, setFileData] = useState<string|ArrayBuffer|null>(null)
    const [preview,setPreview] = useState<string|ArrayBuffer|null>(null)
    const [fileLoadingProgress,setFileLoadingProgress] = useState<number|null>(null)
    const [hovered, setHovered] = useState(false);
    const [alert,setAlert] = useState('')

    const runEffectAgain = false

    useEffect(()=>{
      if(alert) setTimeout(()=>setAlert(''),3000)
    },[runEffectAgain,alert])

  
    const onDrop = useCallback((acceptedFiles: File[]) => {
      setPreview(null);
      setFileLoadingProgress(null)
      // Do something with the files
      const file = new FileReader();
      const preview = new FileReader();

      preview.onload = function () {
        // console.log("preview", preview.result);
        setPreview(preview.result);
      };

      preview.readAsDataURL(acceptedFiles[0]);
      //setFileName(acceptedFiles[0].name)
      chrome.runtime.sendMessage({
        type: 'setFileName',
        filename: acceptedFiles[0].name
    });

      file.onprogress = function (event) {
        if (event.lengthComputable) {
          const progress = event.loaded / event.total;
          setFileLoadingProgress(progress);
        }
      };

      file.onload = function () {
        // console.log("file", file.result);
        setFileData(file.result);
        setFileLoadingProgress(null)
      };

      file.readAsArrayBuffer(acceptedFiles[0]);
    }, []);
    const {acceptedFiles, getRootProps, getInputProps, isDragActive} = useDropzone({onDrop,accept:{
        'audio/*':['.mp3','.wav','.ogg','.flac','.webm']
    },
    onFileDialogOpen:()=>setPreview(null)})
    const fileIsReady = preview && acceptedFiles.length > 0 ? true:false
  
    async function handleOnSubmit(e: React.SyntheticEvent) {
      e.preventDefault();
      if (typeof acceptedFiles[0] === "undefined" || fileData === null || typeof fileData === "string") return;
    
      function arrayBufferToBase64(fileData:ArrayBuffer) {
        let binary = '';
        const bytes = new Uint8Array(fileData);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
    
    const base64String = arrayBufferToBase64(fileData);

    const result = await(async (file, chunkSize) => {
      return new Promise((resolve) => {
        let start = 0;
        let end = chunkSize;
        const fileLength = file.length;

        function sendChunk() {
          if (start < fileLength) {
            const chunk = file.slice(start, end);
            chrome.runtime.sendMessage({ type: "fileChunk", chunk: chunk });

            start = end;
            end = start + chunkSize;

            setTimeout(sendChunk, 0); // Continue sending the next chunk
          } else {
            resolve({ type: "fileComplete" })
          }
        }

        sendChunk();
      });
    })(base64String,1024*1024);
    chrome.runtime.sendMessage(result)

      // chrome.runtime.sendMessage({
      //   type: "uploadFile",
      //   transportData: transportData,
      //   totalSize:acceptedFiles[0].size
      // });
    }
  
  
    return (
      <form
        onSubmit={handleOnSubmit}
        className={`flex flex-col items-center h-full justify-center relative`}
      >
        <h1 className="text-xl font-semibold">Transcribe Audio Files</h1>
        {fileLoadingProgress !== null ? (
          <div className="h-48 my-12 flex flex-col justify-center">
            <div className="w-[200px] bg-gray-200 rounded-full dark:bg-gray-700 my-2">
              <div
                className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                style={{ width: `${fileLoadingProgress * 100}%` }}
              >
                Loading file: {Math.round(fileLoadingProgress * 100)}%
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              className={`${
                preview && acceptedFiles.length > 0 ? "h-48 my-12" : ""
              }`}
            >
              <div
                onMouseOver={() => setHovered(true)}
                onMouseOut={() => setHovered(false)}
                {...getRootProps()}
                className={`
                cursor-pointer
                ${
                  !preview
                    ? `bg-white flex items-center h-48 my-12 mx-4 border-dashed border-2 ${
                        hovered ? "border-gray-400 scale-105" : "border-black"
                      } px-12 rounded`
                    : "my-4"
                }`}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <button
                    className={`min-h-max w-full ${
                      preview && acceptedFiles.length > 0
                        ? "font-bold"
                        : "font-normal"
                    } ${hovered ? "text-gray-400" : ""}`}
                  >
                    {preview && acceptedFiles.length > 0 ? (
                      `"` + acceptedFiles[0].name + `"`
                    ) : (
                      <p>
                        Drag 'n' drop an audio file, or click here
                      </p>
                    )}
                  </button>
                )}
              </div>
              {preview && (
                <audio controls className="mb-4">
                  <source
                    src={preview ? preview.toString() : undefined}
                    type="audio/mpeg"
                  />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          </>
        )}
        <div className="relative w-full flex flex-col items-center">
        <Button className={"max-w-max"} enabled={fileIsReady} onClick={()=>{if(!fileIsReady){setAlert('select an audio file first')}}}>Transcribe</Button>
        {alert?<div className="bg-gray-500 top-[110%] text-white text-sm rounded absolute p-2">{alert}</div>:""}
        </div>
        <HighlightSvg/>
        <img className="absolute -z-20 opacity-50" src="left-gradient@1x.webp"/>
        <img className="absolute -z-20 opacity-40 animate-pulse-slow" src="right-gradient@1x.webp"/>
        <GridSvg/>
      </form>
    );
}

export default ReadyPage;