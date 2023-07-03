// Set API key status
function setAPIkeyStatus() {
    let storedAPIkey = localStorage.getItem("apiKey");
    if (storedAPIkey) {
        // Save key across pages
        $("#apiKey").val(storedAPIkey);
    }
}

// Set entered API key as the new one
function setNewAPIkey() {
    let newKey = $("#apiKey").val().trim();
    if (newKey && newKey !== localStorage.getItem("apiKey")) {
        // Update API key
        localStorage.setItem("apiKey", newKey);
    }
}