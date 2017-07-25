function createPillow() {
  $('.text-module').bind('click', function() {
    var size = $('.in .size').text();
    image = new Image();
    if (size == '35x35 cm') {
      image.src = 'create/images/pillows/DSC_0177.png';
    } else if (size == '35х45 cm') {
      image.src = 'create/images/pillows/DSC_0188.png';
    }
    
    image.onload = function() {
      imgScale = (canvas.width / 2) / image.width < 
      (canvas.height / 1.2) / image.height ? (canvas.width / 2) / image.width : (canvas.height / 1.2) / image.height;
      canvas.clear();
    
      fabric.Image.fromURL(image.src, function(img) {
        img.scale(imgScale);
        img.set('selectable', false);
        img.set('left', mainImgX - image.width / (2 / imgScale));
        img.setTop(0);
        canvas.add(img);
        mainImg = img;

        var layers = document.getElementsByClassName('layer');
        console.log(layers);
        for (var i = 0; i < layers.length; i++) {
          canvas.add(layers[i].element);
        }
      });
      hideAllModules(); 
    }
  });
}
