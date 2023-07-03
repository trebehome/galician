// Initialize tooltips
[].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')).map((tooltipTriggerEl) => {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});