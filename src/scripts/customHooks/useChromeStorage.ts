import { useEffect, useState } from 'react';

export default function useChromeStorage(key: string, defaultValue: any) {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        // Fetch initial value from chrome.storage.local
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

        chrome.storage.onChanged.addListener(onChange);

        // Cleanup listener on unmount
        return () => {
            chrome.storage.onChanged.removeListener(onChange);
        };
    }, [key]);

    return value;
}