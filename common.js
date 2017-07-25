var filesElement, files,
    canvases = [], fabricCanvas = [],
    body,
    images = [], canvasesElements, 
    editCanvasElement, fabricEditCanvas,
    editScale = 0.4,
    logos = [],
    downloadsElement,
    countPhotoElement,
    countPhoto = 2,
    addTextElement,
    textWidget;

filesElement = document.getElementById('files');
body = document.getElementsByTagName('body')[0];
canvasesElements = document.getElementById('canvases');
editCanvasElement = document.getElementById('edit-canvas');
downloadsElement = document.getElementById('downloads');
countPhotoElement = document.getElementById('count-photo');
addTextElement = document.getElementById('add-text');
textWidget = document.getElementsByClassName('widget')[0];

window.onload = function() {
  if(window.File && window.FileList && window.FileReader) {
    $('#files').bind('change', function(event) {
      var files = event.target.files;
      for(var i = 0; i< files.length; i++) {
        var file = files[i];
        if(!file.type.match('image')) {
          continue;
        }
        var picReader = new FileReader();
        picReader.onload = getImage(i);
        picReader.readAsDataURL(file);
      }                               
    });
      
    $('#logo').bind('change', function(event) {
      var file = event.target.files[0];
      var logoReader = new FileReader();
      logoReader.onload = function(event) {
        var logoFile = event.target;   
        logos.push(new Image());
        logos[logos.length - 1].src = logoFile.result;
        logos[logos.length - 1].onload = drawLogos();
      };
      logoReader.readAsDataURL(file);                                  
    });
  }
}

function getImage(i) {
  return function(event) {
    var picFile = event.target;   
    images[i] = new Image();
    images[i].src = picFile.result;
    images[i].onload = createCanvas(i);
  }
}
    
function createCanvas(i) {
  return function() {
    var scale, width, div, a;
    
    div = document.createElement('div');
    a = document.createElement('a');
    a.id = 'download' + i;
    a.onclick = downloadCanvas(i, a, 'test.png');
    a.innerHTML = i + 1 + '';
    
    canvases[i] = document.createElement('canvas');
    canvases[i].id = 'canvas' + i;
    
    width = (window.innerWidth - 100) / countPhoto;
    scale = images[i].width / width;
    if(scale > 1) {
      canvases[i].width = images[i].width / scale;
      canvases[i].height = images[i].height/ scale;    
    } else {
      canvases[i].width = images[i].width;
      canvases[i].height = images[i].height;
    }
    
    div.appendChild(canvases[i]);
    canvasesElements.appendChild(div);
    downloadsElement.appendChild(a);
    
    fabricCanvas[i] = new fabric.Canvas('canvas' + i);
    fabricCanvas[i].imageScale = 1 / scale;
    drawMainPhotos(i, 1 / scale);
    if(i == 0) {
      createEditField(scale);
    }
  }
}

function drawMainPhotos(i, imgScale) {
  fabric.Image.fromURL(images[i].src, function(img) {
    img.scale(imgScale);
    img.set('selectable', false);
    fabricCanvas[i].add(img);
  });
}

function createEditField(scale) {
  editCanvasElement.width = images[0].width / scale * editScale;
  editCanvasElement.height = images[0].height / scale * editScale;
  fabricEditCanvas = new fabric.Canvas("edit-canvas");
  $('#edit-field').css({
    display: 'block',
    width: images[0].width / scale * editScale + 'px',
    height: images[0].height / scale * editScale + 'px'
  });
  fabric.Image.fromURL(images[0].src, function(img) {
    img.scale(1 / scale * editScale);
    img.set('selectable', false);
    fabricEditCanvas.add(img);
  });
}

function drawLogos() {
  fabric.Image.fromURL(logos[logos.length - 1].src, function(img) {
    img.scale(0.2);
    fabricEditCanvas.add(img);
    reDraw();
  });
}

$('#edit-field').bind('mouseup', function() {
  reDraw();
});

function reDraw() {
  var objects = fabricEditCanvas._objects.slice(1);
  $(fabricCanvas).each(function(index, canvas) {
    $(canvas._objects).each(function(index, element) {
      if (index > 0) {
        canvas.remove(element);
      }
    });
    $(objects).each(function(index, logo){
      logo = fabric.util.object.clone(logo);
      logo.scale(logo.scaleX * (1 / editScale));
      logo.set('top', logo.top * (1 / editScale));
      logo.set('left', logo.left * (1 / editScale));
      canvas.add(logo);    
    });       
  });
}

document.onkeyup = function(e) {
  if (e.keyCode == 46) {
    fabricEditCanvas.remove(fabricEditCanvas.getActiveObject());
    reDraw();
  }
}

function downloadCanvas(i, link, filename) {
  return function() {
    link.href = fabricCanvas[i].toDataURL('png');
    link.download = filename;   
  }
}

countPhotoElement.onchange = function() {
  countPhoto = this.value;
}

$('#add-text').click(function() {   
  $('.widget-text').toggle('slows');
  $('#add-text').toggleClass('active');
  if($('#add-text').hasClass('active')) {
    this.value = 'Згорнути';
    var text = new fabric.Text('Мой текст', {left: 10, top: 100});
    fabricEditCanvas.add(text); 
    fabricEditCanvas.setActiveObject(text);
    currentTextElement = text;
  }
  if(!$('#add-text').hasClass('active')) {
    this.value = 'Добавити текст';
  }
});

var textArea = document.getElementById('input-text');
textArea.oninput = function() {
  currentTextElement = fabricEditCanvas.getActiveObject();
  currentTextElement.text = textArea.value;
  fabricEditCanvas.setActiveObject(currentTextElement); 
}; 

var textColorElement = document.getElementById('text-color-input');
textColorElement.onchange = function() {
  currentTextElement.setColor('#' + textColorElement.value);
  fabricEditCanvas.setActiveObject(currentTextElement);
}



var widgetElement = document.getElementsByClassName('widgets')[0],
    buttonShowDetails;
widgets = [];
widgets['text'] = document.getElementsByClassName('widget-text')[0];
widgets['layers'] = document.getElementsByClassName('widget-layers')[0];
widgets['images'] = document.getElementsByClassName('widget-image')[0];

var fontsArr = ['Andika', 'Anonymous', 'Bad Script', 'Ubuntu'],
    fontList = document.getElementsByClassName('font-list')[0];

var fontControls = [];
fontControls['bold'] = widgets['text'].getElementsByClassName('bold')[0];
fontControls['italic'] = widgets['text'].getElementsByClassName('italic')[0];
var underLineElement = widgets['text'].getElementsByClassName('underline')[0];
var fontElement = widgets['text'].getElementsByClassName('font')[0];
creatingFonts = false;

fontElement.onclick = function() {
  if (!creatingFonts) {
    createFonts();
  }
  fontList.style.display = 'block';
}

for (var name in fontControls) {
  fontControls[name].onclick = addFontAlignHandlers(fontControls[name], 'fontStyle', name, fontControls);
}

// Choose font or text-align
function addFontAlignHandlers(element, type, style, arr) {
  return function() {
    fabricEditCanvas.setActiveObject(currentTextElement);
    for (var name in arr) {
      if(name != style) {
        arr[name].classList.remove('active');   
      }
    }
    if (element.classList.contains('active')) {
      element.classList.remove('active');
      currentTextElement[type] = '';
    } else {
      element.classList.add('active');
      currentTextElement[type] = style;
    }
    fabricEditCanvas.setActiveObject(currentTextElement);
  }
}

underLineElement.onclick = function() {
  if (underLineElement.classList.contains('active')) {
    underLineElement.classList.remove('active');
    currentTextElement['textDecoration'] = '';
  } else {
    underLineElement.classList.add('active');
    currentTextElement['textDecoration'] = 'underline';
  }
  fabricEditCanvas.setActiveObject(currentTextElement);
};

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
    fabricEditCanvas.setActiveObject(currentTextElement);
  }
}
