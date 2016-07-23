var canvas, ctx,
    ctxt,
    items, closer,
    itemsElement, 
    controlsElement,
    controls,
    typeElement,
    widgets = [],
    currentTextElement,
    currentImageElement;

canvas = document.getElementById("canvas");
canvas.height = 600;
canvas.width = window.innerWidth * 0.8;

canvases.style.width = window.innerWidth * 0.8 + 'px'; 


var canvas = new fabric.Canvas('canvas');

var mainImg, mainImgX = (canvas.width) / 2;

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

//Set right retreat all modules
for (var name in modulesArr) {
    modulesArr[name].style.right =  window.innerWidth * 0.1 + 125 + 'px'; 
}
//Close all modules
closer = document.getElementsByClassName("closer");
for (var name in closer) {
   closer[name].onclick = addHandlersCloser(); 
}
function addHandlersCloser() {
    return function() {
        hideAllModules();
    } 
}

var colorElement = document.getElementById('valueInput');
colorElement.onchange = function() {
    console.log(colorElement.value);
    changeColorMainImage();
}
function changeColorMainImage() {
    var colorThief = new ColorThief();
    var color = colorThief.getColor(image);
    var imageData,
        red, green, blue;  
    red = parseInt(colorElement.value.slice(0,2), 16);
    green = parseInt(colorElement.value.slice(2,4), 16);
    blue = parseInt(colorElement.value.slice(4,6), 16);
    
    fabric.Image.filters.ChangeColor = fabric.util.createClass({
        type: 'ChangeColor',
        applyTo: function(canvasEl) {
        var context = canvasEl.getContext('2d'),
        imageData = context.getImageData(0, 0,
        canvasEl.width, canvasEl.height),
        data = imageData.data;
        for (var i = 0, len = data.length; i < len; i += 4) {
            if (data[i + 0] > color[0] - 10 && data[i + 0] < color[0] + 10 &&
                data[i + 1] > color[1] - 10 && data[i + 1] < color[1] + 10 &&
                data[i + 2] > color[2] - 10 && data[i + 2] < color[2] + 10) {
                data[i] = red; 
                data[i + 1] = green;
                data[i + 2] = blue;
                data[i + 3] = 255;   
        }
        else {
            if (data[i] && data[i + 1] && data[i + 2]) {
                var a = (255 - Math.min(red, green, blue)) / 1.8;
                data[i + 0] = data[i + 0] - a;  
                data[i + 1] = data[i + 1] - a;
                data[i + 2] = data[i + 2] - a;
                data[i + 3] = 255;    
            }
        }
        }
        context.putImageData(imageData, 0, 0);
        }
    });
    canvas.remove(mainImg);
    fabric.Image.fromURL(image.src, function(img) {
        img.filters.push(new fabric.Image.filters.ChangeColor());
        img.applyFilters(canvas.renderAll.bind(canvas));
        img.set("selectable", false);
        img.set("left", mainImgX - image.width/(2/imgScale));
        img.set("top", 100);
        canvas.add(img);
        mainImg = img;
    });    
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

var fontsArr = ['Andika', 'Anonymous', 'Bad Script', 'Ubuntu'],
    fontList = document.getElementsByClassName('font-list')[0];

function showComposition() {
    widgets['layers'].style.display = 'block';
    widgets['text'].style.display = 'none';
    widgets['images'].style.display = 'none';
}

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

var AddTextElement = document.getElementsByClassName('text')[0];
var AddImageElement = document.getElementsByClassName('image')[0];

AddTextElement.onclick = function() {
    var text = new fabric.Text('Мой текст', { left: mainImgX - 90, top: 150 });
    canvas.add(text);
    createDetailsElements('text', text);
    showDetails('text', text);
    canvas.setActiveObject(text);
    currentTextElement = text;
};

function showDetails(type, element) {
    widgetElement.style.display = 'block';
    widgets['layers'].style.display = 'none';
    if (type == 'text') {
        widgets['text'].style.display = 'block';
        widgets['images'].style.display = 'none';
        textArea.value = element.text;
        
    }
    else if (currentImageElement) {
        widgets['images'].style.display = 'block';
        widgets['text'].style.display = 'none';
    }       
}

// get current element
document.onclick = function() {
    if (canvas.getActiveObject()) {
        if (canvas.getActiveObject().text) {
            currentTextElement = canvas.getActiveObject();
            textArea.value = currentTextElement.text;  
            widgets['layers'].style.display = 'none';
            widgets['text'].style.display = 'block';
            widgets['images'].style.display = 'none';
        }
        else {
            currentImageElement = canvas.getActiveObject();
            widgets['layers'].style.display = 'none';
            widgets['text'].style.display = 'none';
            widgets['images'].style.display = 'block';
        }
    }
    else {
        widgets['layers'].style.display = 'block';
        widgets['text'].style.display = 'none';
        widgets['images'].style.display = 'none';
    }
}

var textArea = document.getElementById('input-text');
textArea.oninput = function() {
    canvas.setActiveObject(currentTextElement);
    currentTextElement.text = textArea.value;
    canvas.setActiveObject(currentTextElement);
    var layers = document.getElementsByClassName('layers-list')[0].getElementsByClassName('text');
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].element == currentTextElement) {
            var h4 = layers[i].getElementsByClassName('name-details')[0];
            h4.innerHTML = textArea.value;
            break;
        }
    }
}; 


var fontControls = [];
fontControls['bold'] = widgets['text'].getElementsByClassName('bold')[0];
fontControls['italic'] = widgets['text'].getElementsByClassName('italic')[0];
var underLineElement = widgets['text'].getElementsByClassName('underline')[0];
var textAlign = [];
textAlign['left'] = widgets['text'].getElementsByClassName('align-left')[0];
textAlign['center'] = widgets['text'].getElementsByClassName('align-center')[0];
textAlign['right'] = widgets['text'].getElementsByClassName('align-right')[0];
var fontElement = widgets['text'].getElementsByClassName('font')[0];
creatingFonts = false;

var imageCopy = document.getElementById('image-copy'),
    imageDelete = document.getElementById('image-delete'),
    textCopy = document.getElementById('text-copy'),
    textDelete = document.getElementById('text-delete');

imageCopy.onclick = function() {
    currentImageElement = fabric.util.object.clone(currentImageElement);
    createDetailsElements("image", currentImageElement, currentImageElement.image);
    currentImageElement.set('top', currentImageElement.top + 25);
    currentImageElement.set('left', currentImageElement.left + 25);
    canvas.add(currentImageElement);
    canvas.setActiveObject(currentImageElement);
}
imageDelete.onclick = function() {
    var layersList = document.getElementsByClassName('layers-list')[0], layers = layersList.getElementsByClassName('layer');
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].element == currentImageElement) {
            layers[i].parentNode.removeChild(layers[i]);
            break;
        }
    }
    canvas.remove(currentImageElement);
    widgets['layers'].style.display = 'block';
    widgets['images'].style.display = 'none';
}

textCopy.onclick = function() {
    currentTextElement = fabric.util.object.clone(currentTextElement);
    createDetailsElements("text", currentTextElement);
    currentTextElement.set('top', currentTextElement.top + 25);
    currentTextElement.set('left', currentTextElement.left + 25);
    canvas.add(currentTextElement);
    canvas.setActiveObject(currentTextElement); 
}
textDelete.onclick = function() {
    var layersList = document.getElementsByClassName('layers-list')[0], layers = layersList.getElementsByClassName('layer');
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].element == currentTextElement) {
            layers[i].parentNode.removeChild(layers[i]);
            break;
        }
    }
    canvas.remove(currentTextElement);
    widgets['layers'].style.display = 'block';
    widgets['text'].style.display = 'none';
}

fontElement.onclick = function() {
    if (!creatingFonts) {
        createFonts();
    }
    fontList.style.display = 'block';
}

var textColorElement = document.getElementById('text-color-input');
textColorElement.onchange = function() {
    currentTextElement.setColor('#' + textColorElement.value);
    canvas.setActiveObject(currentTextElement);
}

for (var name in fontControls) {
    fontControls[name].onclick = addFontAlignHandlers(fontControls[name], 'fontStyle', name, fontControls);
}
for (var name in textAlign) {
    textAlign[name].onclick = addFontAlignHandlers(textAlign[name], 'textAlign', name, textAlign);
}
// Choose font or text-align
function addFontAlignHandlers(element, type, style, arr) {
    return function() {
        canvas.setActiveObject(currentTextElement);
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
        canvas.setActiveObject(currentTextElement);
    }
}
underLineElement.onclick = function() {
    if (underLineElement.classList.contains('active')) {
        underLineElement.classList.remove('active');
        currentTextElement['textDecoration'] = '';
    }
    else {
        underLineElement.classList.add('active');
        currentTextElement['textDecoration'] = 'underline';
    }
    canvas.setActiveObject(currentTextElement);
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

// click on products
function addHandlerItems(item) {
    return function () {
        image = new Image();
        image.src = item.getElementsByTagName('img')[0].src;
        imgScale = (canvas.width / 2) / image.width < (canvas.height / 1.2) / image.height ? (canvas.width / 2) / image.width :  (canvas.height / 1.2) / image.height;
        if (mainImg) {
            canvas.remove(mainImg);    
        }
        console.log(imgScale);
        fabric.Image.fromURL(image.src, function(img) {
            img.scale(imgScale);
            img.set("selectable", false);
            img.set("left", mainImgX - (image.width / 2) * (imgScale));
            img.set("top", 100);
            canvas.add(img);
            mainImg = img;
        });
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
// select type of products
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
        canvas.remove(mainImg);
        fabric.Image.fromURL(image.src, function(img) {
            img.scale(imgScale);
            img.set("selectable", false);
            img.set("left", mainImgX - image.width/(2/imgScale));
            img.set("top", 100);
            canvas.add(img);
            mainImg = img;
        });
        hideAllModules();
    }
}

function addHandlerAddImages(item, image, width) {
    return function() {
        fabric.Image.fromURL(image.src, function(img) {
            img.scale(mainImg.width / width);
            img.set("left", mainImgX - (mainImg.width / 2));
            img.set("top", 125);
            canvas.add(img);
            currentImageElement = img;
            currentTextElement = undefined;
            hideAllModules();  
            showDetails();
            createCurrentWidgetElement(image);
            createDetailsElements('image', currentImageElement, image);
        });
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
    div.onclick = addHandlerAddImages(div, image, image.width);
    modulesArr.imagesElement.appendChild(div);
}

function createDetailsElements(type, element, image) {
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
        h4.innerHTML = element.text;
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
        img.src = image.src;
        h4 = document.createElement('h4');
        h4.innerHTML = 'Моя картинка';
        imgDiv.appendChild(img);
        content.appendChild(imgDiv);
        content.appendChild(h4);
        layer.appendChild(content);
        layersList.appendChild(layer);
        layer.element = element;
        element.image = image;
        layer.onclick = addImageLayerHandler(element);
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
        currentImageElement = element;
        showDetails(); 
        canvas.setActiveObject(currentImageElement);
    }
}

function addTextLayerHandler(element){
    return function() {
        currentTextElement = element;
        showDetails(); 
        canvas.setActiveObject(currentTextElement);
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
        currentTextElement.fontFamily = font;
        canvas.setActiveObject(currentTextElement);
    }
}