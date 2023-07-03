// Switch language
$("#changeLang").change(() => {
    // Redirect to page with new language
    window.location = $("#changeLang").val();
});

// Add border to navbar if page is at the top
document.getElementsByTagName("nav")[0].classList.add("border-bottom");
if (window.pageYOffset === 0) {
    document.getElementsByTagName("nav")[0].classList.remove("border-bottom");
}

document.onscroll = () => {
    if (window.pageYOffset === 0) {
        document.getElementsByTagName("nav")[0].classList.remove("border-bottom");
        return;
    }
    document.getElementsByTagName("nav")[0].classList.add("border-bottom");
}

// Navbar icon effect
document.getElementById("menu-button").onclick = () => {
    let icon = document.getElementById("menu-icon");

    if (icon.classList.contains("open")) {
        icon.classList.remove("open");
        return;
    }
    icon.classList.add("open");
}