function createPuzzle() {
    $(".count-fragments").css("display", "none");
   
    $(".text-module").bind("click", function() {
        $(".count-fragments").show("normal");
        var size = $(".in .size").text();
        if (size == 'А3') {
            $(".text-type-item").each(function(){
                this.style.display = 'block';
            });     
        }
        if (size == 'A4') {
            if (selectedElements['count-fragments'].textContent == '240 шт') {
                selectedElements['count-fragments'].innerHTML = '';   
            }
            $(".text-type-item").each(function(){
                if (this.textContent == '240 шт') {
                   this.style.display = 'none';
               }
            });     
        }    
    });
}