// API key configuration
setAPIkeyStatus();
$("#apiKey").change(setNewAPIkey);

// Clear text from input and output
$("#clearButton").click(clearTextBox);

// Translate text
$("#translateButton").click(textTranslation);

// Swap languages
$("#swapLanguages").click(swapLang);

// Copy to clipboard
$("#clipboard").click(copyToClipboard);

// Call API for text translation
async function textTranslation() {
    const API_URL = "https://api.trebesrv.com/translation//v1/demo/translate";

    let model = $("#model").val(); // Language from select
    let languages = model.split("2"); // Get both languages
    let inputText = $("#inputText").val(); // Input text

    if (inputText !== "") {
        // Get API key and email (useless)
        let auth = localStorage.getItem("apiKey").split("_");
        let apiKey = auth.shift();

        // Request body
        let fetchData = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': apiKey,
            },
            body: JSON.stringify({
                sourcelanguage: languages[0],
                targetlanguage: languages[1],
                text: inputText,
                getsentences: true,
            }),
        };

        // Send request
        fetch(API_URL, fetchData)
            .then(res => res.json())
            .then(data => {
                $("#outputText").val(data.message || data.error); // Update output
            })
            .catch((error) => {
                $("#outputText").val(error); // Show error message
            });
    }
}

// Swap both languages
function swapLang() {
    let model = $("#model");
    let languages = model.val().split("2");
    let text1 = $("#inputText").val();
    let text2 = $("#outputText").val();

    // Swap model and text
    model.val(languages[1] + "2" + languages[0]); // Select opposite model
    $("#inputText").val(text2); // Output as input
    $("#outputText").val(text1); // Input as output
}

// Copy output text to clipboard
function copyToClipboard() {
    let text = $("#outputText");
    text.select();
    navigator.clipboard.writeText(text.val());
}