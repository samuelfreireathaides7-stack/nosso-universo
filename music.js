(function(){
"use strict";
var sameParent=false;try{sameParent=window.parent!==window && !!window.parent.UniverseMusic;}catch(e){}
if(sameParent){
  document.addEventListener("click",function(e){var a=e.target.closest("a[data-chapter-link]");if(!a)return;var name=new URL(a.href,document.baseURI).pathname.split("/").pop();if(name==="index.html"){e.preventDefault();e.stopImmediatePropagation();window.parent.UniverseRouter.showHome();}},true);
  return;
}
var audio=new Audio(new URL("assets/audio/nossa-musica.mp3",document.baseURI).href);
audio.preload="metadata";
var error="";
var dock=document.createElement("aside");
dock.id="music-dock";dock.className="music-dock";dock.hidden=true;
dock.setAttribute("aria-label","Nossa música");
dock.innerHTML='<button type="button" class="music-dock__toggle" aria-label="Reproduzir música">▶</button><div class="music-dock__info"><b>Planos <span>♥</span></b><small>BK’ · Luccas Carlos</small><div class="music-dock__time"><span id="dock-time">0:00</span><input type="range" min="0" max="100" value="0" step="0.1" aria-label="Avançar música"></div></div>';
document.body.appendChild(dock);
var toggleButton=dock.querySelector("button"),slider=dock.querySelector("input"),timestamp=dock.querySelector("#dock-time");
var format=function(seconds){var s=Math.max(0,Math.floor(Number(seconds)||0));return Math.floor(s/60)+":"+String(s%60).padStart(2,"0");};
var state=function(){return{playing:!audio.paused&&!audio.ended,currentTime:audio.currentTime||0,duration:Number.isFinite(audio.duration)?audio.duration:219,error:error,ready:audio.readyState>0};};
function sync(){var s=state();toggleButton.textContent=s.playing?"❚❚":"▶";toggleButton.setAttribute("aria-label",s.playing?"Pausar música":"Reproduzir música");timestamp.textContent=format(s.currentTime);if(!slider.matches(":active"))slider.value=s.duration?String(100*s.currentTime/s.duration):"0";document.body.classList.toggle("is-music-playing",s.playing);}
function play(){error="";dock.hidden=false;var p=audio.play();if(p&&p.catch)p.catch(function(e){error=e&&e.name==="NotAllowedError"?"Toque em Play para iniciar.":"O áudio completo não está disponível no site publicado. Você pode ouvir no Spotify.";sync();});sync();}
function pause(){audio.pause();sync();}
function toggle(){if(audio.paused)play();else pause();}
function seek(v){if(Number.isFinite(audio.duration)&&audio.duration>0){audio.currentTime=Math.max(0,Math.min(100,Number(v)||0))*audio.duration/100;sync();}}
window.UniverseMusic={play:play,pause:pause,toggle:toggle,seek:seek,getState:state,reveal:function(){dock.hidden=false;}};
toggleButton.addEventListener("click",toggle);slider.addEventListener("input",function(){seek(slider.value);});
["play","pause","timeupdate","loadedmetadata","ended","seeked","error"].forEach(function(type){audio.addEventListener(type,function(){if(type==="error")error="O áudio completo não está hospedado aqui. Use o link do Spotify.";sync();});});
if(document.body.dataset.chapter!=="1")return;
var frame=document.createElement("iframe");frame.id="universe-chapter-frame";frame.title="Capítulo do Nosso Universo";frame.hidden=true;document.body.appendChild(frame);
function isHome(href){var name=new URL(href,document.baseURI).pathname.split("/").pop();return !name||name==="index.html";}
function showHome(){frame.hidden=true;frame.removeAttribute("src");document.body.classList.remove("is-universe-chapter-open");window.scrollTo(0,0);}
function openChapter(href){var url=new URL(href,document.baseURI);if(url.origin!==location.origin){location.href=url.href;return;}if(isHome(url.href)){showHome();return;}frame.hidden=false;document.body.classList.add("is-universe-chapter-open");frame.src=url.href;}
window.UniverseRouter={showHome:showHome,openChapter:openChapter};
document.addEventListener("click",function(e){var a=e.target.closest("a[data-chapter-link]");if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.altKey||e.shiftKey)return;var url=new URL(a.href,document.baseURI);if(url.origin!==location.origin)return;e.preventDefault();e.stopImmediatePropagation();if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)openChapter(url.href);else setTimeout(function(){openChapter(url.href);},190);},true);
frame.addEventListener("load",function(){var child;try{child=frame.contentDocument;}catch(e){return;}if(!child||!child.body)return;child.body.classList.add("is-framed-chapter");frame.title=child.title||"Capítulo do Nosso Universo";child.addEventListener("play",function(e){if(e.target.tagName==="VIDEO"&&!audio.paused)pause();},true);});
})();
