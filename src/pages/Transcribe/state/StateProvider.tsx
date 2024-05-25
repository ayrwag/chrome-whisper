import { createContext } from "react";
import useChromeStorage from "../../../scripts/customHooks/useChromeStorage";
interface State {
    state:"ready"|"loading"|"result"|"error",
    setState?:(state:"ready"|"loading"|"result"|"error")=>void,
    result?:string|null,
    setResult?:(result:string|null|undefined)=>void,
    filename?:string|null,
    setFileName?:(filename:string|null)=>void
    uploadProgress?:number|null,
    setUploadProgress?:(progress:number|null)=>void,
    showTransition?:boolean|undefined,
    setShowTransition?:(showTransition:boolean|undefined)=>void
    errorMessage?:string|null
}
const initState:State = {state: "ready", setState: () => {},setResult: () => {},setFileName:()=>{},setUploadProgress:()=>{},setShowTransition:()=>{}}
export const StateContext = createContext<State>(initState)
const StateProvider = ({children}:{children:React.ReactNode}) => {
    // const [state, setState] = useState<"ready"|"loading"|"result"|"error">("ready")
    const state = useChromeStorage('state','ready')
    // const [result,setResult] = useState<string|null|undefined>(null)
    const result = useChromeStorage('result',null)
    //const [filename,setFileName] = useState<string|null>(null)
    const filename = useChromeStorage('filename',null)
    // const [uploadProgress,setUploadProgress] = useState<number|null>(null)
    const uploadProgress = useChromeStorage('uploadProgress',null)
    //const [showTransition,setShowTransition] = useState<boolean|undefined>(false)
    const showTransition = useChromeStorage('showTransition',false)

    const errorMessage = useChromeStorage('errorMessage',null)

    const values = {
        state,
        //setState,
        result,
        //setResult,
        filename,
        //setFileName,
        uploadProgress,
        //setUploadProgress,
        showTransition,
        //setShowTransition
        errorMessage
    }
    return (
        <StateContext.Provider value={values}>
            {children}
        </StateContext.Provider>
    );
}

export default StateProvider;