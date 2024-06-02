const uploadFileToBackgroundScript = async (file: File, chunkSize: number) => {
    return new Promise((resolve) => {
      let start = 0;
      let end = chunkSize;
      const fileLength = file.size;

      function sendChunk() {
        if (start < fileLength) {
          const chunk = file.slice(start, end);
          chrome.runtime.sendMessage({ type: "fileChunk", chunk: chunk });

          start = end;
          end = start + chunkSize;

          setTimeout(sendChunk, 0); // Continue sending the next chunk
        } else {
          resolve({ type: "fileComplete"});
        }
      }

      sendChunk();
    });
  }
  export default uploadFileToBackgroundScript;