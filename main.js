
"use strict";
document.addEventListener("DOMContentLoaded", function () {
    const _ = (e) => document.querySelector(e);

    const cropButton = _("#cropButton");
    const imageForCrop = _("#imageForCrop");
    const reCropButton = _("#reCropButton");
    const cropImageWrapper = _("#cropImageWrapper");
    const outputCanvas = _("#outputCanvas");
    const imageRotateSlider = _("#imageRotateSlider");
    const cropGroup = _("#cropGroup");
    const canvasToolGroup = _("#canvasToolGroup");
    const resetAllButton = _("#resetAllButton");
    const resetRotateButton = _("#resetRotateButton")


    resetAllButton.addEventListener("click", function () {
        if (cropper) {
            cropper.reset();
            imageRotateSlider.value = 0;
        }
    })

    let originalImageMimeType = null;
    let isImageLoaded = false;
    let cropper = null;
    let croppedCanvas = null;

    let targetImageWidth = 360;
    let targetImageHeight = 450;

    // Handle image input change event
    _("#imageInput").addEventListener("change", handleImage);

    reCropButton.addEventListener("click", function () {
        enableCropDisableCanvasTools(true);
    });

    imageRotateSlider.addEventListener("input", function (e) {
        if (cropper) {
            const rotateAngle = e.target.value;
            cropper.rotateTo(rotateAngle);
        }
    });

    resetRotateButton.addEventListener("click", function (e) {
        if (cropper) {
            const rotateAngle = 0;
            cropper.rotateTo(rotateAngle);
            imageRotateSlider.value = 0;
        }
        console.log(this.disabled = true)
        // const r = imageForCrop.getImageData();
        // console.log(r)
    });

    let flipX = 1;
    const flipHorizontallyButton = _("#flipHorizontallyButton");
    flipHorizontallyButton.addEventListener("click", function () {
        flipX = flipX !== 1 ? 1 : -1;

        if (cropper) {
            cropper.scaleX(flipX)
            console.log("cropper")
        }
    });

    let flipY = 1;
    const flipVerticallyButton = _("#flipVerticallyButton");
    flipVerticallyButton.addEventListener("click", function () {
        flipY = flipY !== 1 ? 1 : -1;

        if (cropper) {
            cropper.scaleY(flipY)
            console.log("cropper")
        }
    });

    cropButton.addEventListener("click", cropImage);

    // detect upload image
    let imageUrl = null;
    function handleImage(event) {
        const file = event.target.files[0];
        if (file) {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
                imageUrl = null;
            }
            originalImageMimeType = file.type;
            // image onload
            imageForCrop.onload = function () {
                isImageLoaded = true;
                // console.log("image loaded");
                initCropper();
                // cropImageWrapper.style.display = "block";
                enableCropDisableCanvasTools(true);
                // console.log("imageForCrop.onload")
            };
            imageUrl = URL.createObjectURL(file)
            imageForCrop.src = imageUrl;
        }
    }

    // initialisation of cropper
    function initCropper() {
        if (cropper) {
            destroyCrooper();
        }

        cropper = new Cropper(imageForCrop, {
            viewMode: 3,
            dragMode: "move",
            aspectRatio: 4 / 5,
            autoCropArea: 1,
            restore: !1,
            modal: !1,
            highlight: !1,
            cropBoxMovable: !1,
            cropBoxResizable: !1,
            toggleDragModeOnDblclick: !1,
            ready() {
                cropImageWrapper.style.visibility = "visible";
            },
            crop(event) {
                if (event.detail.rotate != 0) {
                    resetRotateButton.disabled = false
                }

            },
        });
    }

    function destroyCrooper() {
        cropper.destroy();
        cropper = null;
    }

    function cropImage() {
        if (cropper) {
            croppedCanvas = cropper.getCroppedCanvas({
                width: targetImageWidth,
                height: targetImageHeight,
            });

            if (croppedCanvas !== null) {
                // enable tools
                enableCropDisableCanvasTools(false);
                drawImageGrid();
            }
        }
    }

    function enableCropDisableCanvasTools(statusTrue) {
        // document
        //     .querySelectorAll("#canvasToolGroup>*")
        //     .forEach((el) => (el.disabled = statusTrue));
        // cropButton.disabled = !statusTrue;
        // flipHorizontallyButton.disabled = !statusTrue
        // isLandscape.disabled = statusTrue
        // reCropButton.disabled = statusTrue;
        cropImageWrapper.style.display = statusTrue ? "block" : "none";
        cropGroup.style.display = statusTrue ? "block" : "none";
        outputCanvas.style.display = statusTrue ? "none" : "block";
        canvasToolGroup.style.display = statusTrue ? "none" : "block";
        // imageRotateSlider.disabled = !statusTrue;
    }




    // =========================== Grid Image Section =====================================================================
    const rowsSelect = _("#rowsSelect");
    const colsSelect = _("#colsSelect");
    const isLandscape = _("#isLandscape");
    isLandscape.addEventListener("click", changeCanvasOrientation);
    const paperSelect = _("#paperSelect");
    paperSelect.addEventListener("change", changePaperSize);

    // Handle background color input change event
    _("#backgroundColorInput").addEventListener("input", setBackgroundColor);
    // Handle rows select change event
    rowsSelect.addEventListener("change", updateGrid);
    // Handle columns select change event
    colsSelect.addEventListener("change", updateGrid);
    // Handle download button click
    const downloadImageButton = _("#downloadImageButton");

    downloadImageButton.addEventListener("click", downloadCanvas);

    let backgroundColor = "#008080"; // Default background color (white)
    // get from user
    let numRows = parseInt(rowsSelect.value, 10) || 1; // Default number of rows
    let numCols = parseInt(colsSelect.value, 10) || 6; // Default number of columns

    let outputCanvasImageBlob = null;


    const photoResolution = 300;
    const screenResolution = 96;
    const scaleFactor = photoResolution / 96;

    const paperSizes = {
        A4: { width: 2480, height: 3505 },
        _4x6: { width: 1200, height: 1800 },
        _5x7: { width: 1500, height: 2100 },
    };
    let paperSize = paperSizes["A4"];

    function changePaperSize(e) {
        paperSize = paperSizes[paperSelect.value];
        // console.log(paperSize);
        changeCanvasOrientation();
        drawImageGrid();
    }

    const ctx = outputCanvas.getContext("2d");
    // default set canvas size
    outputCanvas.width = paperSizes.A4.width;
    outputCanvas.height = paperSizes.A4.height;
    outputCanvas.style.maxWidth = `${paperSize.width / scaleFactor}px`;

    function changeCanvasOrientation(e) {
        // console.log(scaleFactor);
        // console.log(paperSize.height / scaleFactor);
        if (isLandscape.checked) {
            isLandscape.parentElement.style.color = "white";
            isLandscape.parentElement.style.backgroundColor = "darkgreen";
            outputCanvas.width = paperSize.height;
            outputCanvas.height = paperSize.width;
            // set screen max size
            outputCanvas.style.maxWidth = `${paperSize.height / scaleFactor}px`;
            // outputCanvas.style.maxHeight = paperSize.width / scaleFactor;
        } else {
            isLandscape.parentElement.style.color = "black";
            isLandscape.parentElement.style.backgroundColor = "#eee";
            outputCanvas.width = paperSize.width;
            outputCanvas.height = paperSize.height;
            // set screen max size
            outputCanvas.style.maxWidth = `${paperSize.width / scaleFactor}px`;
            // outputCanvas.style.maxHeight = paperSize.height / scaleFactor;
        };
        drawImageGrid();
    }

    // set internally
    let gap = 40; // Adjust gap as needed
    const margin = gap / 2;

    // outputCanvas grid
    function drawImageGrid() {
        if (isImageLoaded) {
            // set background colour white
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
            // arrange image in rows by for loop
            for (let row = 0; row < numRows; row++) {
                // arrange image in columns by for loop
                for (let col = 0; col < numCols; col++) {
                    const x = col * (targetImageWidth + gap) + margin; // Adjusted x position
                    const y = row * (targetImageHeight + gap) + margin; // Adjusted y position

                    // for maintain original image ratio
                    // const y = row * (img.height / img.width * targetImageWidth + gap) + margin; // Adjusted y position

                    ctx.fillStyle = backgroundColor;
                    ctx.fillRect(x, y, targetImageWidth, targetImageHeight);

                    ctx.strokeStyle = "black";
                    ctx.lineWidth = 5;

                    ctx.drawImage(
                        croppedCanvas, x, y, targetImageWidth, targetImageHeight
                    );

                    ctx.strokeRect(x, y, targetImageWidth, targetImageHeight); // Stroke around the image
                }
            }
        }

        // Store outputCanvas image as Blob
        outputCanvas.toBlob(function (blob) {
            outputCanvasImageBlob = blob;
        }, originalImageMimeType); // Pass original image MIME type
    }


    function setBackgroundColor(event) {
        backgroundColor = event.target.value;
        ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
        drawImageGrid();
    }

    function updateGrid() {
        numRows = parseInt(rowsSelect.value, 10);
        numCols = parseInt(colsSelect.value, 10);
        ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
        drawImageGrid();
    }

    function downloadCanvas() {
        if (outputCanvasImageBlob) {
            const timestamp = new Date().getTime();
            const fileName = `IMG_${timestamp}.png`;
            const link = document.createElement("a");
            link.download = fileName;
            link.href = URL.createObjectURL(outputCanvasImageBlob);
            link.click();
        }
    }

    setBackgroundColor({ target: { value: backgroundColor } });


})

