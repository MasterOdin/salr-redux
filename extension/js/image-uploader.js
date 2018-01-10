/**
 * @fileoverview Image upload tool
 * @author forums poster 'astral'
 */

/**
 * A port to communicate with the rest of the extension
 * @type {Port}
 */
var port = chrome.runtime.connect();

/**
 * Keeps track of whether we're dragging to reduce redundant styling attempts
 * @type {boolean}
 */
var stillDragging = false;

/**
 * Attaches events to uploader page.
 */
function attachUploaderEvents() {
    document.getElementById("url-submit-button").addEventListener(
        'click', () => {
            var url = document.getElementById("image-url").value;
            imgurUpload(url);
        });
    document.getElementById("dropzone").addEventListener(
        'dragover', (event) => {
            // Prevent default select and drag behavior
            event.preventDefault();
            // Make sure we're not doing this a zillion times
            if (!stillDragging) {
                stillDragging = true;
                var dropZone = document.getElementById("dropzone");
                if (areWeDraggingImageFiles(event.dataTransfer) === false) {
                    dropZone.querySelector("h1").innerText = "That's not an image!";
                } else {
                    dropZone.querySelector("h1").innerText = "Now drop it";
                    dropZone.classList.add("drag-over");
                }
            }
        });
    document.getElementById("dropzone").addEventListener(
        'dragleave', (event) => {
            // Prevent default select and drag behavior
            event.preventDefault();
            stillDragging = false;
            var dropZone = event.currentTarget;
            dropZone.querySelector("h1").innerText = "Drag an image here";
            dropZone.classList.remove("drag-over");
        });
    document.getElementById("dropzone").addEventListener(
        'drop', (event) => {
            // Prevent default drop behavior
            event.preventDefault();
            var dropZone = event.currentTarget;
            var dt = event.dataTransfer;
            // Some browsers may only support DataTransfer.items
            if (dt.items) {
                for (var i=0; i < dt.items.length; i++) {
                    // Ignore non-files
                    if (dt.items[i].kind === "file") {
                        var f = dt.items[i].getAsFile();
                        // Make sure it's an image
                        if (!f.type.match(/image.*/) || f.type === "image/x-icon")
                            continue;
                        imgurUpload(f);
                        // Only take the first one for now.
                        break;
                    }
                }
            } else {
                // Some browsers don't support DataTransfer.items
                // Use DataTransfer interface to access the file(s)
                for (var j=0; j < dt.files.length; j++) {
                    // Make sure it's an image
                    if (!dt.files[j].type.match(/image.*/) || dt.files[j].type === "image/x-icon")
                        continue;
                    imgurUpload(dt.files[j]);
                    // Only take the first one for now.
                    break;
                }
            }
            dropZone.querySelector("h1").innerText = "Drag an image here";
            dropZone.classList.remove("drag-over");
        });
    document.getElementById("dismiss-error-button").addEventListener(
        'click', () => {
            hideError();
            clearDropZone();
        });
}

/**
 * Finds valid images from a drag operation
 * @param {DataTransfer} dt Object with drag data
 * @return {boolean} Whether there's a valid image being dragged.
 */
function areWeDraggingImageFiles(dt) {
    if (dt.items) {
        for (var i=0; i < dt.items.length; i++) {
            // Ignore non-files
            if (dt.items[i].kind === "file") {
                // Make sure it's an image
                if (!dt.items[i].type.match(/image.*/) || dt.items[i].type === "image/x-icon")
                    continue;
                // Only return the first one for now.
                return true;
            }
        }
    } else {
        // Browser doesn't support checking this; we'll verify on drop.
        return true;
    }
    return false;
}

/**
 * Uploads a file to imgur.
 * @param {(File|string)} file File or string URL to upload
 */
function imgurUpload(file) {
    // Hide drop zone while we upload
    document.getElementById("dropzone").querySelector("h1").style.display = "none";
    document.getElementById("enter-url").style.display = "none";
    // Show upload status
    document.getElementById("upload-label").style.display = "block";

    if (!file || (typeof file !== 'string' && (!file.type.match(/image.*/) || file.type === "image/x-icon"))) {
        uploadFailed("That wasn't an image.");
        return;
    }

    var fd = new FormData();
    fd.append("image", file);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.imgur.com/3/upload.json");
    xhr.setRequestHeader('Authorization', "Client-ID " + atob("YjU2OTk5NDhkMTJiN2Rj"));
    xhr.onload = function() {
        processImgurResult(xhr.responseText);
    };
    xhr.onerror = function() {
        uploadFailed("Error connecting to imgur.");
    };

    // Update progress bar
    var progressBar = document.getElementById("progress-bar");
    progressBar.value = 0;
    progressBar.max = 1;
    xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
            progressBar.value = (e.loaded / e.total);
        }
    };

    xhr.send(fd);
}

/**
 * Handler for imgur upload result
 * @param {string} respText Response text from imgur.
 */
function processImgurResult(respText) {
	var imgurResponse = JSON.parse(respText);
	if (!imgurResponse.data) {
		uploadFailed("No data object in imgur response.");
		return;
    } else if (!imgurResponse.data.link) {
		uploadFailed(imgurResponse.data.error.message);
		return;
    }

	var imageurl = imgurResponse.data.link;
	if (imageurl) {
		if (imgurResponse.data.deletehash)
			console.log("SALR: imgur upload success! If for some reason you need to delete it, " +
					"the deletion link is: https://imgur.com/delete/" + imgurResponse.data.deletehash);
		// The imgur API returns only http: URLs, so:
		imageurl = imageurl.replace(/^http:/, 'https:');

        // Clean up display
        clearDropZone();
        // Append to post
        port.postMessage({
            message: 'AppendUploadedImage',
            original: imageurl,
            thumbnail: imageurl,
            type: 'original'
        });
	}
}

/** 
 * Resets the upload UI to its initial state
*/
function clearDropZone() {
    document.getElementById("upload-label").style.display = "none";
    document.getElementById("dropzone").querySelector("h1").style.display = "block";
    document.getElementById("image-url").value = "";
    document.getElementById("enter-url").style.display = "block";
}

/**
 * Hides the error box
 */
function hideError() {
    document.getElementById("error").style.display = "none";
    document.getElementById("dropzone").style.display = "block";
}

/**
 * Displays an error in the error box
 * @param {string} error Error to show.
 */
function showError(error) {
    document.getElementById("dropzone").style.display = "none";
    document.getElementById("error").style.display = "block";
    document.getElementById("errortext").innerText = error;
}

/**
 * Handler for failed image upload
 * @param {string} [reason] Optional reason for failure.
 */
function uploadFailed(reason) {
    if (!reason || reason === "")
        reason = "Unknown error. Please try again.";

    console.log("SALR: image upload failure: " + reason);
    showError(reason);
}

document.addEventListener('DOMContentLoaded', attachUploaderEvents);
