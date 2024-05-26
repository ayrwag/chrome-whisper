import { useEffect, useState } from 'react';
import { extensionEnvironment } from '../../pages/Transcribe/state/StateProvider';

export default function useChromeOnMessage(key: string, defaultValue: any) {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        //check local storage for value on extension re-init
        // if(extensionEnvironment!=="webpage")
        // chrome.storage.local.get([key], (result) => {
        //     if (result[key] !== undefined) {
        //         setValue(result[key]);
        //     }
        // });

        const onMessage = (message:any,sender:chrome.runtime.MessageSender,sendResponse:(response?: any) => void)=>{
            console.log(sender)
            if(message.type===key) {setValue(message[key])
            chrome.storage.local.set({ key: message[key] });}
            sendResponse({status:"success"})
            return true
        }

        if(extensionEnvironment!=="webpage")
        chrome.runtime.onMessage.addListener(onMessage)

        // Cleanup listener on unmount
        return extensionEnvironment!=="webpage"?() => {
            chrome.runtime.onMessage.removeListener(onMessage)
        }:undefined;
    }, [key]);

    return {value,setValue};
}