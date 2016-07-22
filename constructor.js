var canvas, ctx,
    ctxt,
    items, closer,
    itemsElement, 
    controlsElement,
    controls,
    typeElement,
    widgets = [];

canvas = document.getElementById("canvas");
canvas.height = 600;
canvas.width = window.innerWidth * 0.8;
canvases.style.width = window.innerWidth * 0.8 + 'px'; 
//ctx = canvas.getContext('2d');
canvas = new fabric.Canvas('canvas');
var staticCanvas = new fabric.StaticCanvas('canvas');


var mainImgX = (canvas.width) / 2;

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
    canvas.width = canvas.width;
    ctx.putImageData(newData, mainImgX - image.width/(2/imgScale), 100);
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

//var canvasPosition = canvas.getBoundingClientRect();
var mouseX = 0, mouseY = 0;
var currentTextElement;
var currentImageElement;

var AddTextElement = document.getElementsByClassName('text')[0];
var AddImageElement = document.getElementsByClassName('image')[0];

AddTextElement.onclick = function() {
    
    showDetails();
    createDetailsElements('text', currentTextElement, currentTextElement);
};

var transElements = document.getElementsByClassName('trans')[0],
    transArr = [];
transArr['canvas-text'] = document.getElementsByClassName('canvas-text')[0];


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
        canvas.width = canvas.width;
        image = new Image();
        image.src = item.getElementsByTagName('img')[0].src;
        imgScale = (canvas.width / 2) / image.width < 
            (canvas.height / 1.2) / image.height ? (canvas.width / 2) / image.width :  (canvas.height / 1.2) / image.height;
        
        ctx.drawImage(image, mainImgX - image.width/(2/imgScale), 100, image.width * imgScale, image.height * imgScale);
        imageDataMainImage = ctx.getImageData(mainImgX - image.width/(2/imgScale), 100, image.width * imgScale, image.height * imgScale);
        
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
        canvas.width = canvas.width;
        var name = item.getElementsByClassName(className)[0].textContent;
        selectedElements[module].style.display = 'inline-block';
        selectedElements[module].innerHTML = name;
        image = new Image();
        image.src = item.getElementsByTagName('img')[0].src;
        imgScale = (canvas.width / 2) / image.width < 
            (canvas.height / 1.2) / image.height ? (canvas.width / 2) / image.width :  (canvas.height / 1.2) / image.height;
        
        ctx.drawImage(image, mainImgX - image.width/(2/imgScale), 100, image.width * imgScale, image.height * imgScale);
        dataOfOrder[module] = name;
        imageDataMainImage = ctx.getImageData(mainImgX - image.width/(2/imgScale), 100, image.width * imgScale, image.height * imgScale);
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