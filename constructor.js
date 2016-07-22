var canvasFront, ctxf,
    canvasBack, ctxb,
    ctxt,
    items, closer,
    itemsElement, 
    controlsElement,
    controls,
    typeElement,
    widgets = [],
    mouseDowmX, mouseDowmY,
    mouseUpX, mouseUpY,
    radians = 0, degree = 0,
    rotateDownX, rotateDownY,
    imageDataImageOnAssistedCanvas,
    imageDataImageOnFrontCanvas,
    offsetX = 0, offsetY = 0,
    scaleDownX, scaleDownY,
    currentTextData,
    currentTextImg;

canvasFront = document.getElementById("canvas-front");
canvasFront.height = 600;
canvasFront.width = window.innerWidth * 0.8;
canvases.style.width = window.innerWidth * 0.8 + 'px'; 
ctxf = canvasFront.getContext('2d');

canvasBack = document.getElementById("canvas-back");
canvasBack.height = 600;
canvasBack.width = window.innerWidth * 0.8;
ctxb = canvasBack.getContext('2d');

var mainImgX = (canvasFront.width) / 2;

function clearCanvases() {
    canvasBack.width = canvasBack.width;
    canvasFront.width = canvasFront.width;
}

var orderButton = document.getElementsByClassName('order')[0];
orderButton.onclick = function() {
    var frontImage = new Image();
    frontImage.src = canvasFront.toDataURL();
    frontImage.onload = function() {
         ctxb.drawImage(frontImage, 0, 0);
         backImageData = canvasBack.toDataURL("image/png");
         var ajax = new XMLHttpRequest();
         ajax.open("POST",'testSave.php',false);
         ajax.onreadystatechange = function() {
             console.log(ajax.responseText);
         }
         ajax.setRequestHeader('Content-Type', 'application/upload');
         ajax.send("imgData="+backImageData);
    };
};

/*---------Server----------*/
/*
    <?php
    if (isset($GLOBALS["HTTP_RAW_POST_DATA"])) {
      $imageData=$GLOBALS['HTTP_RAW_POST_DATA'];
      $filteredData=substr($imageData, strpos($imageData, ",")+1);
      $unencodedData=base64_decode($filteredData);
      $fp = fopen('/path/to/file.png', 'wb' );
      fwrite( $fp, $unencodedData);
      fclose( $fp );
    }
    ?>
*/


var dataOfOrder = [];

var modulesArr = [];
modulesArr.itemsElement = document.getElementById("items");
modulesArr.typesElement = document.getElementById('type');
modulesArr.materialsElement = document.getElementById('material');
modulesArr.modelsElement = document.getElementById('model');
modulesArr.countFragmentsElement = document.getElementById('count-frarments');
modulesArr.sizesElement = document.getElementById('size');
modulesArr.imagesElement = document.getElementById('images');
modulesArr.colorsElement = document.getElementById('colors');

var colorElement = document.getElementById('valueInput');
colorElement.onchange = function() {
    console.log(colorElement.value);
    changeColorMainImage();
}

var clone = function(imageData) {
  var canvas, context;
  canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  context = canvas.getContext('2d');
  context.putImageData(imageData, 0, 0);
  return context.getImageData(0, 0, imageData.width, imageData.height);
};

function changeColorMainImage() {
    var colorThief = new ColorThief();
    var color = colorThief.getColor(image);
    var imageData,
        red, green, blue;  
     red = parseInt(colorElement.value.slice(0,2), 16);
     green = parseInt(colorElement.value.slice(2,4), 16);
     blue = parseInt(colorElement.value.slice(4,6), 16);
    var newData = clone(imageDataMainImage);
    for (var i = 0, leng = imageDataMainImage.data.length; i < leng; i+=4){
        if (imageDataMainImage.data[i + 0] > color[0] - 10 && imageDataMainImage.data[i + 0] < color[0] + 10 &&
            imageDataMainImage.data[i + 1] > color[1] - 10 && imageDataMainImage.data[i + 1] < color[1] + 10 &&
            imageDataMainImage.data[i + 2] > color[2] - 10 && imageDataMainImage.data[i + 2] < color[2] + 10) {
            newData.data[i] = red; 
            newData.data[i + 1] = green;
            newData.data[i + 2] = blue;
            newData.data[i + 3] = 255;   
        }
        else {
            if (imageDataMainImage.data[i] && imageDataMainImage.data[i + 1] && imageDataMainImage.data[i + 2]) {
                var a = (255 - Math.min(red, green, blue)) / 1.8;
                newData.data[i + 0] = imageDataMainImage.data[i + 0] - a;  
                newData.data[i + 1] = imageDataMainImage.data[i + 1] - a;
                newData.data[i + 2] = imageDataMainImage.data[i + 2] - a;
                newData.data[i + 3] = 255;    
            }
        }
    }
    canvasBack.width = canvasBack.width;
    ctxb.putImageData(newData, mainImgX - image.width/(2/imgScale), 100);
}

for (var name in modulesArr) {
    modulesArr[name].style.right =  window.innerWidth * 0.1 + 125 + 'px'; 
}

closer = document.getElementsByClassName("closer");

for (var name in closer) {
   closer[name].onclick = addHandlersCloser(); 
}
function addHandlersCloser() {
    return function() {
        hideAllModules();
    } 
}

items = document.getElementsByClassName('item');
controlsElement = document.getElementById('controls');
controls = controlsElement.children;

var controlsArr = [];
controlsArr.items = controlsElement.getElementsByClassName('base')[0];
controlsArr.types = controlsElement.getElementsByClassName('type')[0];
controlsArr.materials = controlsElement.getElementsByClassName('material')[0];
controlsArr.models = controlsElement.getElementsByClassName('model')[0];
controlsArr.countFragments = controlsElement.getElementsByClassName('count-fragments')[0];
controlsArr.sizes = controlsElement.getElementsByClassName('size')[0];
controlsArr.images = controlsElement.getElementsByClassName('image')[0];
controlsArr.colors = controlsElement.getElementsByClassName('color')[0];

var selectedBlockElement = document.getElementsByClassName('in')[0];
var selectedElements = []; 
    selectedElements['base'] = selectedBlockElement.getElementsByClassName('base')[0];
    selectedElements['model'] = selectedBlockElement.getElementsByClassName('model')[0];
    selectedElements['type'] = selectedBlockElement.getElementsByClassName('type')[0];
    selectedElements['color'] = selectedBlockElement.getElementsByClassName('color')[0];
    selectedElements['size'] = selectedBlockElement.getElementsByClassName('size')[0];
    selectedElements['material'] = selectedBlockElement.getElementsByClassName('material')[0];
    selectedElements['count-fragments'] = selectedBlockElement.getElementsByClassName('count-fragments')[0];


var widgetElement = document.getElementsByClassName('widgets')[0],
    buttonShowDetails;
widgets['text'] = document.getElementsByClassName('widget-text')[0];
widgets['layers'] = document.getElementsByClassName('widget-layers')[0];
widgets['images'] = document.getElementsByClassName('widget-image')[0];

var fontControls = [];
fontControls['bold'] = widgets['text'].getElementsByClassName('bold')[0];
fontControls['italic'] = widgets['text'].getElementsByClassName('italic')[0];
fontControls['underline'] = widgets['text'].getElementsByClassName('underline')[0];

var textAlign = [];
textAlign['left'] = widgets['text'].getElementsByClassName('align-left')[0];
textAlign['center'] = widgets['text'].getElementsByClassName('align-center')[0];
textAlign['right'] = widgets['text'].getElementsByClassName('align-right')[0];
var fontElement = widgets['text'].getElementsByClassName('font')[0];
creatingFonts = false;

fontElement.onclick = function() {
    if (!creatingFonts) {
        createFonts();
    }
    fontList.style.display = 'block';
}
var fontsArr = ['Andika', 'Anonymous', 'Bad Script', 'Ubuntu'];
var fontList = document.getElementsByClassName('font-list')[0];

var textColorElement = document.getElementById('text-color-input');
textColorElement.onchange = function() {
    currentTextElement.color = '#' + textColorElement.value;
    drawTextOnAssistedCanvas();
}

for (var name in fontControls) {
    fontControls[name].onclick = addFontControlsHandlers(fontControls[name], 'fontStyle', name, fontControls);
}
for (var name in textAlign) {
    textAlign[name].onclick = addFontControlsHandlers(textAlign[name], 'textAlign', name, textAlign);
}

function addFontControlsHandlers(element, type, style, arr) {
    return function() {
        for (var name in arr) {
            if(name != style) {
                arr[name].classList.remove('active');   
            }
        }
        if (element.classList.contains('active')) {
            element.classList.remove('active');
            currentTextElement[type] = '';
        }
        else {
            element.classList.add('active');
            currentTextElement[type] = style;
        }
        drawTextOnAssistedCanvas();
    }
}

function showComposition() {
    widgets['layers'].style.display = 'block';
    widgets['text'].style.display = 'none';
    widgets['images'].style.display = 'none';
}

function showDetails() {
    widgetElement.style.display = 'block';
    widgets['layers'].style.display = 'none';
    if (currentTextElement) {
        widgets['text'].style.display = 'block';
        widgets['images'].style.display = 'none';
        textArea.value = currentTextElement.value;
        
    }
    else if (currentImageElement) {
        widgets['images'].style.display = 'block';
        widgets['text'].style.display = 'none';
    }       
}

var texts = [];
var images = [];

function Text(text, x, y, font, fontSize) {
    this.value = text;
    this.x = x;
    this.y = y;
    this.fontSize = fontSize;
    this.font = font;
    this.fontStyle = '';
    this.textAlign = '';
    this.maxWidth = image.width * imgScale;
    this.lineHeight = fontSize; 
    this.height = fontSize;
    this.color = '#000';
    this.angle = 0;
    this.textHeight = 0;
    this.scale = 1;
}
Text.prototype.drawOnMainCanvas = function() {
    if(this.angle) {
        ctxf.save();
        ctxf.translate(this.x + this.maxWidth / 2, this.y + this.textHeight / 2);
        ctxf.rotate(this.angle * Math.PI / 180);
        ctxf.drawImage(currentTextImg, -this.maxWidth / 2, -this.textHeight / 2);    
        ctxf.restore();
    }
    else {
        ctxf.drawImage(currentTextImg, this.x, this.y);    
    }    
}
Text.prototype.stroke = function() {
    this.height = this.lineHeight;
    this.width = 0;
    var y = this.y;
    ctxf.font = this.font;
    
    ctxf.strokeStyle = '#f90';
    ctxf.lineWidth = 3;
    
    var lines = this.value.split("\n");
    for (var i = 0; i < lines.length; i++) {
        var line = "";
        var words = lines[i].split(" ");

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + " ";
            var metrics = ctxf.measureText(testLine);
            var testWidth = metrics.width;

            if (testWidth > this.maxWidth) {
                ctxf.strokeText(line, this.x, y);
                line = words[n] + " ";
                y += this.lineHeight;
                this.height += this.lineHeight;
            }
            else {
                this.width = testWidth > this.width ? testWidth : this.width;
                line = testLine;
            }
        }
        ctxf.strokeText(line, this.x, y);
        this.height += this.lineHeight;
        y += this.lineHeight;
    }
    ctxf.strokeRect(this.x, this.y - this.fontSize * 1.5, this.width, this.height);
}

function Img(image, x, y) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.scale = 1;
}
Img.prototype.drawOnAssistedCanvas = function() {
    ctxt.width = ctxt.width;
    ctxt.drawImage(this.image, 0, 0, this.image.width * this.scale, this.image.height * this.scale);
    
    /*---------- Opacity for image -------------*/
    /*imageDataImageOnAssistedCanvas = ctxt.getImageData(0, 0, this.image.width, this.image.height);
    imageDataImageOnFrontCanvas = ctxb.getImageData(Math.ceil(this.x), this.y, this.image.width, this.image.height);  
    var newImageDataImageOnAssistedCanvas= clone(imageDataImageOnAssistedCanvas);
    
    for (var i = 0, leng = newImageDataImageOnAssistedCanvas.data.length; i < leng; i+=4){
        if (!imageDataImageOnFrontCanvas.data[i] && !imageDataImageOnFrontCanvas.data[i + 1] && !imageDataImageOnFrontCanvas.data[i + 2] &&
            newImageDataImageOnAssistedCanvas.data[i] && newImageDataImageOnAssistedCanvas.data[i + 1] && newImageDataImageOnAssistedCanvas.data[i + 2]) {
            newImageDataImageOnAssistedCanvas.data[i + 3] = 75;   
        }
    }
    ctxt.putImageData(newImageDataImageOnAssistedCanvas, 0, 0); 
    */
};
Img.prototype.drawOnMainCanvas = function() {
    if (this.angle) {
        ctxf.save();
        ctxf.translate(this.x + (this.image.width / 2) * this.scale, this.y + (this.image.height / 2) * this.scale);
        ctxf.rotate(this.angle * Math.PI/180);
        ctxf.drawImage(this.image, -(this.image.width / 2) * this.scale , -(this.image.height / 2) * this.scale, this.image.width * this.scale, this.image.height * this.scale);
        ctxf.restore();
    }
    else {
        ctxf.drawImage(this.image, this.x, this.y, this.image.width * this.scale, this.image.height * this.scale);    
    }
};


var chooseFile = document.getElementById('choose-file');
chooseFile.onchange = function() {
    var file = chooseFile.files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
        var dataUrl = event.target.result;
        var image = new Image();
        image.src = dataUrl;
        createImageModule(image);
    };
    reader.readAsDataURL(file);
};

var canvasPosition = canvasFront.getBoundingClientRect();
var mouseX = 0, mouseY = 0;
var currentTextElement;
var currentImageElement;

var AddTextElement = document.getElementsByClassName('text')[0];
var AddImageElement = document.getElementsByClassName('image')[0];

AddTextElement.onclick = function() {
    texts.push(new Text('Мой текст', mainImgX - image.width/(2/imgScale), 100, 'Arial', 60));
    currentTextElement = texts[texts.length - 1];
    showAllTrans();
    showAssistedCanvas();
    definitionSizeAssistedCanvas();
    drawTextOnAssistedCanvas();
    showDetails();
    createDetailsElements('text', currentTextElement, currentTextElement);
};

var transElements = document.getElementsByClassName('trans')[0],
    transArr = [];
transArr['canvas-text'] = document.getElementsByClassName('canvas-text')[0];
var assistedTextCanvas = transArr['canvas-text'];
ctxt = transArr['canvas-text'].getContext('2d');
transArr['rotate'] = document.getElementsByClassName('rotate')[0];
transArr['scale'] = document.getElementsByClassName('scale')[0];
transArr['remove'] = document.getElementsByClassName('remove')[0];
transArr['duplicate'] = document.getElementsByClassName('duplicate')[0];

assistedTextCanvas.onmouseup = function(e) {
    dragble = false;
    mouseUpX = e.clientX;
    mouseUpY = e.clientY;
    mouseDowmX = 0;
    mouseDowmY = 0;
};
assistedTextCanvas.onmousedown = function(e) {
    dragble = true;
    mouseUpX = 0;
    mouseUpY = 0;
    mouseDowmX = e.clientX;
    mouseDowmY = e.clientY;
    assistedCanvasPosition = assistedTextCanvas.getBoundingClientRect();
    degree = degree > 0 ? degree : 360 + degree; 
    var rad = (Math.PI / 180) * degree;
    var offsetRotationX = (image.width / 2 - (image.width / 2) * Math.cos(rad));
    
    offsetX = mouseDowmX - assistedCanvasPosition.left + offsetRotationX; 
    offsetY = mouseDowmY - assistedCanvasPosition.top;
};

var dragble = false;

function definitonCurrentTextElement() {
    var definedImageElement = false;
    var definedTextElement = false;
    for (var i = 0; i < texts.length; i++) {
        	ctxf.beginPath();
            if (texts[i].angle) {
                ctxf.save();
                ctxf.translate(texts[i].x + texts[i].maxWidth / 2, texts[i].y + texts[i].textHeight / 2);
                ctxf.rotate(texts[i].angle * Math.PI / 180);
                ctxf.rect(-texts[i].maxWidth / 2, -texts[i].textHeight / 2, texts[i].maxWidth, texts[i].textHeight);    
            }
            else {
                ctxf.save();
                ctxf.rect(texts[i].x, texts[i].y, texts[i].maxWidth, texts[i].textHeight);
            }
            ctxf.closePath();        
        if (ctxf.isPointInPath(mouseX, mouseY)) {
                definedTextElement = true;
                currentTextElement = texts[i];
                canvasFront.width = canvasFront.width;
                showAssistedCanvas();
                showDetails();
        }
        ctxf.restore();
    }
    for (var i = 0; i < images.length; i++) {
        	ctxf.beginPath();
            ctxf.rect(images[i].x, images[i].y, images[i].image.width * images[i].scale, images[i].image.height * images[i].scale);
            ctxf.closePath();        
        if (ctxf.isPointInPath(mouseX, mouseY)) {
                definedImageElement = true;
                transferCurrentElement();
                currentImageElement = images[i];
                canvasFront.width = canvasFront.width;
                showAssistedCanvas();
        }
    }
    if (!definedImageElement && currentImageElement) {
        transferCurrentElement();
        currentImageElement = undefined;
    }
    if (!definedTextElement && currentTextElement) {
        transferCurrentElement();
        currentTextElement = undefined;
    }
};

function transferCurrentElement() {
    if (currentImageElement) {
        currentImageElement.drawOnMainCanvas();
    }
    if (currentTextElement) {
        currentTextElement.drawOnMainCanvas();
    }
    fontList.style.display = 'none';
    hideAllTrans();
    showComposition();
}

canvasFront.addEventListener('click', definitonCurrentTextElement);

canvasFront.onmousemove = function(e) {
    mouseX = e.clientX - canvasPosition.left;
    mouseY = e.clientY - canvasPosition.top;
}

document.onmousemove = function(e) {
    var frontCanvasPosition = canvasFront.getBoundingClientRect();
    if (dragble && currentTextElement) { 
        transElements.style.left = e.clientX - frontCanvasPosition.left - offsetX +  'px';
        transElements.style.top = e.clientY - frontCanvasPosition.top - offsetY + 'px';
        currentTextElement.x = e.clientX - frontCanvasPosition.left - offsetX;
        currentTextElement.y = e.clientY - frontCanvasPosition.top - offsetY;
        console.log(currentTextElement);
    }
    else if (dragble && currentImageElement) {
        transElements.style.left = e.clientX - frontCanvasPosition.left - offsetX +  'px';
        transElements.style.top = e.clientY - frontCanvasPosition.top - offsetY + 'px';
        currentImageElement.x = e.clientX - frontCanvasPosition.left - offsetX + 27;
        currentImageElement.y = e.clientY - frontCanvasPosition.top - offsetY; 
        console.log(currentImageElement);
    }
};

document.onmouseup = function() {
    dragble = false;
    document.removeEventListener('mousemove', rotateCanvasEvent);
    document.removeEventListener('mousemove', scaleCanvasEvent);
}
transElements.onmouseup = function() {
    dragble = false;
    document.removeEventListener('mousemove', rotateCanvasEvent);  
}

function drawAllImgElements() {
    for (var i = 0; i < images.length; i++){
       if (images[i] != currentImageElement){
            images[i].drawOnMainCanvas();
           console.log(images[i]);
       }
    }
}
function drawAllTextElements() {
    for (var i = 0; i < texts.length; i++){
       if (texts[i] != currentTextElement){
            texts[i].drawOnMainCanvas();
       }
    }
}

function showAssistedCanvas() {
    transElements.style.border = null;
    showAllTrans();
    if (currentTextElement) {
        transElements.style.width = currentTextElement.maxWidth * currentTextElement.scale + 'px';
        transElements.style.height = currentTextElement.textHeight * currentTextElement.scale + 'px';
        transElements.style.marginLeft = '10%';
        transElements.style.left = currentTextElement.x + 'px';
        transElements.style.top = currentTextElement.y + 'px';
        transElements.style.transform = 'rotate('+currentTextElement.angle+'deg)';
        assistedTextCanvas.width = currentTextElement.maxWidth * currentTextElement.scale;
        assistedTextCanvas.height = currentTextElement.textHeight * currentTextElement.scale;
        drawTextOnAssistedCanvas();
        drawAllTextElements();
        drawAllImgElements();
    }
    else if (currentImageElement) {
        transElements.style.width = currentImageElement.image.width * currentImageElement.scale + 'px';
        transElements.style.height = currentImageElement.image.height * currentImageElement.scale + 'px';
        transElements.style.marginLeft = '10%';
        transElements.style.left = currentImageElement.x  + 'px';
        transElements.style.top = currentImageElement.y + 'px';
        transElements.style.transform = 'rotate('+currentImageElement.angle+'deg)';
        assistedTextCanvas.width = currentImageElement.image.width * currentImageElement.scale;
        assistedTextCanvas.height = currentImageElement.image.height * currentImageElement.scale;
        currentImageElement.drawOnAssistedCanvas();
        drawAllImgElements();
        drawAllTextElements();
    }
}

function drawTextOnAssistedCanvas() {
    assistedTextCanvas.width = currentTextElement.maxWidth * currentTextElement.scale;
    assistedTextCanvas.height = (currentTextElement.height - currentTextElement.fontSize + 15) * currentTextElement.scale;
    transElements.style.width = currentTextElement.maxWidth * currentTextElement.scale + 'px';
    transElements.style.height = (currentTextElement.height - currentTextElement.fontSize + 15) * currentTextElement.scale +'px';
    
    currentTextElement.height = currentTextElement.lineHeight * currentTextElement.scale;
    assistedTextCanvas.width = assistedTextCanvas.width; 
    currentTextElement.width = 0;
    var y = currentTextElement.fontSize * currentTextElement.scale;
    var x = 10;
    ctxt.font = currentTextElement.fontStyle + ' ' + currentTextElement.fontSize * currentTextElement.scale + 'px' + ' ' + currentTextElement.font;
    
    ctxt.fillStyle = currentTextElement.color;
    ctxt.strokeStyle = '#f90';
    ctxt.lineWidth = 4;
    ctxt.lineCap = 'round';
    ctxt.lineJoin = 'round';
    ctxt.textAlign = currentTextElement.textAlign;
    if (currentTextElement.textAlign == 'left') {
        x = 10;
    }
    else if (currentTextElement.textAlign == 'center') {
        x = (currentTextElement.maxWidth / 2) * currentTextElement.scale;
    }
    else if (currentTextElement.textAlign == 'right') {
        x = currentTextElement.maxWidth * currentTextElement.scale;
    }
    var lines = currentTextElement.value.split("\n");
    for (var i = 0; i < lines.length; i++) {
        var line = "";
        var words = lines[i].split(" ");

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + " ";
            var metrics = ctxt.measureText(testLine);
            var testWidth = metrics.width;

            if (testWidth > currentTextElement.maxWidth * currentTextElement.scale) {
                ctxt.fillText(line, x, y);
                line = words[n] + " ";
                y += currentTextElement.lineHeight * currentTextElement.scale;
                currentTextElement.height += currentTextElement.lineHeight * currentTextElement.scale;
                currentTextElement.width = ctxt.measureText(line).width > currentTextElement.width ? ctxt.measureText(line).width : currentTextElement.width; 
            }
            else {
                line = testLine;
            }
        }
        ctxt.fillText(line, x, y);
        currentTextElement.width = ctxt.measureText(line).width > currentTextElement.width ? ctxt.measureText(line).width : currentTextElement.width; 
        currentTextElement.height += currentTextElement.lineHeight * currentTextElement.scale;
        y += currentTextElement.lineHeight * currentTextElement.scale;
    } 
    currentTextElement.textHeight = y - currentTextElement.lineHeight * currentTextElement.scale;
    currentTextImg = new Image();
    currentTextImg.src = assistedTextCanvas.toDataURL();
}
function definitionSizeAssistedCanvas() {
    currentTextElement.height = currentTextElement.lineHeight;
    assistedTextCanvas.width = assistedTextCanvas.width; 
    currentTextElement.width = 0;
    var y = currentTextElement.fontSize;
    var x = 10;
    ctxt.font = currentTextElement.fontStyle + ' ' + currentTextElement.fontSize + 'px' + ' ' + currentTextElement.font;
    
    ctxt.strokeStyle = '#f90';
    ctxt.lineWidth = 4;
    ctxt.lineCap = 'round';
    ctxt.lineJoin = 'round';
    ctxt.textAlign = currentTextElement.textAlign;
    if (currentTextElement.textAlign == 'left') {
        x = 10;
    }
    else if (currentTextElement.textAlign == 'center') {
        x = currentTextElement.maxWidth / 2;
    }
    else if (currentTextElement.textAlign == 'right') {
        x = currentTextElement.maxWidth;
    }
    
    ctxt.strokeStyle = '#f90';
    ctxt.lineWidth = 4;
    ctxt.lineCap = 'round';
    ctxt.lineJoin = 'round';
    
    var lines = currentTextElement.value.split("\n");
    for (var i = 0; i < lines.length; i++) {
        var line = "";
        var words = lines[i].split(" ");

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + " ";
            var metrics = ctxt.measureText(testLine);
            var testWidth = metrics.width;

            if (testWidth > currentTextElement.maxWidth) {
                ctxt.fillText(line, x, y);
                line = words[n] + " ";
                y += currentTextElement.lineHeight;
                currentTextElement.height += currentTextElement.lineHeight;
                currentTextElement.width = ctxt.measureText(line).width > currentTextElement.width ? ctxt.measureText(line).width : currentTextElement.width; 
            }
            else {
                line = testLine;
            }
        }
        ctxt.fillText(line, x, y);
        currentTextElement.width = ctxt.measureText(line).width > currentTextElement.width ? ctxt.measureText(line).width : currentTextElement.width; 
        currentTextElement.height += currentTextElement.lineHeight;
        currentTextElement.textHeight = currentTextElement.textHeight;
        y += currentTextElement.lineHeight;
    }       
}

document.addEventListener('mousemove', function(e){
    mouseX = e.clientX - canvasPosition.left;
    mouseY = e.clientY - canvasPosition.top;
});


function showAllTrans() {
    transElements.style.display = "block";
    for (var name in transArr) {
        if (name != 'circle') {
            transArr[name].style.display = "block";
        }
    }
}
function hideAllTrans() {
    transElements.style.display = "none";
    transElements.style.border = 'none';
    for (var name in transArr) {
        if (name != 'circle') {
            transArr[name].style.display = "none";
        }
    }
}

var textArea = document.getElementById('input-text');
textArea.oninput = function() {
    currentTextElement.value = textArea.value;
    definitionSizeAssistedCanvas();
    drawTextOnAssistedCanvas();
    var layers = document.getElementsByClassName('layers-list')[0].getElementsByClassName('text');
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].element == currentTextElement) {
            var h4 = layers[i].getElementsByClassName('name-details')[0];
            h4.innerHTML = textArea.value;
            break;
        }
    }
   
}; 

transArr['rotate'].ondragstart = function() {
  return false;
};
transArr['rotate'].onmousedown = function(e) {
 /* transArr['circle'].x = currentTextElement.maxWidth / 2;
    transArr['circle'].y = currentTextElement.height / 2;
    transArr['circle'].radius = Math.sqrt(transArr['circle'].x * transArr['circle'].x + transArr['circle'].y * transArr['circle'].y);
    transArr['circle'].style.height = transArr['circle'].style.width = 2 * transArr['circle'].radius + 'px';
    transArr['circle'].style.top = - (2 * transArr['circle'].radius - currentTextElement.height) / 2 - 15 +'px';
    transArr['circle'].style.left = - (2 * transArr['circle'].radius - currentTextElement.maxWidth) / 2 + 'px';
    hideAllTrans();
    transArr['circle'].style.display = 'block';*/
    
    transElements.style.display = 'block';
    transArr['canvas-text'].style.display = 'block';
    transArr['rotate'].style.display = 'block';
    if (!rotateDownX) {
        rotateDownX = e.clientX;
        rotateDownY = e.clientY;   
    }
    document.addEventListener('mousemove', rotateCanvasEvent);
}
transArr['rotate'].onmouseup = function(e) {
    showAllTrans();
    transArr['circle'].style.display = 'none';
    transElements.style.border = null;
    document.removeEventListener('mousemove', rotateCanvasEvent);
}
function rotateCanvasEvent() {
    center_x = (transElements.getBoundingClientRect().left + transElements.getBoundingClientRect().right) / 2;
    center_y = (transElements.getBoundingClientRect().top + transElements.getBoundingClientRect().bottom) / 2;
    mouse_x = mouseX + canvasFront.getBoundingClientRect().left;
    mouse_y = mouseY + canvasFront.getBoundingClientRect().top;
    
    radiansRotate = Math.atan2(rotateDownX - center_x, rotateDownY - center_y);
    var degreeRotate = (radiansRotate * (180 / Math.PI) * -1) - 90;
    radians = Math.atan2(mouse_x - center_x, mouse_y - center_y);
    degree = (radians * (180 / Math.PI) * -1) - 90 - degreeRotate; 
    if (currentTextElement) {
        currentTextElement.angle = degree;
    }
    if (currentImageElement) {
        currentImageElement.angle = degree;
    }
    transElements.style.transform = 'rotate('+degree+'deg)'; 
}

transArr['remove'].onmouseup = function() {
    hideAllTrans();
    showComposition();
    var layersList = document.getElementsByClassName('layers-list')[0];
    var layers = layersList.getElementsByClassName('layer');
    
    if (currentImageElement) {
        for (var i = 0; i < images.length; i++) {
            if (images[i] == currentImageElement) {
                images.splice(i, 1);
            }
        }

        for (var i = 0; i < layers.length; i++) {
            if (layers[i].element == currentImageElement) {
                layers[i].parentNode.removeChild(layers[i]);        
            }
        }
        currentImageElement = undefined;    
    }
    if (currentTextElement) {
        for (var i = 0; i < texts.length; i++) {
            if (texts[i] == currentTextElement) {
                texts.splice(i, 1);
            }
        }
        for (var i = 0; i < layers.length; i++) {
            if (layers[i].element == currentTextElement) {
                layers[i].parentNode.removeChild(layers[i]);        
            }
        }
        currentTextElement = undefined;
    }
}

transArr['duplicate'].onclick = function() {
    if (currentImageElement) {
        var image = currentImageElement.image;
        images.push(new Img(image, currentImageElement.x + 50, currentImageElement.y + 50));
        images[images.length - 1].angle = currentImageElement.angle;
        images[images.length - 1].scale = currentImageElement.scale;
        currentImageElement = images[images.length - 1];
        currentTextElement = undefined;
        hideAllModules();  
        showAssistedCanvas();
        showDetails();
        createCurrentWidgetElement(image);
        createDetailsElements('image', image, currentImageElement);    
    }
    else if (currentTextElement) {
        texts.push(new Text(currentTextElement.value, currentTextElement.x + 50, currentTextElement.y + 50, currentTextElement.font, currentTextElement.fontSize));
        texts[texts.length - 1].angle = currentTextElement.angle;
        texts[texts.length - 1].scale = currentTextElement.scale;
        texts[texts.length - 1].color = currentTextElement.color;
        texts[texts.length - 1].fontStyle = currentTextElement.fontStyle;
        texts[texts.length - 1].textAlign = currentTextElement.textAlign;
        currentTextElement.drawOnMainCanvas();
        currentTextElement = texts[texts.length - 1];
        showAllTrans();
        showAssistedCanvas();
        definitionSizeAssistedCanvas();
        drawTextOnAssistedCanvas();
        showDetails();
        createDetailsElements('text', currentTextElement, currentTextElement);
    }
};

transArr['scale'].ondragstart = function() {
  return false;
};
transArr['scale'].onmousedown = function(e) {    
    scaleDownX = e.clientX;
    scaleDownY = e.clientY; 
    
    center_x = (transElements.getBoundingClientRect().left + transElements.getBoundingClientRect().right) / 2;
    center_y = (transElements.getBoundingClientRect().top + transElements.getBoundingClientRect().bottom) / 2;
    firstLength = Math.sqrt((scaleDownX - center_x) * (scaleDownX - center_x) + (scaleDownY - center_y) * (scaleDownY - center_y) );
    
    document.addEventListener('mousemove', scaleCanvasEvent);
}
transArr['rotate'].onmouseup = function(e) {
    showAllTrans();
    transElements.style.border = null;
    document.removeEventListener('mousemove', scaleCanvasEvent);
}
function scaleCanvasEvent() {
    center_x = (transElements.getBoundingClientRect().left + transElements.getBoundingClientRect().right) / 2;
    center_y = (transElements.getBoundingClientRect().top + transElements.getBoundingClientRect().bottom) / 2;
    mouse_x = mouseX + canvasFront.getBoundingClientRect().left;
    mouse_y = mouseY + canvasFront.getBoundingClientRect().top;
    
    var secondLength = Math.sqrt((mouse_x - center_x) * (mouse_x - center_x) + (mouse_y - center_y) * (mouse_y - center_y) );
    var scale = secondLength / firstLength;
    console.log("first " +  firstLength);
    console.log("mouseX " +  mouse_x);
    console.log("mouseY " +  mouse_y);
    
    
    if (currentTextElement) {
        console.log(scale);
        currentTextElement.scale = scale;
        showAssistedCanvas();
    }
    if (currentImageElement && scale < 5) {
        currentImageElement.scale = scale;
        showAssistedCanvas();
    }
}


hideSelectedElements();
function hideSelectedElements() {
    for (var name in selectedElements) {
        selectedElements[name].style.display = 'none';
    }
}

for (var name in controlsArr) {
    controlsArr[name].onclick = addHandlerControls(controlsArr[name], name);
}
function addHandlerControls(element, name) {
    return function () {
        hideAllModules();
        modulesArr[name + 'Element'].style.display = 'block';
    }
}

function removeAllModules(id, className) {
    var block = document.getElementById(id) || document.getElementById('size');
    var items = block.getElementsByClassName(className);
    for (var i = items.length - 1; i >= 0; i--) {
        items[i].parentNode.removeChild(items[i]);
    }
}
    
var imagesType = [], titlesType = [],
    imagesMaterial = [], titlesMaterial = [],
    imagesModel = [], titlesModel = [],
    titlesCountFragments = [],
    titlesSize = [];
    titlesSize = [];
imagesType['t-shirt'] = [];
imagesType['t-shirt'][0] = "images/T_shirt/001.png";
imagesType['t-shirt'][1] = "images/T_shirt/002.png";
imagesType['t-shirt'][2] = "images/T_shirt/003.png";

titlesType['t-shirt'] = [];
titlesType['t-shirt'][0] = "Женская";
titlesType['t-shirt'][1] = "Мужская";
titlesType['t-shirt'][2] = "Унисекс";

imagesType['shirt'] = [];
imagesType['shirt'][0] = "images/shirts/001.png";
imagesType['shirt'][1] = "images/shirts/002.png";

titlesType['shirt'] = [];
titlesType['shirt'][0] = "Мужская";
titlesType['shirt'][1] = "Женская";

imagesType['case'] = [];
imagesType['case'][0] = "images/types/2d.png";
imagesType['case'][1] = "images/types/3d.png";

titlesType['case'] = [];
titlesType['case'][0] = "2d";
titlesType['case'][1] = "3d";


titlesMaterial['poster'] = [];
titlesMaterial['pillow'] = [];

titlesMaterial['poster'][0] = "Глянец";
titlesMaterial['poster'][1] = "Матовая";

titlesMaterial['pillow'][0] = "Плюш";
titlesMaterial['pillow'][1] = "Cатин";

imagesModel['cup'] = [], titlesModel['cup'] = [];
imagesModel['case'] = [], titlesModel['case'] = [];
imagesModel['cup'][0] = "images/models/1460464035-thumb.jpg";
imagesModel['cup'][1] = "images/models/1460464512-thumb.jpg";

titlesModel['cup'][0] = "Разноцветные";
titlesModel['cup'][1] = "Одноцветные";

imagesModel['case'][0] = "images/cases/galaxy-s4.png";
imagesModel['case'][1] = "images/cases/galaxy-s5.png";
imagesModel['case'][2] = "images/cases/iphone-4.png";
imagesModel['case'][3] = "images/cases/iphone-5.png";
imagesModel['case'][4] = "images/cases/iphone-6.png";
imagesModel['case'][5] = "images/cases/iphone-6+.png";


titlesModel['case'][0] = "galaxy-s4";
titlesModel['case'][1] = "galaxy-s5";
titlesModel['case'][2] = "iphone-4";
titlesModel['case'][3] = "iphone-5";
titlesModel['case'][4] = "iphone-6";
titlesModel['case'][5] = "iphone-6+";

titlesCountFragments['puzzle'] = [];
titlesCountFragments['puzzle'][0] = '120 шт';
titlesCountFragments['puzzle'][1] = '240 шт';

titlesSize['poster'] = [];
titlesSize['poster'][0] = 'А1';
titlesSize['poster'][1] = 'A2';

titlesSize['puzzle'] = [];
titlesSize['puzzle'][0] = 'А3';
titlesSize['puzzle'][1] = 'A4';

titlesSize['magnet'] = [];
titlesSize['magnet'][0] = 'А7';
titlesSize['magnet'][1] = 'A6';
titlesSize['magnet'][2] = 'A5';


hideAllControls();  
hideAllModules();  

for (var item in items) {
    items[item].onclick = addHandlerItems(items[item]);   
}

function addHandlerItems(item) {
    return function () {
        canvasBack.width = canvasBack.width;
        image = new Image();
        image.src = item.getElementsByTagName('img')[0].src;
        imgScale = (canvasFront.width / 2) / image.width < 
            (canvasFront.height / 1.2) / image.height ? (canvasFront.width / 2) / image.width :  (canvasFront.height / 1.2) / image.height;
        
        ctxb.drawImage(image, mainImgX - image.width/(2/imgScale), 100, image.width * imgScale, image.height * imgScale);
        imageDataMainImage = ctxb.getImageData(mainImgX - image.width/(2/imgScale), 100, image.width * imgScale, image.height * imgScale);
        
        hideSelectedElements();
        var name = item.getElementsByClassName('item-name')[0].textContent;
        selectedElements['base'].style.display = 'inline-block';
        selectedElements['base'].innerHTML = name;
        dataOfOrder['base'] = name;
        hideAllModules();
        hideAllControls();
        var dataOfItemControls = item.dataset.controls;
        dataOfItemControls = dataOfItemControls.split(',');
        displayControls(dataOfItemControls, item);
    }
}

function addHandlerImageModule(item, module, className = 'item-name') {
    return function () {
        clearCanvases();
        var name = item.getElementsByClassName(className)[0].textContent;
        selectedElements[module].style.display = 'inline-block';
        selectedElements[module].innerHTML = name;
        image = new Image();
        image.src = item.getElementsByTagName('img')[0].src;
        imgScale = (canvasFront.width / 2) / image.width < 
            (canvasFront.height / 1.2) / image.height ? (canvasFront.width / 2) / image.width :  (canvasFront.height / 1.2) / image.height;
        
        ctxb.drawImage(image, mainImgX - image.width/(2/imgScale), 100, image.width * imgScale, image.height * imgScale);
        dataOfOrder[module] = name;
        imageDataMainImage = ctxb.getImageData(mainImgX - image.width/(2/imgScale), 100, image.width * imgScale, image.height * imgScale);
        hideAllModules();
    }
}

function addHandlerAddImages(item, image) {
    return function() {
        images.push(new Img(image, 300, 200));
        currentImageElement = images[images.length - 1];
        currentTextElement = undefined;
        hideAllModules();  
        showAssistedCanvas();
        showDetails();
        createCurrentWidgetElement(image);
        createDetailsElements('image', image, currentImageElement);
    }
}

function addHandlerTextModule(item, module) {
    return function () {
        var name = item.getElementsByClassName('text-item-name')[0].textContent;
        selectedElements[module].style.display = 'inline-block';
        selectedElements[module].innerHTML = name;
        dataOfOrder[module] = name;
        hideAllModules();
    }
}

function displayControls(arrControls, element) {
    for (var i = 0; i < controls.length; i++) {
        arrControls.forEach(function(dataControl){
            if (controls[i].classList.contains(dataControl)) {
                controls[i].style.display = "block";
            }  
        });   
    }
    if(arrControls.indexOf('type') != -1) {
        removeAllModules('type', 'type-item');
        createTypeModule(element.id);
    }
    if(arrControls.indexOf('material') != -1) {
        removeAllModules('material', 'text-type-item');
        createMaterialModule(element.id);
    }
    if(arrControls.indexOf('model') != -1) {
        removeAllModules('model', 'type-item')
        createModelModule(element.id);
    }
    if(arrControls.indexOf('count-fragments') != -1) {
        removeAllModules('count-fragments', 'text-type-item');
        createCountFragmentsModule(element.id);
    }  
    if(arrControls.indexOf('size') != -1) {
        //removeAllModules("size", 'text-type-item');
        createSizeModule(element.id);
    }
}

function hideAllControls() {
    for (var i = 2; i < controls.length - 4; i++) {
        controls[i].style.display = "none";
    }
}

function hideAllModules() {
    for (var name in modulesArr) {
        modulesArr[name].style.display = 'none';
    }
}

function createTypeModule(id) {
    for (var i = 0; i < imagesType[id].length; i++) {
        var div = document.createElement('div');
        div.classList.add('type-item');
        var img = new Image();
        img.src = imagesType[id][i];
        div.appendChild(img);           
        
        var p = document.createElement('p');
        p.innerHTML = titlesType[id][i];
        p.classList.add('item-name');
        div.appendChild(p);
        div.onclick = addHandlerImageModule(div, 'type');
        modulesArr.typesElement.appendChild(div);
    }
    
}

function createMaterialModule(id) {
    for (var i = 0; i < titlesMaterial[id].length; i++) {
        var div = document.createElement('div');
        div.classList.add('text-type-item');
        
        var p = document.createElement('p');
        p.innerHTML = titlesMaterial[id][i];
        p.classList.add('text-item-name');
        div.appendChild(p);
        div.onclick = addHandlerTextModule(div, 'material'); 
        modulesArr.materialsElement.appendChild(div);
    }
}

function createModelModule(id) {
    for (var i = 0; i < imagesModel[id].length; i++) {
        var div = document.createElement('div');
        div.classList.add('type-item');
        var img = new Image();
        img.src = imagesModel[id][i];
        div.appendChild(img);           
        
        var p = document.createElement('p');
        p.innerHTML = titlesModel[id][i];
        p.classList.add('item-name');
        div.appendChild(p);
        div.onclick = addHandlerImageModule(div, 'material');
        modulesArr.modelsElement.appendChild(div);
    }
}

function createCountFragmentsModule(id) {
    for (var i = 0; i < titlesCountFragments[id].length; i++) {
        var div = document.createElement('div');
        div.classList.add('text-type-item');
        
        var p = document.createElement('p');
        p.innerHTML = titlesCountFragments[id][i];
        p.classList.add('text-item-name');
        div.appendChild(p);
        div.onclick = addHandlerTextModule(div, 'count-fragments'); 
        modulesArr.countFragmentsElement.appendChild(div);
    }
}

function createSizeModule(id) {
    for (var i = 0; i < titlesSize[id].length; i++) {
        var div = document.createElement('div');
        div.classList.add('text-type-item');
        
        var p = document.createElement('p');
        p.innerHTML = titlesSize[id][i];
        p.classList.add('text-item-name');
        div.appendChild(p);
        div.onclick = addHandlerImageModule(div, 'size', 'text-item-name'); 
        modulesArr.sizesElement.appendChild(div);
    }
}

function createImageModule(image) {
    var div = document.createElement('div');
    var divCenter = document.createElement('div');
    div.classList.add('item-img');
    divCenter.classList.add('img-center');
    divCenter.appendChild(image); 
    div.appendChild(divCenter);
    div.onclick = addHandlerAddImages(div, image);
    modulesArr.imagesElement.appendChild(div);
}

function createDetailsElements(type, element, currentImageElement) {
    var info, h4, img, layersList, layer, content, imgDiv;
    layersList = document.getElementsByClassName('layers-list')[0];
    layer = document.createElement('div');
    layer.classList.add('layer');
    layer.classList.add(type);
    content = document.createElement('div');
    content.classList.add('layer-content');
    imgDiv = document.createElement('div');
    imgDiv.classList.add('img');
    if (type == 'text') {
        info = document.createElement('div');
        info.classList.add('info');
        h4 = document.createElement('h4');
        h4.classList.add('name-details');
        h4.innerHTML = element.value;
        info.appendChild(h4);
        content.appendChild(imgDiv);
        content.appendChild(info);
        layer.appendChild(content);
        layersList.appendChild(layer);
        layer.element = element;
        layer.onclick = addTextLayerHandler(element);
    }
    else if (type == 'image') {
        img = document.createElement('img');
        img.src = element.src;
        h4 = document.createElement('h4');
        h4.innerHTML = 'Моя картинка';
        imgDiv.appendChild(img);
        content.appendChild(imgDiv);
        content.appendChild(h4);
        layer.appendChild(content);
        layersList.appendChild(layer);
        layer.element = currentImageElement;
        layer.onclick = addImageLayerHandler(currentImageElement);
    }
}

function createCurrentWidgetElement(image) {
    var img = document.getElementById('current-image');
    img.src = image.src;
    
    
    buttonShowDetails = widgets['images'].getElementsByClassName('crumbs')[0];
    buttonShowDetails.onclick = function() {
        showComposition();
    }
}

function addImageLayerHandler(element){
    return function() {
        showDetails(); 
        currentImageElement = element;
        canvasFront.width = canvasFront.width;
        drawAllImgElements();
        drawAllTextElements();
        showAssistedCanvas();
        showDetails();
    }
}

function addTextLayerHandler(element){
    return function() {
        showDetails(); 
        currentTextElement = element;
        canvasFront.width = canvasFront.width;
        drawAllImgElements();
        drawAllTextElements();
        showAssistedCanvas();
        showDetails();
    }
}

function createFonts(){
    var fontList = document.getElementsByClassName('font-list')[0];
    for (var index in fontsArr){
        var li = document.createElement('li');
        var div = document.createElement('div');
        div.innerHTML = fontsArr[index];
        li.style.fontFamily = fontsArr[index];
        li.appendChild(div);
        li.onclick = addHandlerFonts(li, fontsArr[index]);
        fontList.appendChild(li);
    }
    creatingFonts = true;
}

function addHandlerFonts(element, font){
    return function() {
        var fontList = document.getElementsByClassName('font-list')[0];
        var fonts = fontList.getElementsByTagName('li');
        for (var i = 0; i < fonts.length; i++) {
            fonts[i].classList.remove('active');
        }
        element.classList.add('active');
        currentTextElement.font = font;
        console.log(currentTextElement);
        drawTextOnAssistedCanvas();
    }
}