import { useContext } from "react";
import { StateContext, extensionEnvironment } from "./state/StateProvider";
import ReadyPage from "./screens/Ready/ReadyPage";
import LoadingPage from "./screens/Loading/LoadingPage";
import ResultPage from "./screens/Result/ResultPage";
import TransitionHandler from "../../components/transitions/TransitionHandler";
import Done from "./screens/Result/screens/Done";
import Button from "../../components/Button";

const App = () => {
    const {state,setState,errorMessage,setErrorMessage} = useContext(StateContext)
    return (
      <>
      <TransitionHandler page2={<Done />}>
        {state === "ready" ? (
          <ReadyPage />
        ) : state === "loading" ? (
          <LoadingPage />
        ) : state === "result" ? (
          <ResultPage />
        ) : (
          <div className="flex flex-col items-center">
            <h1 className=" text-lg font-semibold">Error</h1>
            <p>{errorMessage}</p>
            <p className="">Note: GCR does not support file sizes &gt; 32mb</p>
            <Button
              className={"text-sm"}
              onClick={extensionEnvironment!=="webpage"?() => {
                chrome.runtime.sendMessage({
                  type: "setState",
                  state: "ready",
                });
                chrome.runtime.sendMessage({
                  type: "errorMessage",
                  errorMessage: null,
                });
              }:
              () => {
                setState("ready")
                setErrorMessage(null)
              }
            }
            >
              Return Home
            </Button>
          </div>
        )}
      </TransitionHandler>
      <div id="modal-placeholder" className="h-full w-full absolute top-0 flex justify-center items-center"/>
      </>
    );
}

export default App;