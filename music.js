(function(){
"use strict";
// Um único player oficial do YouTube fica no documento principal.
// Assim, ele não é recarregado quando os capítulos abrem no iframe interno.
var inParent=false;
try{inParent=window.parent!==window && Boolean(window.parent.UniverseYouTube);}catch(_){}
if(inParent){
  document.addEventListener("click",function(event){
    var a=event.target.closest("a[data-chapter-link]");
    if(!a)return;
    var file=new URL(a.href,document.baseURI).pathname.split("/").pop();
    if(file==="index.html"||file===""){
      event.preventDefault();
      event.stopImmediatePropagation();
      window.parent.UniverseRouter.showHome();
    }
  },true);
  return;
}
var shell=document.createElement("aside");
shell.id="youtube-shell";
shell.className="youtube-shell";
shell.hidden=true;
shell.setAttribute("aria-label","Player oficial do YouTube: Planos");
shell.innerHTML='<div class="youtube-shell__heading"><span>♪ Nossa música · Planos</span><a href="https://www.youtube.com/watch?v=V141wUSkTfk" target="_blank" rel="noopener noreferrer" aria-label="Ver Planos no YouTube">YouTube ↗</a></div><div class="youtube-shell__video"></div>';
document.body.appendChild(shell);
var videoFrame=null,hasOpened=false,activeDoc=null;
function ensureVideo(){
  if(videoFrame)return;
  videoFrame=document.createElement("iframe");
  videoFrame.title="YouTube: Planos — BK’ com Luccas Carlos";
  videoFrame.setAttribute("allow","autoplay; encrypted-media; picture-in-picture; fullscreen");
  videoFrame.setAttribute("allowfullscreen","");
  videoFrame.setAttribute("referrerpolicy","strict-origin-when-cross-origin");
  videoFrame.loading="eager";
  videoFrame.src="https://www.youtube.com/embed/V141wUSkTfk?enablejsapi=1&playsinline=1&controls=1&rel=0&origin="+encodeURIComponent(location.origin);
  shell.querySelector(".youtube-shell__video").appendChild(videoFrame);
}
function currentSlot(){
  var doc=null;
  if(window.UniverseRouter && window.UniverseRouter.frame && !window.UniverseRouter.frame.hidden){
    try{doc=window.UniverseRouter.frame.contentDocument;}catch(_){}
  }else if(document.body.dataset.chapter==="2")doc=document;
  return doc&&doc.getElementById("youtube-slot");
}
function relocate(){
  if(!hasOpened)return;
  var slot=currentSlot();
  shell.classList.remove("youtube-shell--attached");
  if(!slot)return;
  var r=slot.getBoundingClientRect();
  // O vídeo e seus controles precisam permanecer inteiros e visíveis na tela.
  if(r.width<245 || r.height<285 || r.top<10 || r.bottom>window.innerHeight-8)return;
  shell.style.setProperty("--youtube-left",r.left+"px");
  shell.style.setProperty("--youtube-top",r.top+"px");
  shell.style.setProperty("--youtube-width",r.width+"px");
  shell.style.setProperty("--youtube-height",r.height+"px");
  shell.classList.add("youtube-shell--attached");
}
function show(){
  hasOpened=true;
  shell.hidden=false;
  ensureVideo();
  relocate();
}
function pause(){
  try{
    if(videoFrame&&videoFrame.contentWindow){
      videoFrame.contentWindow.postMessage(JSON.stringify({event:"command",func:"pauseVideo",args:[]}),"https://www.youtube.com");
    }
  }catch(_){}
}
window.UniverseYouTube={show:show,pause:pause,relocate:relocate};
window.addEventListener("resize",relocate,{passive:true});
window.addEventListener("scroll",relocate,{passive:true});
if(document.body.dataset.chapter!=="1"){
  if(document.body.dataset.chapter==="2"){
    show();
    document.addEventListener("scroll",relocate,{passive:true});
  }
  return;
}
var frame=document.createElement("iframe");
frame.id="universe-chapter-frame";
frame.title="Capítulo do Nosso Universo";
frame.hidden=true;
document.body.appendChild(frame);
function isHome(href){
  var name=new URL(href,document.baseURI).pathname.split("/").pop();
  return !name || name==="index.html";
}
function showHome(){
  frame.hidden=true;
  frame.removeAttribute("src");
  document.body.classList.remove("is-universe-chapter-open");
  window.scrollTo(0,0);
  relocate();
}
function openChapter(href){
  var url=new URL(href,document.baseURI);
  if(url.origin!==location.origin){location.href=url.href;return;}
  if(isHome(url.href)){showHome();return;}
  frame.hidden=false;
  document.body.classList.add("is-universe-chapter-open");
  frame.src=url.href;
  relocate();
}
window.UniverseRouter={showHome:showHome,openChapter:openChapter,frame:frame};
document.addEventListener("click",function(event){
  var a=event.target.closest("a[data-chapter-link]");
  if(!a || event.defaultPrevented || event.button!==0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)return;
  var url=new URL(a.href,document.baseURI);
  if(url.origin!==location.origin)return;
  event.preventDefault();
  event.stopImmediatePropagation();
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)openChapter(url.href);
  else window.setTimeout(function(){openChapter(url.href);},190);
},true);
var lastChild=null,childScroll=null;
frame.addEventListener("load",function(){
  var child;
  try{child=frame.contentDocument;}catch(_){return;}
  if(!child||!child.body)return;
  child.body.classList.add("is-framed-chapter");
  frame.title=child.title||"Capítulo do Nosso Universo";
  if(lastChild && childScroll){
    try{lastChild.removeEventListener("scroll",childScroll);}catch(_){}
  }
  lastChild=child;
  childScroll=function(){window.requestAnimationFrame(relocate);};
  child.addEventListener("scroll",childScroll,{passive:true});
  if(child.body.dataset.chapter==="2")show();
  else relocate();
  child.addEventListener("play",function(event){
    if(event.target.tagName==="VIDEO")pause();
  },true);
});
})();