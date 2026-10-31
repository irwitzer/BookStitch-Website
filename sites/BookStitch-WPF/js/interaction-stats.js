"use strict";
/* BookStitch interaction counters. Aggregate event collection enabled; review applicable consent requirements before publication. */
(() => {
  const CONFIG = Object.freeze({
    enabled: true,
    endpoint: "https://bookstitch-events.irwitzer.workers.dev/v1/event"
  });
  if (window.BookStitchStatsEnabled !== true || !CONFIG.enabled || !/^https:\/\/[a-z0-9.-]+\/v1\/event$/i.test(CONFIG.endpoint)
      || CONFIG.endpoint.includes("REPLACE-WITH-YOUR-WORKER")) return;

  function track(id) {
    if (!/^[a-z][a-z0-9.-]{2,63}$/.test(id)) return;
    try {
      // No cookies, identities, timestamps, URLs, referrers or browser details are sent.
      // POST is deliberately not awaited; navigation and downloads must never depend on it.
      void fetch(CONFIG.endpoint, {
        method: "POST",
        mode: "cors",
        credentials: "omit",
        cache: "no-store",
        redirect: "error",
        referrerPolicy: "no-referrer",
        keepalive: true,
        headers: {"Content-Type": "text/plain;charset=UTF-8"},
        body: JSON.stringify({id})
      }).catch(() => {});
    } catch (_) { /* Tracking is never allowed to interrupt the website. */ }
  }

  // Capture phase: read expanded/selected state BEFORE the existing site handlers change it.
  document.addEventListener("click", (event) => {
    if (!event.isTrusted) return; // Never count synthetic programmatic clicks.
    const el = event.target instanceof Element ? event.target.closest("[data-stat-event]") : null;
    if (!el || el.disabled || el.closest("[hidden]")) return;
    if (el.dataset.statOpenOnly === "true" && el.getAttribute("aria-expanded") === "true") return;
    if (el.dataset.statChangeOnly === "true" && el.getAttribute("aria-current") === "true") return;
    track(el.dataset.statEvent);
  }, true);

  // Keyboard arrows and touch swipes are equivalent to pressing gallery previous/next.
  // Keyboard activation of an existing button already emits a click: do not count that twice.
  const gallery = document.getElementById("gallery-dialog");
  document.addEventListener("keydown", (event) => {
    if (event.defaultPrevented || !gallery || gallery.hidden) return;
    if (event.key === "ArrowRight") track("gallery.next");
    else if (event.key === "ArrowLeft") track("gallery.previous");
  }, true);
  const frame = document.querySelector("#gallery-dialog .gallery-screen-frame");
  let swipeStart = null;
  frame?.addEventListener("touchstart", event => {
    swipeStart = event.changedTouches[0]?.clientX ?? null;
  }, {passive:true});
  frame?.addEventListener("touchend", event => {
    if (swipeStart === null || gallery?.hidden) return;
    const dx = (event.changedTouches[0]?.clientX ?? swipeStart) - swipeStart;
    swipeStart = null;
    if (Math.abs(dx) > 45) track(dx < 0 ? "gallery.next" : "gallery.previous");
  }, {passive:true});
  frame?.addEventListener("touchcancel", () => {swipeStart=null;}, {passive:true});
})();
