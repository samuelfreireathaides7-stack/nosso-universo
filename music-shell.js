/* Player oficial persistente: capítulos mudam sem substituir o YouTube. */
(function () {
  "use strict";
  if (window.parent !== window) return;
  const slot = document.getElementById("youtube-slot");
  if (!slot) return;
  const shell = document.createElement("aside");
  shell.id = "youtube-shell";
  shell.className = "youtube-shell";
  shell.setAttribute("aria-label", "Nossa música pelo YouTube");
  shell.innerHTML = '<div class="youtube-shell__heading"><span>♪ Nossa música · Planos</span><a href="https://www.youtube.com/watch?v=V141wUSkTfk" target="_blank" rel="noopener noreferrer">YouTube ↗</a></div><div class="youtube-shell__video"></div>';
  const youtube = document.createElement("iframe");
  youtube.title = "YouTube: Planos — BK’ com Luccas Carlos";
  youtube.width = "560";
  youtube.height = "315";
  youtube.loading = "eager";
  youtube.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen; web-share";
  youtube.allowFullscreen = true;
  youtube.referrerPolicy = "strict-origin-when-cross-origin";
  youtube.src = "https://www.youtube.com/embed/V141wUSkTfk?playsinline=1&controls=1&rel=0&enablejsapi=1&origin=" + encodeURIComponent(location.origin);
  shell.querySelector(".youtube-shell__video").appendChild(youtube);
  document.body.appendChild(shell);
  const chapter = document.createElement("iframe");
  chapter.id = "universe-chapter-frame";
  chapter.title = "Capítulo do Nosso Universo";
  chapter.hidden = true;
  document.body.appendChild(chapter);
  let pendingLayout = false;
  function syncPosition() {
    pendingLayout = false;
    shell.classList.remove("youtube-shell--attached");
    if (!chapter.hidden) return;
    const box = slot.getBoundingClientRect();
    if (box.width < 240 || box.height < 256 || box.top < 5 || box.bottom > innerHeight - 5) return;
    shell.style.setProperty("--youtube-left", box.left + "px");
    shell.style.setProperty("--youtube-top", box.top + "px");
    shell.style.setProperty("--youtube-width", box.width + "px");
    shell.style.setProperty("--youtube-height", box.height + "px");
    shell.classList.add("youtube-shell--attached");
  }
  function requestPosition() {
    if (pendingLayout) return;
    pendingLayout = true;
    requestAnimationFrame(syncPosition);
  }
  const base = new URL("./", document.baseURI);
  const nameOf = url => url.pathname.split("/").pop() || "index.html";
  const internal = url => url.origin === location.origin && url.pathname.startsWith(base.pathname);
  function showMusic() {
    chapter.hidden = true;
    chapter.removeAttribute("src");
    document.body.classList.remove("is-universe-chapter-open");
    scrollTo(0, 0);
    requestPosition();
  }
  function showHome() { location.assign(new URL("index.html", document.baseURI).href); }
  function openChapter(href) {
    const url = new URL(href, document.baseURI);
    if (!internal(url)) { location.assign(url.href); return; }
    const name = nameOf(url);
    if (name === "musica.html") { showMusic(); return; }
    if (name === "index.html") { showHome(); return; }
    if (!/^(historia|estrelas|album|mundo|carta|final)\.html$/.test(name)) { location.assign(url.href); return; }
    chapter.hidden = false;
    document.body.classList.add("is-universe-chapter-open");
    chapter.src = url.href;
    requestPosition();
  }
  window.UniverseYouTube = {
    show: requestPosition,
    relocate: requestPosition,
    pause() {
      try { youtube.contentWindow.postMessage(JSON.stringify({event:"command",func:"pauseVideo",args:[]}), "https://www.youtube.com"); } catch (_) {}
    }
  };
  window.UniverseRouter = {openChapter,showMusic,showHome,frame:chapter};
  // Captura antes do script.js, que navega com location.href e encerraria a música.
  document.addEventListener("click", event => {
    const link = event.target.closest("a[data-chapter-link]");
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    const url = new URL(link.href, document.baseURI);
    if (!internal(url)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openChapter(url.href);
  }, true);
  chapter.addEventListener("load", () => {
    let child;
    try { child = chapter.contentDocument; } catch (_) { return; }
    if (!child || !child.body) return;
    child.body.classList.add("is-framed-chapter");
    child.addEventListener("scroll", requestPosition, {passive:true,capture:true});
    child.defaultView.addEventListener("scroll", requestPosition, {passive:true});
    chapter.title = child.title || "Capítulo do Nosso Universo";
    child.addEventListener("click", event => {
      const link = event.target.closest("a[data-chapter-link]");
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const url = new URL(link.href, child.baseURI);
      if (!internal(url)) return;
      const name = nameOf(url);
      if (name === "musica.html" || name === "index.html") {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (name === "musica.html") showMusic(); else showHome();
      }
    }, true);
    child.addEventListener("play", event => {
      if (event.target.tagName === "VIDEO") window.UniverseYouTube.pause();
    }, true);
    requestPosition();
  });
  addEventListener("resize", requestPosition, {passive:true});
  addEventListener("scroll", requestPosition, {passive:true});
  requestPosition();
})();