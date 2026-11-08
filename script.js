(() => {
  "use strict";

  const data = window.OUR_UNIVERSE || {};
  const one = (selector, root = document) => root.querySelector(selector);
  const many = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const createStar = (parent, count, className) => {
    for (let index = 0; index < count; index += 1) {
      const star = document.createElement("i");
      star.className = className;
      star.style.setProperty("--x", `${Math.random() * 100}%`);
      star.style.setProperty("--y", `${Math.random() * 100}%`);
      star.style.setProperty("--delay", `${Math.random() * -8}s`);
      star.style.setProperty("--size", `${index % 9 === 0 ? 1.8 + Math.random() * 1.2 : 0.7 + Math.random() * 1.1}px`);
      star.style.setProperty("--star-color", ["#fff8f1", "#d8e5ff", "#f4d8df", "#eadbb9"][index % 4]);
      star.style.setProperty("--star-opacity", `${0.24 + Math.random() * 0.38}`);
      star.style.setProperty("--twinkle-duration", `${4 + Math.random() * 5}s`);
      parent.append(star);
    }
  };

  createStar(one("#site-stars"), 95, "site-star");
  createStar(one("#finale-sky"), 90, "finale-star");

  const intro = one("#intro");
  const experience = one("#experience");
  one("#enter-button").addEventListener("click", () => {
    intro.classList.add("is-leaving");
    experience.classList.add("is-entering");
    experience.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-open");
    window.setTimeout(() => {
      intro.hidden = true;
      one("#inicio").focus({ preventScroll: true });
    }, 1400);
  });

  const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 })
    : null;
  many(".reveal").forEach((item) => revealObserver ? revealObserver.observe(item) : item.classList.add("is-visible"));

  const timeline = one("#timeline");
  const timelineItems = Array.isArray(data.timeline) ? data.timeline : [];
  one("#timeline-empty").hidden = timelineItems.length > 0;
  timelineItems.forEach((item, index) => {
    const article = document.createElement("article");
    article.className = `timeline-item reveal${index % 2 ? " timeline-item--right" : ""}`;
    const imageMarkup = item.image
      ? `<button class="photo-button" type="button" data-image="${escapeHtml(item.image)}" data-caption="${escapeHtml(item.title || "")}"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt || item.title || "Fotografia da lembrança")}" loading="lazy"></button>`
      : `<div class="photo-placeholder" aria-label="Adicione uma fotografia para esta lembrança"><span>✧</span><small>sua foto aqui</small></div>`;
    article.innerHTML = `<span class="timeline-item__dot" aria-hidden="true"></span><div class="timeline-item__photo">${imageMarkup}</div><div class="timeline-item__copy"><p class="eyebrow">${escapeHtml(item.date || "uma lembrança")}</p><h3>${escapeHtml(item.title || "Um dia especial")}</h3><p>${escapeHtml(item.description || "")}</p></div>`;
    timeline.append(article);
    if (revealObserver) revealObserver.observe(article);
    else article.classList.add("is-visible");
  });

  const starField = one("#star-field");
  const reasons = Array.isArray(data.reasons) ? data.reasons.slice(0, 24) : [];
  const starMessage = one("#star-message p");
  reasons.forEach((reason, index) => {
    const button = document.createElement("button");
    button.className = "reason-star";
    button.type = "button";
    button.setAttribute("aria-label", `Revelar mensagem ${index + 1}`);
    button.setAttribute("aria-pressed", "false");
    button.style.setProperty("--x", `${8 + Math.random() * 84}%`);
    button.style.setProperty("--y", `${8 + Math.random() * 84}%`);
    button.style.setProperty("--delay", `${Math.random() * -5}s`);
    button.innerHTML = "<span aria-hidden='true'>✦</span>";
    button.addEventListener("click", () => {
      many(".reason-star.is-discovered", starField).forEach((star) => star.classList.remove("is-current"));
      button.classList.add("is-discovered", "is-current");
      button.setAttribute("aria-pressed", "true");
      starMessage.textContent = reason;
      one("#star-message").classList.remove("is-lit");
      requestAnimationFrame(() => one("#star-message").classList.add("is-lit"));
    });
    starField.append(button);
  });

  const memoryGrid = one("#memory-grid");
  (Array.isArray(data.smallWorld) ? data.smallWorld : []).forEach((memory) => {
    const card = document.createElement("button");
    card.className = "memory-card";
    card.type = "button";
    card.setAttribute("aria-pressed", "false");
    card.innerHTML = `<span class="memory-card__inner"><span class="memory-card__face memory-card__front"><small>${escapeHtml(memory.tag || "EXEMPLO")}</small><strong>${escapeHtml(memory.front || "Um detalhe")}</strong><i aria-hidden="true">＋</i></span><span class="memory-card__face memory-card__back"><small>EXEMPLO EDITÁVEL</small><span>${escapeHtml(memory.back || "Personalize este espaço.")}</span></span></span>`;
    card.addEventListener("click", () => {
      const flipped = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", String(flipped));
    });
    memoryGrid.append(card);
  });

  const modal = one("#photo-modal");
  const modalImage = one("#modal-image");
  const modalCaption = one("#modal-caption");
  const openPhoto = (src, caption) => {
    if (!src) return;
    modalImage.src = src;
    modalImage.alt = caption || "Fotografia ampliada";
    modalCaption.textContent = caption;
    modal.hidden = false;
    document.body.classList.add("has-modal");
    one("#modal-close").focus();
  };
  const closePhoto = () => {
    modal.hidden = true;
    modalImage.removeAttribute("src");
    document.body.classList.remove("has-modal");
  };
  one("#modal-close").addEventListener("click", closePhoto);
  modal.addEventListener("click", (event) => { if (event.target === modal) closePhoto(); });
  timeline.addEventListener("click", (event) => {
    const button = event.target.closest(".photo-button");
    if (button) openPhoto(button.dataset.image, button.dataset.caption);
  });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !modal.hidden) closePhoto(); });

  const albumCover = one("#album-cover");
  const albumReader = one("#album-reader");
  const albumBook = one("#album-book");
  const albumSpread = one("#album-spread");
  const albumVideos = new Set();
  const unavailableAlbumResources = new Set();
  let albumManifest;
  let albumCoverPhoto;
  let albumPages = [];
  let desktopSpread = 0;
  let mobilePage = 0;
  let albumIsMobile = window.matchMedia("(max-width: 760px)").matches;
  let pageTurnLocked = false;
  let videoSwitching = false;
  let musicPausedForVideo = false;
  const albumMotionScale = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1;

  const reportAlbumResourceFailure = (path) => {
    unavailableAlbumResources.add(path);
    const status = one("#album-resource-status");
    status.hidden = false;
    status.textContent = `Não foi possível carregar: ${[...unavailableAlbumResources].join(", ")}. Confira os nomes e caminhos em assets/fotos/, assets/videos/ e assets/capas-videos/.`;
  };

  const restoreMusicAfterVideo = () => {
    if (!musicPausedForVideo || [...albumVideos].some((video) => !video.paused)) return;
    musicPausedForVideo = false;
    audio.play().catch(() => {});
  };

  const pauseAlbumVideos = () => {
    videoSwitching = true;
    albumVideos.forEach((video) => video.pause());
    videoSwitching = false;
    restoreMusicAfterVideo();
  };

  const makeAlbumPhoto = (filename, index, pageTitle) => {
    const button = document.createElement("button");
    button.className = `album-photo album-photo--${index + 1}`;
    button.type = "button";
    button.setAttribute("aria-label", `Ampliar fotografia ${filename}`);
    const image = document.createElement("img");
    image.src = `${albumManifest.pasta_fotos}${filename}`;
    image.alt = `Fotografia do álbum: ${filename}`;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => {
      reportAlbumResourceFailure(`${albumManifest.pasta_fotos}${filename}`);
      image.hidden = true;
      button.classList.add("is-missing");
      const missing = document.createElement("span");
      missing.className = "album-photo__missing";
      missing.textContent = `Foto não encontrada: ${filename}`;
      button.append(missing);
    }, { once: true });
    const caption = document.createElement("span");
    caption.textContent = pageTitle;
    button.append(image, caption);
    button.addEventListener("click", () => {
      if (image.complete && image.naturalWidth > 0) openPhoto(image.src, pageTitle);
    });
    return button;
  };

  const makeAlbumVideo = (filename, pageTitle) => {
    const figure = document.createElement("figure");
    figure.className = "album-video";
    const video = document.createElement("video");
    video.controls = true;
    video.playsInline = true;
    video.preload = "none";
    video.poster = albumManifest.capas_videos[filename];
    video.dataset.src = `${albumManifest.pasta_videos}${filename}`;
    video.setAttribute("aria-label", `Vídeo da lembrança: ${pageTitle}`);
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    const playButton = document.createElement("button");
    playButton.className = "album-video__play";
    playButton.type = "button";
    playButton.setAttribute("aria-label", `Reproduzir vídeo ${filename}`);
    playButton.innerHTML = "<span aria-hidden='true'>▶</span>";
    const caption = document.createElement("figcaption");
    caption.textContent = "um instante em movimento";
    figure.append(video, playButton, caption);
    albumVideos.add(video);

    const startVideo = async () => {
      videoSwitching = true;
      albumVideos.forEach((otherVideo) => { if (otherVideo !== video) otherVideo.pause(); });
      if (!video.src) {
        video.src = video.dataset.src;
        video.load();
      }
      video.controls = true;
      try {
        await video.play();
      } catch (error) {
        showToast("Este vídeo ainda não conseguiu iniciar. Toque para tentar novamente.");
      } finally {
        videoSwitching = false;
      }
    };
    playButton.addEventListener("click", startVideo);
    video.addEventListener("play", () => {
      if (!musicPausedForVideo && !audio.paused) musicPausedForVideo = true;
      audio.pause();
      videoSwitching = true;
      albumVideos.forEach((otherVideo) => { if (otherVideo !== video) otherVideo.pause(); });
      videoSwitching = false;
      figure.classList.add("is-playing");
    });
    video.addEventListener("pause", () => {
      figure.classList.remove("is-playing");
      if (!videoSwitching) restoreMusicAfterVideo();
    });
    video.addEventListener("ended", () => {
      figure.classList.remove("is-playing");
      restoreMusicAfterVideo();
    });
    video.addEventListener("error", () => {
      reportAlbumResourceFailure(video.dataset.src);
      figure.classList.add("is-unavailable");
    });
    return figure;
  };

  const renderAlbumPage = (page, index, side) => {
    const article = document.createElement("article");
    article.className = `album-page album-page--${side} album-page--${page.layout || "default"}`;
    article.setAttribute("aria-label", `Página ${index + 2}: ${page.titulo || "Nossa lembrança"}`);
    const paper = document.createElement("div");
    paper.className = "album-page__paper";
    const heading = document.createElement("header");
    heading.className = "album-page__heading";
    const label = document.createElement("span");
    label.className = "album-page__label";
    label.textContent = `memória ${String(index + 1).padStart(2, "0")}`;
    const title = document.createElement("h3");
    title.textContent = page.titulo || "Uma lembrança nossa";
    heading.append(label, title);
    paper.append(heading);

    if (page.layout === "encerramento") {
      const closing = document.createElement("div");
      closing.className = "album-closing";
      const ornament = document.createElement("span");
      ornament.className = "album-closing__ornament";
      ornament.setAttribute("aria-hidden", "true");
      ornament.textContent = "✦";
      const message = document.createElement("p");
      message.textContent = "E pensar que ainda temos tantas páginas para escrever juntos...";
      const continueButton = document.createElement("button");
      continueButton.className = "button button--primary album-continue";
      continueButton.type = "button";
      continueButton.textContent = "Continuar nossa história ♥";
      continueButton.addEventListener("click", closeAlbumForFinale);
      closing.append(ornament, message, continueButton);
      paper.append(closing);
    } else {
      const content = document.createElement("div");
      content.className = `album-page__content album-content--${page.layout || "default"}`;
      const photos = Array.isArray(page.fotos) ? page.fotos : [];
      photos.forEach((filename, photoIndex) => content.append(makeAlbumPhoto(filename, photoIndex, page.titulo || "Uma lembrança nossa")));
      const videos = Array.isArray(page.videos) ? page.videos : [];
      videos.forEach((filename) => content.append(makeAlbumVideo(filename, page.titulo || "Uma lembrança nossa")));
      paper.append(content);
      if (page.texto) {
        const note = document.createElement("p");
        note.className = "album-page__note";
        note.textContent = page.texto;
        paper.append(note);
      }
    }

    const footer = document.createElement("span");
    footer.className = "album-page__footer";
    footer.textContent = `${String(index + 2).padStart(2, "0")}  ·  nosso universo`;
    paper.append(footer);
    article.append(paper);
    return article;
  };

  const renderAlbum = () => {
    pauseAlbumVideos();
    albumVideos.clear();
    albumSpread.replaceChildren();
    if (albumIsMobile) {
      const page = albumPages[mobilePage];
      if (page) albumSpread.append(renderAlbumPage(page, mobilePage, "single"));
      one("#album-page-count").textContent = `Página ${mobilePage + 2} de ${albumManifest.paginas.length}`;
      one("#album-prev").disabled = mobilePage === 0;
      one("#album-next").disabled = mobilePage === albumPages.length - 1;
    } else {
      const firstIndex = desktopSpread * 2;
      const first = albumPages[firstIndex];
      const second = albumPages[firstIndex + 1];
      if (first) albumSpread.append(renderAlbumPage(first, firstIndex, "left"));
      if (second) albumSpread.append(renderAlbumPage(second, firstIndex + 1, "right"));
      const firstNumber = firstIndex + 2;
      const lastNumber = Math.min(firstIndex + 3, albumManifest.paginas.length);
      one("#album-page-count").textContent = first ? `Páginas ${firstNumber}–${lastNumber} de ${albumManifest.paginas.length}` : "";
      one("#album-prev").disabled = desktopSpread === 0;
      one("#album-next").disabled = firstIndex + 2 >= albumPages.length;
    }
  };

  const setAlbumNavigationDisabled = (disabled) => {
    const position = albumIsMobile ? mobilePage : desktopSpread;
    const maxPosition = albumIsMobile ? albumPages.length - 1 : Math.ceil(albumPages.length / 2) - 1;
    one("#album-prev").disabled = disabled || position === 0;
    one("#album-next").disabled = disabled || position >= maxPosition;
  };

  const turnAlbumPage = (direction) => {
    const maxPosition = albumIsMobile ? albumPages.length - 1 : Math.ceil(albumPages.length / 2) - 1;
    const currentPosition = albumIsMobile ? mobilePage : desktopSpread;
    const nextPosition = currentPosition + direction;
    if (pageTurnLocked || nextPosition < 0 || nextPosition > maxPosition) return;
    pageTurnLocked = true;
    setAlbumNavigationDisabled(true);
    pauseAlbumVideos();
    albumBook.classList.remove("turn-next", "turn-prev");
    void albumBook.offsetWidth;
    albumBook.classList.add(direction > 0 ? "turn-next" : "turn-prev");
    window.setTimeout(() => {
      if (albumIsMobile) mobilePage = nextPosition;
      else desktopSpread = nextPosition;
      renderAlbum();
      setAlbumNavigationDisabled(true);
      albumBook.classList.add("has-turned");
      window.setTimeout(() => {
        albumBook.classList.remove("turn-next", "turn-prev", "has-turned");
        pageTurnLocked = false;
        setAlbumNavigationDisabled(false);
      }, albumMotionScale ? 420 : 30);
    }, albumMotionScale ? 390 : 0);
  };

  const closeAlbumForFinale = () => {
    pauseAlbumVideos();
    albumReader.classList.add("is-closing");
    window.setTimeout(() => {
      albumReader.hidden = true;
      albumReader.classList.remove("is-closing");
      one("#finale").scrollIntoView({ behavior: albumMotionScale ? "smooth" : "auto", block: "start" });
    }, albumMotionScale ? 650 : 0);
  };

  const openAlbum = () => {
    albumCover.classList.add("is-opening");
    albumReader.hidden = false;
    albumReader.classList.add("is-opening");
    if (albumManifest) {
      renderAlbum();
    } else {
      albumSpread.replaceChildren();
      const page = document.createElement("article");
      page.className = "album-page album-page--single album-page--unavailable";
      page.innerHTML = "<div class='album-page__paper'><header class='album-page__heading'><span class='album-page__label'>álbum em espera</span><h3>Nossas memórias estão aqui</h3></header><div class='album-fallback'><p>O navegador não conseguiu carregar album-manifest.json.</p><p>Abra esta página por um servidor HTTP ou pelo GitHub Pages. Confirme também os arquivos nas pastas assets/fotos/, assets/videos/ e assets/capas-videos/.</p><p>Enquanto isso, a capa e o restante do Nosso Universo continuam disponíveis.</p></div></div></article>";
      albumSpread.append(page);
      one("#album-page-count").textContent = "Manifesto indisponível";
      one("#album-prev").disabled = true;
      one("#album-next").disabled = true;
    }
    window.setTimeout(() => {
      albumCover.hidden = true;
      albumReader.classList.remove("is-opening");
    }, albumMotionScale ? 850 : 0);
  };

  one("#album-open").addEventListener("click", openAlbum);
  one("#album-prev").addEventListener("click", () => turnAlbumPage(-1));
  one("#album-next").addEventListener("click", () => turnAlbumPage(1));
  albumBook.addEventListener("touchstart", (event) => { albumBook.dataset.touchX = String(event.changedTouches[0].clientX); }, { passive: true });
  albumBook.addEventListener("touchend", (event) => {
    if (event.target.closest("video, .album-video__play")) return;
    const startX = Number(albumBook.dataset.touchX);
    const distance = event.changedTouches[0].clientX - startX;
    if (Math.abs(distance) > 48) turnAlbumPage(distance < 0 ? 1 : -1);
  }, { passive: true });
  window.addEventListener("resize", () => {
    const nowMobile = window.matchMedia("(max-width: 760px)").matches;
    if (nowMobile === albumIsMobile) return;
    if (nowMobile) mobilePage = desktopSpread * 2;
    else desktopSpread = Math.floor(mobilePage / 2);
    albumIsMobile = nowMobile;
    if (!albumReader.hidden) renderAlbum();
  });
  document.addEventListener("keydown", (event) => {
    if (albumReader.hidden || !modal.hidden) return;
    if (event.key === "ArrowRight") turnAlbumPage(1);
    if (event.key === "ArrowLeft") turnAlbumPage(-1);
  });

  fetch(new URL("album-manifest.json", document.baseURI))
    .then((response) => {
      if (!response.ok) throw new Error("Manifesto indisponível");
      return response.json();
    })
    .then((manifest) => {
      if (!manifest || !Array.isArray(manifest.paginas)) throw new Error("Manifesto sem páginas válidas");
      albumManifest = manifest;
      const coverPage = manifest.paginas.find((page) => page.layout === "capa");
      albumPages = manifest.paginas.filter((page) => page.layout !== "capa");
      if (coverPage?.fotos?.[0]) {
        albumCoverPhoto = `${manifest.pasta_fotos}${coverPage.fotos[0]}`;
        const coverImage = one("#album-cover-image");
        coverImage.src = albumCoverPhoto;
        coverImage.addEventListener("error", () => {
          reportAlbumResourceFailure(albumCoverPhoto);
          coverImage.hidden = true;
          one(".album-cover__image-wrap").classList.add("is-missing");
        }, { once: true });
      } else {
        reportAlbumResourceFailure("a fotografia de capa definida em album-manifest.json");
      }
      if (!albumReader.hidden) renderAlbum();
    })
    .catch(() => {
      const protocolNote = location.protocol === "file:"
        ? "Como você abriu o site por file://, o navegador bloqueia a leitura do JSON. Abra pelo GitHub Pages ou por um servidor HTTP local."
        : "Confira se album-manifest.json está na mesma pasta de index.html e acessível pelo site.";
      const error = one("#album-error");
      error.textContent = `O livro e o botão continuam disponíveis, mas as páginas não puderam ser carregadas. ${protocolNote} Arquivos esperados: album-manifest.json, assets/fotos/, assets/videos/ e assets/capas-videos/.`;
      error.hidden = false;
    });

  one("#secret-heart").addEventListener("click", () => {
    if (albumCoverPhoto) openPhoto(albumCoverPhoto, "Nossa história, página por página");
    else if (timelineItems.some((item) => item.image)) {
      const memory = timelineItems.find((item) => item.image);
      openPhoto(memory.image, memory.title || "Uma lembrança nossa");
    }
    else showToast("Uma lembrança especial está esperando para ser aberta. ♥");
  });

  const envelope = one("#envelope");
  const letter = data.letter || {};
  one("#letter-salutation").textContent = letter.salutation || "Meu amor,";
  one("#letter-text").innerHTML = (Array.isArray(letter.paragraphs) ? letter.paragraphs : []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
  one("#letter-signoff").textContent = letter.signoff || "Com todo o meu amor.";
  envelope.addEventListener("click", () => {
    const opened = envelope.classList.toggle("is-open");
    envelope.setAttribute("aria-expanded", String(opened));
    one("#love-letter").hidden = !opened;
    if (opened) one("#love-letter").scrollIntoView({ behavior: "smooth", block: "center" });
  });

  const counterStart = data.relationshipStart;
  const counterUnits = one("#counter-units");
  const counterEmpty = one("#counter-empty");
  const dateOnlyMatch = typeof counterStart === "string" && counterStart.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const parsedStart = dateOnlyMatch
    ? new Date(Number(dateOnlyMatch[1]), Number(dateOnlyMatch[2]) - 1, Number(dateOnlyMatch[3]))
    : counterStart ? new Date(counterStart) : null;
  const dateIsExact = !dateOnlyMatch || (parsedStart.getFullYear() === Number(dateOnlyMatch[1]) && parsedStart.getMonth() === Number(dateOnlyMatch[2]) - 1 && parsedStart.getDate() === Number(dateOnlyMatch[3]));
  const validStart = dateIsExact && parsedStart && !Number.isNaN(parsedStart.getTime()) && parsedStart <= new Date();
  one("#counter-date").textContent = validStart
    ? `Nos conhecemos em ${parsedStart.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}.`
    : "";
  one("#counter-date").hidden = !validStart || !dateIsExact;
  counterUnits.hidden = !validStart;
  counterEmpty.hidden = Boolean(validStart);
  if (validStart) {
    const addCalendarMonths = (date, months) => {
      const monthIndex = date.getMonth() + months;
      const year = date.getFullYear() + Math.floor(monthIndex / 12);
      const month = ((monthIndex % 12) + 12) % 12;
      const day = Math.min(date.getDate(), new Date(year, month + 1, 0).getDate());
      return new Date(year, month, day, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    };

    const getCalendarDifference = (start, end) => {
      let years = end.getFullYear() - start.getFullYear();
      let yearAnchor = addCalendarMonths(start, years * 12);
      if (yearAnchor > end) {
        years -= 1;
        yearAnchor = addCalendarMonths(start, years * 12);
      }

      let months = (end.getFullYear() - yearAnchor.getFullYear()) * 12 + end.getMonth() - yearAnchor.getMonth();
      let monthAnchor = addCalendarMonths(yearAnchor, months);
      if (monthAnchor > end) {
        months -= 1;
        monthAnchor = addCalendarMonths(yearAnchor, months);
      }

      const anchorDay = Date.UTC(monthAnchor.getFullYear(), monthAnchor.getMonth(), monthAnchor.getDate());
      const currentDay = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
      const days = Math.floor((currentDay - anchorDay) / 86400000);
      const dayAnchor = new Date(monthAnchor.getFullYear(), monthAnchor.getMonth(), monthAnchor.getDate() + days,
        monthAnchor.getHours(), monthAnchor.getMinutes(), monthAnchor.getSeconds(), monthAnchor.getMilliseconds());
      const remainingSeconds = Math.max(0, Math.floor((end.getTime() - dayAnchor.getTime()) / 1000));

      return {
        years,
        months,
        days,
        hours: Math.floor(remainingSeconds / 3600),
        minutes: Math.floor(remainingSeconds / 60) % 60,
        seconds: remainingSeconds % 60
      };
    };

    const updateCounter = () => {
      const difference = getCalendarDifference(parsedStart, new Date());
      one("#count-years").textContent = difference.years.toLocaleString("pt-BR");
      one("#count-months").textContent = String(difference.months);
      one("#count-days").textContent = String(difference.days);
      one("#count-years-label").textContent = difference.years === 1 ? "ano" : "anos";
      one("#count-months-label").textContent = difference.months === 1 ? "mês" : "meses";
      one("#count-days-label").textContent = difference.days === 1 ? "dia" : "dias";
      one("#count-hours").textContent = String(difference.hours).padStart(2, "0");
      one("#count-minutes").textContent = String(difference.minutes).padStart(2, "0");
      one("#count-seconds").textContent = String(difference.seconds).padStart(2, "0");
    };
    updateCounter();
    window.setInterval(updateCounter, 1000);
  }

  const audio = one("#our-audio");
  const musicToggle = one("#music-toggle");
  const musicWidget = one("#music-widget");
  audio.volume = 0.55;
  musicToggle.addEventListener("click", async () => {
    if (!audio.paused) {
      audio.pause();
      return;
    }
    try {
      await audio.play();
    } catch (error) {
      musicWidget.classList.add("is-unavailable");
      one(".music__title", musicWidget).textContent = "música não adicionada";
      musicToggle.title = "Adicione assets/audio/nossa-musica.mp3 para ativar a música";
    }
  });
  audio.addEventListener("play", () => {
    musicWidget.classList.add("is-playing");
    musicToggle.setAttribute("aria-label", "Pausar nossa música");
    musicToggle.title = "Pausar nossa música";
  });
  audio.addEventListener("pause", () => {
    musicWidget.classList.remove("is-playing");
    musicToggle.setAttribute("aria-label", "Tocar nossa música");
    musicToggle.title = "Tocar nossa música";
  });
  audio.addEventListener("error", () => {
    musicWidget.classList.add("is-unavailable");
    one(".music__title", musicWidget).textContent = "música não adicionada";
    musicToggle.title = "Adicione assets/audio/nossa-musica.mp3 para ativar a música";
  });
  one("#music-volume").addEventListener("input", (event) => { audio.volume = Number(event.target.value); });

  const toast = one("#toast");
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3600);
  }
  one("#secret-star").addEventListener("click", () => showToast("Entre tantas estrelas, eu ainda escolheria você. ✦"));
  one("#secret-envelope").addEventListener("click", () => showToast("A lembrança mais bonita ainda está por vir: a próxima história de vocês."));

  const finale = one("#finale");
  const wishButton = one("#wish-button");
  const finalePhotos = one("#finale-photos");
  (Array.isArray(data.finalPhotos) ? data.finalPhotos.slice(0, 4) : []).forEach((item, index) => {
    const image = document.createElement("img");
    image.src = typeof item === "string" ? item : item.image;
    image.alt = typeof item === "string" ? "" : (item.alt || "Uma lembrança de vocês");
    image.className = `finale-photo finale-photo--${index + 1}`;
    image.loading = "lazy";
    finalePhotos.append(image);
  });
  wishButton.addEventListener("click", () => {
    finale.classList.add("is-revealing");
    one("#finale-content").classList.add("is-fading");
    wishButton.disabled = true;
    window.setTimeout(() => finale.classList.add("show-wish"), 1600);
    window.setTimeout(() => finale.classList.add("show-love"), 4700);
  });

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.addEventListener("pointermove", (event) => {
      document.documentElement.style.setProperty("--pointer-x", `${(event.clientX / window.innerWidth - 0.5) * 10}px`);
      document.documentElement.style.setProperty("--pointer-y", `${(event.clientY / window.innerHeight - 0.5) * 10}px`);
    }, { passive: true });
  }
})();