import { useContext } from "react";
import { StateContext } from "../../state/StateProvider";
import H1 from "../../../../global-components/H1";
import { FaCheck } from "react-icons/fa";
import LoadingSpinner from "../../../../global-components/LoadingSpinner";
import { DotDotDot } from "../../../../global-components/DotDotDot";

const LoadingPage = () => {
  const { uploadProgress } = useContext(StateContext);
  return (
    <div>
      <H1>
        Please wait.
      </H1>
      <ul>
        {uploadProgress && uploadProgress < 1 ? (
          <li>
            <p>Upload progress: {Math.floor(uploadProgress * 100)}%</p>
          </li>
        ) : typeof uploadProgress === "number" ? (
          <li className="flex items-center gap-2">
            <p>File received</p>
            <FaCheck color="green" />
          </li>
        ) : (
          <li>
            <p>CPU cold start.</p>
            <p className="inline-block w-60">AI model is launching<DotDotDot/></p>
          </li>
        )}
      </ul>
      {uploadProgress === 1 && <div>
        <span className="flex gap-2"><span className="inline-block w-32">Transcribing file<DotDotDot/></span> <LoadingSpinner /></span>
      </div>}
    </div>
  );
}

export default LoadingPage;