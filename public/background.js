importScripts('libs/axios.min.js');

chrome.runtime.onInstalled.addListener(() => {
    //console.log('Extension installed');
    // Initialize default state
    chrome.storage.local.set({
        state: 'ready',
        result: null,
        filename: null,
        uploadProgress: null,
        showTransition: false,
        errorMessage:null
    });
});

function base64ToArrayBuffer(base64) {
    const binary_string = atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}


        
        
let fileData = []
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'setState') {
        chrome.storage.local.set({ state: request.state }, () => {
            //console.log('State updated:', request.state);
        });
    } else if (request.type === 'setResult') {
        chrome.storage.local.set({ result: request.result }, () => {
            //console.log('Result updated:', request.result);
        });
    } else if (request.type === 'setFileName') {
        chrome.storage.local.set({ filename: request.filename }, () => {
            //console.log('Filename updated:', request.filename);
        });
    } else if (request.type === 'setShowTransition') {
        chrome.storage.local.set({ showTransition: request.showTransition }, () => {
            //console.log('Show Transition updated:', request.showTransition);
        });
    } else if (request.type === "setErrorMessage") {
        chrome.storage.local.set({ errorMessage: request.errorMessage }, () => {
            //console.log('Error message set:', request.errorMessage);
        });
    }
    
    else if (request.type === 'fileComplete' | request.type === "fileChunk") {

        if (request.type === "fileChunk") {
            fileData.push(request.chunk);
        } else if (request.type === "fileComplete") {
            const completeFile = fileData.join('');
            // Handle the complete file
            //console.log("Received complete file:", completeFile);
            const arrayBuffer = base64ToArrayBuffer(completeFile);
            const url = "https://python-whisper-nt5h5ii6iq-uc.a.run.app/speech-to-text";
            axios.post(url, arrayBuffer, {
                onUploadProgress: (progressEvent) => {
                    //console.log("PROGRESS IS MADE "+progressEvent)
                    //console.log(progressEvent)
                    const progress = arrayBuffer.byteLength ? progressEvent.loaded / arrayBuffer.byteLength : null;
                    console.log(progress)
                    chrome.runtime.sendMessage({type:"uploadProgress",uploadProgress:Math.round(100 * progress)/100?progress:null})           
                }
            })
            .then((res) => {
            if (res.data.text) {
                chrome.storage.local.set({ result: res.data.text });
                chrome.storage.local.set({ state: "result" });
            } else {
                throw new Error("No text returned")
            }
            })
            .catch((error)=>{
                //console.error(error);
                chrome.storage.local.set({ state: "error" });
                if(error?.response)
                chrome.storage.local.set({errorMessage:`${error.response.status}: ${error.response.data}`})
                else
                chrome.storage.local.set({errorMessage:`${error.message}`})
            });
            chrome.storage.local.set({ state: "loading" });
            fileData = []; // Clear the buffer
            setTimeout(()=>{
                chrome.storage.local.get("state", (result) => {
                    if (result==="loading") {
                        chrome.runtime.sendMessage({type:"showCancelTranscriptionBtn",showCancelTranscriptionBtn:true})
                    }
                });
            },60000)

        }
    }

    sendResponse({status: 'success'});
    return true; // Indicates that the response is asynchronous
});

// Example of how to retrieve state
// chrome.storage.local.get(['state', 'result', 'filename', 'uploadProgress', 'showTransition'], (items) => {
//     console.log('Current state:', items);
// });