(function(){
"use strict";
var button=document.querySelector("#music-main-toggle");if(!button)return;
var label=document.querySelector("#music-main-label"),icon=document.querySelector(".music-main-icon"),elapsed=document.querySelector("#music-elapsed"),total=document.querySelector("#music-total"),seek=document.querySelector("#music-seek"),status=document.querySelector("#music-status");
var engine;try{engine=window.parent!==window&&window.parent.UniverseMusic?window.parent.UniverseMusic:window.UniverseMusic;}catch(e){engine=window.UniverseMusic;}
if(!engine){status.textContent="Não foi possível carregar o player.";button.disabled=true;return;}
var fmt=function(v){var s=Math.floor(Number(v)||0);return Math.floor(s/60)+":"+String(s%60).padStart(2,"0");};
button.addEventListener("click",function(){engine.toggle();});seek.addEventListener("input",function(){engine.seek(seek.value);});
function draw(){var s=engine.getState();icon.textContent=s.playing?"❚❚":"▶";label.textContent=s.playing?"Pausar nossa música":"Dar play na nossa música";button.setAttribute("aria-label",s.playing?"Pausar nossa música":"Reproduzir nossa música");document.body.classList.toggle("is-music-playing",s.playing);elapsed.textContent=fmt(s.currentTime);total.textContent=fmt(s.duration);if(!seek.matches(":active"))seek.value=s.duration?String(100*s.currentTime/s.duration):"0";status.textContent=s.error|| (s.playing?"Nossa música está tocando. Pode continuar a história! ♥":s.currentTime>0?"Pausada. Toque para continuar.":"Toque em Play para começar do início.");}
draw();setInterval(draw,450);
})();
