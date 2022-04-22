// accordion func
let acc = document.getElementsByClassName("accordion");
let i;

for (i = 0; i < acc.length; i++) {
  acc[i].onclick = function() {

	if( !this.classList.contains('active') ){
    	closeAll();
    }
	
  this.classList.toggle("active");
    let panel = this.nextElementSibling;
    if (panel.style.maxHeight){
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    } 
  }
}

function closeAll(){
  for (i = 0; i < acc.length; i++) {
     acc[i].classList.remove("active");
       acc[i].nextElementSibling.style.maxHeight = null;
   }
}