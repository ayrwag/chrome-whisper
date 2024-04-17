# Chrome Extension: Whisper Transcriber

## Description
This Chrome extension built in Vite + React TS + Tailwindcss utilizes OpenAI's whisper-tiny model to transcribe audio into text directly within your browser. With this extension, you can easily convert spoken words from audio files or streams into text, making it convenient for various applications.

## Installation
To start using the extension, follow these steps:

1. Download the `dist.crx` file or the `dist` directory from this repository.
2. Open Google Chrome.
3. Navigate to `chrome://extensions/`.
4. Enable Developer mode in the top right corner.
5. Drag and drop the `dist.crx` file into the extensions page or click on "Load unpacked" and select the `dist` directory.

## Usage
Once installed, the extension icon will appear in your Chrome toolbar. Simply click on the icon to activate the transcription feature. You can then input audio from your browser tabs, files, or streams, and the extension will transcribe it into text.

## Running Locally
Please note that utilizing the whisper-tiny model requires CPU minutes on the cloud. To optimize performance and reduce reliance on cloud resources, you can follow these steps to download the model locally and host it on `localhost:8080`:

1. Visit the [python-whisper repository](https://github.com/ayrwag/python-whisper).
2. Follow the instructions provided in the repository to download the model locally and set up a localhost server.

For any questions or issues, feel free to reach out to the repository's maintainer. Enjoy transcribing audio effortlessly with Whisper Transcriber!
