/* Nosso Universo - player de áudio autorizado, persistente entre capítulos */
(() => {
  "use strict";
  if (window.parent !== window) return;
  const playButton = document.getElementById("music-main-toggle");
  const slider = document.getElementById("music-seek");
  const elapsed = document.getElementById("music-elapsed");
  const duration = document.getElementById("music-total");
  const label = document.getElementById("music-main-label");
  const icon = document.querySelector(".music-main-icon");
  const status = document.getElementById("music-status");
  if (!playButton || !slider || !elapsed || !duration || !status) return;
  const audio = document.createElement("audio");
  audio.id = "universe-music-audio";
  audio.preload = "metadata";
  audio.src = new URL("assets/audio/nossa-musica.mp3", document.baseURI).href;
  document.body.appendChild(audio);
  let audioError = "";
  const mini = document.createElement("div");
  mini.className = "audio-mini";
  mini.hidden = true;
  mini.setAttribute("role", "group");
  mini.setAttribute("aria-label", "Controles da nossa música");
  mini.innerHTML = '<button type="button" class="audio-mini__button" aria-label="Pausar nossa música" title="Nossa música: pausar ou continuar"><span class="audio-mini__symbol" aria-hidden="true">❚❚</span></button>';
  document.body.appendChild(mini);
  const miniButton = mini.querySelector("button");
  const miniSymbol = mini.querySelector(".audio-mini__symbol");
  const format = time => {
    const t = Math.max(0, Math.floor(Number(time) || 0));
    return Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0");
  };
  const setStatus = message => { status.textContent = message; };
  const sync = () => {
    const playing = !audio.paused && !audio.ended;
    document.body.classList.toggle("is-music-playing", playing);
    const buttonText = playing ? "Pausar nossa música" : (audio.currentTime > 0 ? "Continuar nossa música" : "Dar play na nossa música");
    label.textContent = buttonText;
    icon.textContent = playing ? "❚❚" : "▶";
    playButton.setAttribute("aria-label", buttonText);
    miniSymbol.textContent = playing ? "❚❚" : "▶";
    miniButton.setAttribute("aria-label", playing ? "Pausar nossa música" : "Continuar nossa música");
    elapsed.textContent = format(audio.currentTime);
    const total = Number.isFinite(audio.duration) ? audio.duration : 219;
    duration.textContent = format(total);
    if (document.activeElement !== slider) slider.value = total ? String(100 * (audio.currentTime || 0) / total) : "0";
    if (audioError) setStatus(audioError);
    else if (playing) setStatus("Nossa música está tocando. Pode continuar nossa história! ♥");
    else if (audio.ended) setStatus("Chegamos ao final da música. Toque para ouvir novamente. ♥");
    else if (audio.currentTime > 0) setStatus("A música está pausada. Toque para continuar.");
    else setStatus("Aperte Play para começar do início. ♡");
  };
  const play = () => {
    audioError = "";
    if (audio.ended) audio.currentTime = 0;
    const promise = audio.play();
    if (promise && typeof promise.catch === "function") promise.catch(err => {
      audioError = err && err.name === "NotAllowedError"
        ? "Toque em Play novamente para autorizar o áudio no navegador."
        : "O arquivo da música não foi encontrado. Confira assets/audio/nossa-musica.mp3.";
      sync();
    });
  };
  const toggle = () => { if (audio.paused || audio.ended) play(); else audio.pause(); };
  playButton.addEventListener("click", toggle);
  miniButton.addEventListener("click", toggle);
  slider.addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = audio.duration * Number(slider.value) / 100;
      sync();
    }
  });
  ["play", "pause", "timeupdate", "loadedmetadata", "seeked", "ended"].forEach(evt => audio.addEventListener(evt, sync));
  audio.addEventListener("error", () => { audioError = "Áudio ainda não disponível neste endereço. Envie assets/audio/nossa-musica.mp3 ao GitHub."; sync(); });
  const chapter = document.createElement("iframe");
  chapter.id = "universe-chapter-frame";
  chapter.title = "Capítulo do Nosso Universo";
  chapter.hidden = true;
  document.body.appendChild(chapter);
  const base = new URL("./", document.baseURI);
  const nameOf = url => url.pathname.split("/").pop() || "index.html";
  const internal = url => url.origin === location.origin && url.pathname.startsWith(base.pathname);
  const showMusic = () => {
    chapter.hidden = true;
    chapter.removeAttribute("src");
    mini.hidden = true;
    document.body.classList.remove("is-universe-chapter-open");
    window.scrollTo({top:0,behavior:"instant"});
  };
  const showHome = () => location.assign(new URL("index.html", document.baseURI).href);
  const openChapter = href => {
    const url = new URL(href, document.baseURI);
    if (!internal(url)) { location.assign(url.href); return; }
    const name = nameOf(url);
    if (name === "musica.html") { showMusic(); return; }
    if (name === "index.html") { showHome(); return; }
    if (!/^(historia|estrelas|album|mundo|carta|final)\.html$/.test(name)) { location.assign(url.href); return; }
    mini.hidden = false;
    chapter.hidden = false;
    document.body.classList.add("is-universe-chapter-open");
    chapter.src = url.href;
  };
  window.UniverseAudio = {play,pause:() => audio.pause(),toggle};
  window.UniverseRouter = {openChapter,showMusic,showHome,frame:chapter};
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
      if (event.target && event.target.tagName === "VIDEO") audio.pause();
    }, true);
  });
  sync();
})();