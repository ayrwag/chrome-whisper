import { useContext, useEffect } from "react";
import { StateContext, extensionEnvironment } from "../../pages/Transcribe/state/StateProvider";
import Container from "../containers/Container";

const TransitionHandler = ({children,page2}:{children:React.ReactNode,page2:React.ReactNode}) => {
    const retrigger = false
    const {setState ,showTransition,setShowTransition} = useContext(StateContext)
    useEffect(()=>{
        if(showTransition){
            setTimeout(()=>{
              //setState("ready")
              if(extensionEnvironment!=="webpage")
              chrome.runtime.sendMessage({
                type:"setState",
                state:"ready"
              })
              else setState("ready")
            },150)
            setTimeout(()=>{
                //setShowTransition(false)
                if(extensionEnvironment!=="webpage")
                chrome.runtime.sendMessage({
                  type:"setShowTransition",
                  showTransition:false
                })
                else setShowTransition(false)

            },1850)
        }
    },[retrigger,showTransition])
    return (
      <div className="h-full w-full relative ">
        <Container>
          <div
            className={`transition-opacity absolute z-10 ${
              !showTransition ? "opacity-100" : "opacity-0"
            }`}
          >
            {children}
          </div>
        </Container>

          <div className={`transition-opacity absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
              showTransition ? "opacity-100" : "opacity-0"
            }`}>
              {page2}
          </div>
        </div>
    );
}

export default TransitionHandler;