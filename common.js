var filesElement, files,
    canvases = [], fabricCanvas = [],
    body,
    images = [], canvasesElements, 
    editCanvasElement, fabricEditCanvas,
    editScale = 0.4,
    logos = [],
    downloadsElement,
    countPhotoElement,
    countPhoto = 2;

filesElement = document.getElementById('files');
body = document.getElementsByTagName('body')[0];
canvasesElements = document.getElementById("canvases");
editCanvasElement = document.getElementById("edit-canvas");
downloadsElement = document.getElementById("downloads");
countPhotoElement = document.getElementById("count-photo");

window.onload = function(){
    
    if(window.File && window.FileList && window.FileReader) {
        
        $("#files").bind("change", function(event){
            
            var files = event.target.files;
            for(var i = 0; i< files.length; i++)
            {
                var file = files[i];
                
                //Only pics
                if(!file.type.match('image'))
                  continue;
                
                var picReader = new FileReader();
                
                picReader.onload = getImage(i);
                picReader.readAsDataURL(file);
            }                               
        });
        
        $("#logo").bind("change", function(event){
            
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

function getImage(i){
    return function(event) {
        var picFile = event.target;   
        images[i] = new Image();
        images[i].src = picFile.result;
        images[i].onload = createCanvas(i);
    }
}
    
function createCanvas(i){
    return function() {
        console.log(i);
        var scale, width, div, a;
        
        div = document.createElement('div');
        a = document.createElement('a');
        a.id = "download" + i;
        a.onclick = downloadCanvas(i, a, "test.png");
        a.innerHTML = i + 1 + "";
        
        canvases[i] = document.createElement("canvas");
        canvases[i].id = "canvas" + i;
        
        width = (window.innerWidth - 100) / countPhoto;
        scale = images[i].width / width;
        if(scale > 1) {
            canvases[i].width = images[i].width / scale;
            canvases[i].height = images[i].height/ scale;    
        }
        else {
            canvases[i].width = images[i].width;
            canvases[i].height = images[i].height;
        }
        
        div.appendChild(canvases[i]);
        canvasesElements.appendChild(div);
        downloadsElement.appendChild(a);
        
        
        fabricCanvas[i] = new fabric.Canvas("canvas" + i);
        fabricCanvas[i].imageScale = 1 / scale;
        drawMainPhotos(i, 1/scale);
        if(i == 0) {
            createEditField(scale);
        }
    }
}

function drawMainPhotos(i, imgScale){
    fabric.Image.fromURL(images[i].src, function(img) {
        img.scale(imgScale);
        img.set("selectable", false);
        fabricCanvas[i].add(img);
    });
}

function createEditField(scale){
    editCanvasElement.width = images[0].width / scale * editScale;
    editCanvasElement.height = images[0].height / scale * editScale;
    fabricEditCanvas = new fabric.Canvas("edit-canvas");
    $("#edit-field").css({
        display:"block",
        width: images[0].width / scale * editScale + 'px',
        height: images[0].height / scale * editScale + 'px'
    });
    fabric.Image.fromURL(images[0].src, function(img) {
        img.scale(1 / scale * editScale);
        img.set("selectable", false);
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

$("#edit-field").bind("mouseup", function() {
   reDraw();
});

function reDraw() {
    var objects = fabricEditCanvas._objects.slice(1);
    $(fabricCanvas).each(function(index, canvas){
        $(canvas._objects).each(function(index, element) {
            if (index > 0) {
                canvas.remove(element);
            }
        });
        $(objects).each(function(index, logo){
           logo = fabric.util.object.clone(logo);
           console.log(logo);
           logo.scale(logo.scaleX * (1 / editScale));
           logo.set("top", logo.top * (1 / editScale));
           logo.set("left", logo.left * (1 / editScale));
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