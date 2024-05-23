import { useContext, useEffect, useState } from "react";
import { StateContext } from "../../state/StateProvider";
import { FiCopy } from "react-icons/fi";
import { MdDownload } from "react-icons/md";
import Button from "../../../../global-components/Button";



const ResultPage = () => {
    const {result,setShowTransition,filename,setUploadProgress} = useContext(StateContext)
    const [disableDownloadBtn,setDisableDownloadBtn] = useState(false)
    const [copied,setCopied] = useState(false)

    const runEffectAgain = false
    useEffect(()=>{
      if(copied)setTimeout(()=>setCopied(false),3000)
    },[runEffectAgain,copied])
    setUploadProgress(null)
    const handleDownload = () => {
        setDisableDownloadBtn(true)
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-based
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const formattedDate = `${year}${month}${day}_${hours}${minutes}`;
        function removeExtensionFromFilename (filename:string|null|undefined) {
          if (!filename) return `[chrome whisper] ${formattedDate} transcription`
          const lastDotIndex = filename.lastIndexOf('.')
          if (lastDotIndex === -1 || filename.slice(lastDotIndex).length>4){
            return filename
          }
          return filename.slice(0,lastDotIndex)
        }       
        const filenameWithTxtExt = `${removeExtensionFromFilename(filename)} [chrome whisper].txt`;

        const element = document.createElement("a");
        const file = new Blob([result??''], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = filenameWithTxtExt;
        document.body.appendChild(element);
        element.click();

        setTimeout(()=>setDisableDownloadBtn(false),2500)
    };

    const handleCopyToClipboard = () => {
        if (result) {
            navigator.clipboard.writeText(result).then(() => {
              setCopied(true)
                // Optional: Display a message or indication that the text was copied.
                console.log('Text copied to clipboard');
                
            }).catch(err => {
                console.error('Failed to copy text to clipboard', err);
            });
        }
    };

    return (
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-semibold mb-2">Transcription Result:</h1>
          <p className="w-[80%] max-h-56 overflow-scroll mb-4 border-black border-[0.5px] py-4 px-4 rounded">{result}</p>
          <div className="flex gap-4 w-[80%] mb-4 px-2 relative">
            <button onClick={handleCopyToClipboard} className={`flex gap-2 items-center ${copied?"text-gray-500":"text-black"}`}>
              <FiCopy className="w-[0.75rem] h-[0.75rem]" />
              {!copied?<p>copy</p>:<p className="text-sm min-w-max">copied to clipboard</p>}
            </button>
            <button disabled={disableDownloadBtn} autoFocus onClick={handleDownload} className={`${copied?" opacity-0 ":"transition-all" }  flex gap-2 items-center mr-auto`}>
              <MdDownload className="w-[0.75rem] h-[0.75rem]" />
              <p className="">download .txt</p>
            </button>
          </div>
          <Button onClick={()=>setShowTransition(true)}>I'm done</Button>
        </div>
    );
}

export default ResultPage;