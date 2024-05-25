import { useContext } from "react";
import { StateContext } from "./state/StateProvider";
import ReadyPage from "./screens/Ready/ReadyPage";
import LoadingPage from "./screens/Loading/LoadingPage";
import ResultPage from "./screens/Result/ResultPage";
import TransitionHandler from "../../global-components/transitions/TransitionHandler";
import Done from "./screens/Result/screens/Done";
import Button from "../../global-components/Button";

const App = () => {
    const {state,errorMessage} = useContext(StateContext)
    return (
        <TransitionHandler page2={<Done/>}>
        {state === "ready"?
        <ReadyPage/>
        : state === "loading"?
        <LoadingPage/>
        : state === "result"?
        <ResultPage/>
        :
        <div>
            <h1>Error</h1>
            <p>{errorMessage}</p>
            <Button className={"text-sm"} onClick={()=>{chrome.runtime.sendMessage({type:"setState",state:'ready'});chrome.runtime.sendMessage({type:"errorMessage",errorMessage:null})}}>Return Home</Button>
        </div>}
        </TransitionHandler>
    );
}

export default App;