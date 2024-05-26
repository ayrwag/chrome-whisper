import { createContext, useState } from "react";
import useChromeStorage from "../../../scripts/customHooks/useChromeStorage";

export const extensionEnvironment = undefined //"webpage"
interface State {
    state:"ready"|"loading"|"result"|"error",
    setState:(state:"ready"|"loading"|"result"|"error")=>void,
    result?:string|null,
    setResult:(result:string|null|undefined)=>void,
    filename?:string|null,
    setFileName:(filename:string|null)=>void
    uploadProgress?:number|null,
    setUploadProgress:(progress:number|null)=>void,
    showTransition?:boolean|undefined,
    setShowTransition:(showTransition:boolean|undefined)=>void
    errorMessage?:string|null
    setErrorMessage:(errorMessage:string|null)=>void,
    fadeOut?:boolean,
    setFadeOut:(value:boolean)=>void
}
const initState:State = {state: "ready", setState: () => {},setResult: () => {},setFileName:()=>{},setUploadProgress:()=>{},setShowTransition:()=>{},setErrorMessage:()=>{},setFadeOut:()=>{}}
export const StateContext = createContext<State>(initState)
const StateProvider = ({children}:{children:React.ReactNode}) => {
    // const [state, setState] = useState<"ready"|"loading"|"result"|"error">("ready")
    const {value:state,setValue:setState} = useChromeStorage('state','ready')
    // const [result,setResult] = useState<string|null|undefined>(null)
    const {value:result,setValue:setResult} = useChromeStorage('result',null)
    //const [filename,setFileName] = useState<string|null>(null)
    const {value:filename,setValue:setFileName} = useChromeStorage('filename',null)
    // const [uploadProgress,setUploadProgress] = useState<number|null>(null)
    const {value:uploadProgress,setValue:setUploadProgress} = useChromeStorage('uploadProgress',null)
    //const [showTransition,setShowTransition] = useState<boolean|undefined>(false)
    const {value:showTransition,setValue:setShowTransition} = useChromeStorage('showTransition',false)

    const {value:errorMessage,setValue:setErrorMessage} = useChromeStorage('errorMessage',null)

    const [fadeOut,setFadeOut] = useState(false)

    const values = {
        state,
        setState,
        result,
        setResult,
        filename,
        setFileName,
        uploadProgress,
        setUploadProgress,
        showTransition,
        setShowTransition,
        errorMessage,
        setErrorMessage,
        fadeOut,
        setFadeOut
    }
    return (
        <StateContext.Provider value={values}>
            {children}
        </StateContext.Provider>
    );
}

export default StateProvider;