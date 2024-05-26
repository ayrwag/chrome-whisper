import { useEffect, useState } from 'react';
import { extensionEnvironment } from '../../pages/Transcribe/state/StateProvider';

export default function useChromeStorage(key: string, defaultValue: any) {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        // Fetch initial value from chrome.storage.local
        if(extensionEnvironment!=="webpage")
        chrome.storage.local.get([key], (result) => {
            if (result[key] !== undefined) {
                setValue(result[key]);
            }
        });

        // Listen for changes in the storage
        const onChange = (changes: any, namespace: string) => {
            if (namespace === 'local' && changes[key]) {
                setValue(changes[key].newValue);
            }
        };
        if(extensionEnvironment!=="webpage")
        chrome.storage.onChanged.addListener(onChange);

        // Cleanup listener on unmount
        return extensionEnvironment!=="webpage"?() => {
            chrome.storage.onChanged.removeListener(onChange);
        }:undefined;
    }, [key]);

    return {value,setValue};
}