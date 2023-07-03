// Validate input file
validateFile = extensions => () => {
	// Remove old messages
	$("#responseBad").html("");

	// Accepted extensions
	const VALID_EXTENSIONS = extensions;

	let input = $("#inputFile");
	let file = input.prop("files")[0];

	// Do not check if file is not selected
	if (file === undefined) {
		$("#filename").html("");
		return;
	}

	let extension = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();

	// Check whether file extension is valid
	if (VALID_EXTENSIONS.includes(extension)) {
		$("#filename").html(file.name);
	} else {
		input.val(null); // Reset input
		$("#filename").html("Invalid format");
	}
}