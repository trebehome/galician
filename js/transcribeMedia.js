// API key configuration
setAPIkeyStatus();
$("#apiKey").change(setNewAPIkey);

// Validate selected file
$("#inputFile").change(validateFile(["mp3", "mp4", "wav"]));

// Transcription of file
$("#transcribeButton").click(mediaTranslation);

// Call API for transcription
async function mediaTranslation() {
    const API_URL = "https://api.trebesrv.com/transcription/v1/demo/transcribe";

    // Inform user
    $("#responseBad").css("display", "none");
    $("#wait_email").css("display", "none");
    $("#loading_file").css("display", "block");

    // Input file
    let input = $("#inputFile").prop("files")[0];

    if (input != null) {
        // Selected model
        let model = $("#model").val();

        // Get API key and email (optional)
        let auth = localStorage.getItem("apiKey").split("_");
        let apiKey = auth.shift(); // Get first element
        let email = auth.join("_");

        // Define headers
        let headers = email === ""
            ? { 'apikey': apiKey, }
            : { 'apikey': apiKey, 'X-Trebe-Email-To': email, }

        // Request body (form-data)
        let formData = new FormData;
        formData.append("file", input);
        formData.append("apikey", localStorage.getItem("apiKey"));
        formData.append("delivery", $("input[name=email-response]:checked").val())

        // Set language model
        formData.append("languagemodel", model);

        // Set diarization if selected
        if ($("#diarization").is(":checked")) {
            formData.append("diarization", "auto");
        }

        // Check if optional output name is set
        if ($("#output-name").val()) {
            formData.append("outfilename", $("#output-name").val());
        }

        // Check output formats
        if ($("#format-srt").is(":checked")) {
            formData.append("formats", "srt");
        }
        if ($("#format-rtf").is(":checked")) {
            formData.append("formats", "rtf");
        }
        if ($("#format-stl").is(":checked")) {
            formData.append("formats", "stl");
        }
        if ($("#format-vtt").is(":checked")) {
            formData.append("formats", "vtt");
        }
        if ($("#format-txt").is(":checked")) {
            formData.append("formats", "txt");
        }
        if ($("#format-xml").is(":checked")) {
            formData.append("formats", "xml");
        }
        if ($("#format-json").is(":checked")) {
            formData.append("formats", "json");
        }
        if ($("#format-mjson").is(":checked")) {
            formData.append("formats", "mjson");
        }

        // Request body
        let fetchData = {
            method: 'POST',
            headers: headers,
            body: formData,
        };

        // Send request
        fetch(API_URL, fetchData)
            .then(res => res.json())
            .then(data => {
                if (data.message !== undefined || data.error !== undefined) {
                    // Report error to user
                    $("#responseBad").html(data.message || data.error);
                    $("#loading_file").css("display", "none");
                    $("#wait_email").css("display", "none");
                    $("#responseBad").css("display", "block");
                } else {
                    // Result will be sent
                    $("#loading_file").css("display", "none");
                    $("#wait_email").css("display", "block");
                }
            })
            .catch((error) => {
                // Report error to user
                $("#responseBad").html(error);
                $("#loading_file").css("display", "none");
                $("#wait_email").css("display", "none");
                $("#responseBad").css("display", "block");
            });
    } else {
        // Nothing has been selected
        $("#responseBad").html("No file selected");
        $("#loading_file").css("display", "none");
        $("#wait_email").css("display", "none");
        $("#responseBad").css("display", "block");
    }
}