// API key configuration
setAPIkeyStatus();
$("#apiKey").change(setNewAPIkey);

// Clear text from input and output
$("#clearButton").click(clearTextBox);

// Copy to clipboard
$("#clipboard-tkonline").click(copyToClipboard);

// Control buttons
const recordStart = document.querySelector("#recordStartButton");
const recordStop = document.querySelector("#recordEndButton");

let mediaRecorder = null; // Recorder
let chunks = [];          // Data chunks

// Start recording
recordStart.onclick = () => {
    // Require access to microphone
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            // Recorder not set
            if (mediaRecorder === null) {
                // Create recorder
                mediaRecorder = new MediaRecorder(stream, { audioBitsPerSecond: 16000 });

                // Event listener when stopped
                mediaRecorder.onstop = () => {
                    // Process chunks
                    const blob = new Blob(chunks, { "type": "audio/wav; codecs=0" });

                    // Reset chunks
                    chunks = [];

                    // Set audio source
                    document.querySelector("audio").src = URL.createObjectURL(blob);

                    // Transcribe audio
                    audioTranscribe(blob);
                }

                // Event listener when data is sent
                mediaRecorder.ondataavailable = (e) => {
                    chunks.push(e.data);
                }
            }

            mediaRecorder.start(); // Start recording

            // Enable/disable control buttons
            $("#recordStartButton").prop("disabled", true);
            $("#recordEndButton").prop("disabled", false);

        }, (err) => console.error("Error: " + err));
}

// Stop recording
recordStop.onclick = () => {
    mediaRecorder.stop();  // Stop recording

    // Enable/disable control buttons
    $("#recordStartButton").prop("disabled", false);
    $("#recordEndButton").prop("disabled", true);
}

// Convert blob to base64
function blobToBase64(blob) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

// Transcription of file
async function audioTranscribe(blob) {
    const API_URL = "https://api.trebesrv.com/transcription/v1/online/transcribe";

    // Inform user
    $("#loading_file").css("display", "block");

    // Audio to transcribe
    let audioData = await blobToBase64(blob);
    let audio = audioData.substr(audioData.indexOf(',') + 1);

    // Ensure there is something to transcribe
    if (audio !== "") {
        let model = $("#model").val(); // Language from select

        // Get API key and email (optional)
        let auth = localStorage.getItem("apiKey").split("_");
        let apiKey = auth.shift(); // Get first element

        // Request body
        let fetchData = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': apiKey,
            },
            body: JSON.stringify({
                languagemodel: model,
                audio: audio,
            }),
        };

        // Send request
        fetch(API_URL, fetchData)
            .then(res => res.json())
            .then(data => {
                $("#outputTranscription").val(data.text || data.message || data.error); // Update output
                $("#loading_file").css("display", "none");
            })
            .catch((error) => {
                $("#outputTranscription").val(error); // Show error message
            });
    }
}

// Copy output text to clipboard
function copyToClipboard() {
    let text = $("#outputTranscription");
    text.select();
    navigator.clipboard.writeText(text.val());
}