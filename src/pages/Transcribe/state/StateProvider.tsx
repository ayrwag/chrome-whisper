import { createContext, useState } from "react";
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
}
const initState:State = {state: "ready", setState: () => {},setResult: () => {},setFileName:()=>{},setUploadProgress:()=>{},setShowTransition:()=>{}}
export const StateContext = createContext<State>(initState)
const StateProvider = ({children}:{children:React.ReactNode}) => {
    const [state, setState] = useState<"ready"|"loading"|"result"|"error">("ready")
    const [result,setResult] = useState<string|null|undefined>(null)
    const [filename,setFileName] = useState<string|null>(null)
    const [uploadProgress,setUploadProgress] = useState<number|null>(null)
    const [showTransition,setShowTransition] = useState<boolean|undefined>(false)

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
        setShowTransition
    }
    return (
        <StateContext.Provider value={values}>
            {children}
        </StateContext.Provider>
    );
}

export default StateProvider;