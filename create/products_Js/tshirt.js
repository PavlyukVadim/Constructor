function createTshirt() {
    var colors = [{color:"White"},{color:"Black"},{color:"Transparent"}];
    for (var i = 0; i < colors.length; i++) {
        var theData = colors[i];
        var theTemplateScript = $("#colorT").html();
        var theTemplate = Handlebars.compile(theTemplateScript);
        $("#color-list").append(theTemplate(theData));
    }
    
    $(".example").each(function(index, element){
        var color = element.id;
        $(element).css("background-color", color);  
    });
    
    $("#color-list li").bind("click", function() {
        var color = $("p", this).text();
        selectedElements['color'].innerHTML = color;
        $("#colors").css("display", "none"); 
    });  
}