import { useContext } from "react";
import { StateContext, extensionEnvironment } from "../../state/StateProvider";
import H1 from "../../../../components/H1";
import { FaCheck } from "react-icons/fa";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { DotDotDot } from "../../../../components/DotDotDot";
import Button from "../../../../components/Button";

const LoadingPage = () => {
  const { uploadProgress, fadeOut, showCancelTranscriptionBtn,setShowCancelTranscriptionBtn } = useContext(StateContext);

  const handleCancelTranscription = () =>{
    if (extensionEnvironment !== "webpage") {
      chrome.runtime.sendMessage({
        type: "showCancelTranscriptionBtn",
        showCancelTranscriptionBtn: false,
      });
      chrome.runtime.sendMessage({type:"errorMessage",errorMessage:"Transcription was cancelled."})
      chrome.runtime.sendMessage({type:"state",state:"error"})
    } else {
      setShowCancelTranscriptionBtn(false);
    }
  }

  return (
    <div className={` transition-opacity ${fadeOut?"opacity-0":"opacity-100"}`}>
      <H1>
        {uploadProgress&&uploadProgress < 1 ? "AI Model Found" : uploadProgress ? "AI Model Connected" : "Please wait"}
      </H1>
      <ul>
        {uploadProgress && uploadProgress < 1 ? (
          <li>
            <p>Sending your file: {Math.floor(uploadProgress * 100)}%</p>
          </li>
        ) : typeof uploadProgress === "number" ? (
          <li className="flex items-center gap-2">
            <p>File received</p>
            <FaCheck color="green" />
          </li>
        ) : (
          <li>
            <p>CPU cold start 🥶</p>
            <span className="flex gap-2">
              <span className="block w-60">AI model is loading<DotDotDot/><LoadingSpinner /></span>
            </span>

          </li>
        )}
      </ul>
      {uploadProgress === 1 && <div>
        <span className="flex gap-2"><span className="inline-block w-36">Transcribing file<DotDotDot/></span>         <LoadingSpinner /></span>
      </div>}
      {showCancelTranscriptionBtn&&
      (<Button onClick={handleCancelTranscription} className="mt-3">
        Cancel
      </Button>)
      }
    </div>
  );
}

export default LoadingPage;