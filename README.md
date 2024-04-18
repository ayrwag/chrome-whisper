# Chrome Extension: Whisper Transcriber

## Description
This Chrome extension built with ***Vite + React TS + Tailwindcss*** utilizes OpenAI's whisper-tiny model to transcribe audio into text directly within your browser. With this extension, you can easily convert spoken words from audio files or streams into text, making it convenient for various applications.

## Installation
To start using the extension, follow these steps:

1. Download the `dist` directory from this repository.
2. Open Google Chrome.
3. Navigate to `chrome://extensions/`.
4. Enable Developer mode in the top right corner.
5. click on "Load unpacked" and select the `dist` directory. (make sure it is unzipped)

## Usage
Once installed, the extension icon will appear in your Chrome toolbar. Simply click on the icon to activate the transcription feature. You can then input audio from your browser tabs, files, or streams, and the extension will transcribe it into text. (I've provided `demo audio.mp3` to use as an example)

## Running Locally
Please note that utilizing the whisper-tiny model would require using CPU minutes on the cloud. I can't guarantee that my endpoint will remain open. You can follow these steps to download the model locally and host it on `localhost:8080`:

1. Visit the [python-whisper repository](https://github.com/ayrwag/python-whisper).
2. Follow the instructions provided in the repository to download the model locally and set up a localhost server (just a few commands).
3. The extension should automatically use `localhost:8080` as the fallback for my endpoint and transcribe files using the locally hosted model!

For any questions or issues, feel free to reach out to the repository's maintainer. Enjoy transcribing audio effortlessly with Chrome-Whisper Transcriber!
