import { useState, useCallback, useEffect, useContext } from "react";
import {useDropzone} from 'react-dropzone'
import Button from "../../../../components/Button";
import HighlightSvg from "../../../../components/HighlightSvg";
import GridSvg from "../../../../components/GridSvg";
import { StateContext, extensionEnvironment } from "../../state/StateProvider";
import axios from "axios";
import ModalOverlay from "../../../../components/ModalOverlay";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import uploadFileToBackgroundScript from "../../../../scripts/uploadFileToBackgroud";
const ReadyPage = () => {
    const [fileData, setFileData] = useState<string|ArrayBuffer|null>(null)
    const [preview,setPreview] = useState<string|ArrayBuffer|null>(null)
    const [fileLoadingProgress,setFileLoadingProgress] = useState<number|null>(null)
    const [hovered, setHovered] = useState(false);
    const [alert,setAlert] = useState('')
    const [transcriptionStarted,setTranscriptionStarted] = useState(false)
    const {setFileName,setUploadProgress,setState,setResult,setErrorMessage,setFadeOut,fadeOut,allowUploadsFromURL} = useContext(StateContext)

    useEffect(()=>{
      queryTheActiveTab()
    },[])

    if(extensionEnvironment!=="webpage"){
    useEffect(() => {
      const messageListener = (request:any) => {

        if (request.action === "transcriptionStarted") {
          console.log("transcriptionStarted")
          setTranscriptionStarted(true);
        }
      };

        chrome.runtime.onMessage.addListener(messageListener);

    
      // Cleanup function
      return () => {
        chrome.runtime.onMessage.removeListener(messageListener);
      };
    }, []);
  }

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
      if(extensionEnvironment!=="webpage"){
        chrome.runtime.sendMessage({
          type: "setFileName",
          filename: acceptedFiles[0].name,
        });
      } else setFileName(acceptedFiles[0].name)

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
      if (
        typeof acceptedFiles[0] === "undefined" ||
        fileData === null ||
        typeof fileData === "string"
      )
        return;
        const worker = new Worker("worker.js");
        worker.postMessage(fileData);

        worker.onmessage = async function (e) {
          const base64String = e.data;
          // Use the base64 string for further processing or state updates
          if (extensionEnvironment !== "webpage") {
            const result = await uploadFileToBackgroundScript(base64String, 1024 * 1024)
            chrome.runtime.sendMessage(result);
          } else {
            const url =
              "https://python-whisper-nt5h5ii6iq-uc.a.run.app/speech-to-text";
              axios
                .post(url, fileData, {
                  onUploadProgress: (progressEvent) => {

                    const progress = progressEvent.total
                      ? progressEvent.loaded / progressEvent.total
                      : null;
                      console.log(progress)
                    setUploadProgress(progress);
                  },
                })
                .then((res) => {
                  if (res.data.text) {
                    setResult(res.data.text);
                    setState("result");
                  } else {
                    throw new Error("No text returned");
                  }
                })
                .catch((error: any) => {
                  //console.error(error);
                  setState("error");
                  if (error?.response)
                    setErrorMessage(
                      `${error.response.status}: ${error.response.data}`
                    );
                  else setErrorMessage(`${error.message}`);
                });

            setTranscriptionStarted(false);
            setFadeOut(true)
            setTimeout(()=>{
              setState("loading")
              setTimeout(()=>{
                setFadeOut(false)
              },100)
            },600)
          }
        };

        worker.onerror = function (error) {
          console.error("Worker error:", error);
        };
      

      // chrome.runtime.sendMessage({
      //   type: "uploadFile",
      //   transportData: transportData,
      //   totalSize:acceptedFiles[0].size
      // });
    }
  
  
    return (
      <form
        onSubmit={handleOnSubmit}
        className={`flex flex-col items-center h-full w-full justify-center relative transition-opacity duration-[600s] ${fadeOut?"opacity-0":"opacity-100"}`}
      >
        {transcriptionStarted ?
          <ModalOverlay>
            <div className="absolute h-full w-full bg-black opacity-50 z-10" />
            <div className="z-20 absolute">
              <div className="bg-white rounded p-12 flex flex-col items-center">
                <span>Large file. Please wait</span>
                <LoadingSpinner />
              </div>
            </div>
          </ModalOverlay>
          :null
        }
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
                preview && acceptedFiles.length > 0 ? "h-48 mt-12" : ""
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
                      <p>Drag 'n' drop an audio file, or click here</p>
                    )}
                  </button>
                )}
              </div>
              {preview && (
                <audio controls className="mt-12 mb-4">
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
        {allowUploadsFromURL ?<button className="mb-6 text-sm underline text-[#147f14]" onClick={async () => {
            try {
              const {tabId} = await chrome.storage.local.get("tabId")
              chrome.tabs.sendMessage(tabId,"fetchAndUploadAudioFile")
            } catch (error) {
                console.error('Error fetching or uploading file:', error);
            }
        }}>Use audio file from this page</button>:null}
        <div className="relative w-full flex flex-col items-center">
          <Button
            className={"max-w-max"}
            enabled={fileIsReady}
            type={"submit"}
            onClick={() => {
              if (!fileIsReady) {
                setAlert("select an audio file first");
              } else {
                setTimeout(()=>{
                  setTranscriptionStarted(true);
                },1000)

              }
            }}
          >
            Transcribe
          </Button>
          {alert ? (
            <div className="bg-gray-500 top-[110%] text-white text-sm rounded absolute p-2">
              {alert}
            </div>
          ) : (
            ""
          )}
        </div>
        <HighlightSvg />
        <img
          className="absolute -z-20 opacity-50"
          src="left-gradient@1x.webp"
        />
        <img
          className="absolute -z-20 opacity-40 animate-pulse-slow"
          src="right-gradient@1x.webp"
        />
        <GridSvg />
      </form>
    );
}

export default ReadyPage;

async function queryTheActiveTab() {
  if(extensionEnvironment==="webpage")return
  chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
    if (tabs[0]) {
      console.log("Tab id",tabs[0].id!)
      try {
        const response = await chrome.tabs.sendMessage(tabs[0].id!,"queryTheActiveTab")
        console.log(response)
        if(response?.status!=="pass") return
        chrome.storage.local.set({tabId:tabs[0].id})
        chrome.runtime.sendMessage({type:"allowUploadsFromURL",allowUploadsFromURL:true})
      } catch (error) {
        console.error(error)
        chrome.runtime.sendMessage({type:"allowUploadsFromURL",allowUploadsFromURL:false})
      }
    }
  });
}