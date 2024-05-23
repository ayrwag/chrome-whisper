import { useContext } from "react";
import { StateContext } from "../../state/StateProvider";
import H1 from "../../../../global-components/H1";
import { FaCheck } from "react-icons/fa";
import LoadingSpinner from "../../../../global-components/LoadingSpinner";

const LoadingPage = () => {
  const { uploadProgress } = useContext(StateContext);
  return (
    <div>
      <H1>
        {typeof uploadProgress === "number" && uploadProgress < 1
          ? "Uploading file..."
          : "Transcribing..."}
      </H1>
      <ul>
        {uploadProgress && uploadProgress < 1 ? (
          <li>
            <p>Upload progress: {uploadProgress * 100}%</p>
          </li>
        ) : typeof uploadProgress === "number" ? (
          <li className="flex items-center gap-2">
            <p>Uploaded</p>
            <FaCheck color="green" />
          </li>
        ) : (
          <li>
            <p>Loading...</p>
          </li>
        )}
      </ul>
      <div>
        Transcribing... <LoadingSpinner/>
      </div>
    </div>
  );
}

export default LoadingPage;