(function(){
"use strict";
var slot=document.getElementById("youtube-slot");
if(!slot)return;
var engine;
try{engine=window.parent!==window && window.parent.UniverseYouTube ? window.parent.UniverseYouTube : window.UniverseYouTube;}catch(_){engine=window.UniverseYouTube;}
if(!engine){
  slot.textContent="O player não carregou. Utilize o link oficial do YouTube abaixo.";
  return;
}
engine.show();
document.addEventListener("scroll",function(){engine.relocate();},{passive:true});
window.addEventListener("resize",function(){engine.relocate();},{passive:true});
})();