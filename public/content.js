console.log("whisper content.js")
//write a content.js script that will take the audio file from the current URL and run
//the following function 
const uploadFileToBackgroundScript = async (file, chunkSize) => {
    return new Promise((resolve) => {
      let start = 0;
      let end = chunkSize;
      const fileLength = file.length;

      function sendChunk() {
        if (start < fileLength) {
          const chunk = file.slice(start, end);
          chrome.runtime.sendMessage({ type: "fileChunk", chunk: chunk });

          start = end;
          end = start + chunkSize;

          setTimeout(sendChunk, 0); // Continue sending the next chunk
        } else {
          resolve({ type: "fileComplete" });
        }
      }

      sendChunk();
    });
  }

async function fetchAndUploadAudioFile() {
    try {
        console.log("fetching audio file")
        const url = window.location.href; // or any other URL string
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error('Failed to fetch the audio file');
        }
        const blob = await response.blob();
        const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/flac', 'audio/x-m4a', 'audio/mpeg'];
        if (!allowedTypes.includes(blob.type)) {
            throw new Error('The fetched file is not a supported audio type');
        }
        const fileExtension = blob.type.split('/')[1];
        const fileName = url.substring(url.lastIndexOf('/') + 1);
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async function() {
        const base64data = reader.result;
        const base64String = base64data.split(',')[1]; // Remove the data URL part
        const result = await uploadFileToBackgroundScript(base64String, 1024 * 1024);
        chrome.runtime.sendMessage(result)
        };
    } catch (error) {
        console.error('Error fetching or uploading file:', error);
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("sender", sender);
  if (message === "fetchAndUploadAudioFile") {
    console.log("fetchAndUploadAudioFile")
      setTimeout(()=>{
        chrome.runtime.sendMessage({action:"transcriptionStarted"})
      },1000)
      fetchAndUploadAudioFile()
      .then(()=>{
        sendResponse({ type: "fileUploaded" });
      })
      .catch((error)=>{
        sendResponse({ type: "fileUploadFailed", error: error });
      })
  } else if (message === "queryTheActiveTab") {
    try {
      fetch(window.location.href)
      .then((response)=>{
      if (!response.ok) {
        throw new Error("Failed to fetch the audio file");
      }

      response.blob().then((blob) => {
        console.log(blob.type);
        console.log(blob);
        const allowedTypes = [
          "audio/mp3",
          "audio/wav",
          "audio/flac",
          "audio/x-m4a",
          "audio/mpeg",
        ];
        if (!allowedTypes.includes(blob.type)) {
          throw new Error("The fetched file is not a supported audio type");
        }
        sendResponse({ status: "pass" });
      });
})
    } catch (error) {
        console.error(error)
    }
  }
  return true
});

