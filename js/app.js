(function () {
  "use strict";

  const state = {
    data: null,
    selectedRuteId: null,
  };

  const els = {
    gateInput: document.getElementById("gate-input"),
    gateSuggestions: document.getElementById("gate-suggestions"),
    ruteSelect: document.getElementById("rute-select"),
    resultSection: document.getElementById("result-section"),
    valgtRuteNavn: document.getElementById("valgt-rute-navn"),
    valgtRuteGater: document.getElementById("valgt-rute-gater"),
    nextPickup: document.getElementById("next-pickup"),
    pickupList: document.getElementById("pickup-list"),
    legendList: document.getElementById("legend-list"),
    placeholderBanner: document.getElementById("placeholder-banner"),
    kildeLink: document.getElementById("kilde-link"),
    gjelderAar: document.getElementById("gjelder-aar"),
    valgtRuteJuletre: document.getElementById("valgt-rute-juletre"),
  };

  fetch("data/tommekalender.json")
    .then((res) => res.json())
    .then((data) => {
      state.data = data;
      init();
    })
    .catch((err) => {
      console.error("Klarte ikke å laste tømmekalender-data", err);
    });

  function init() {
    renderMeta();
    renderLegend();
    populateRuteSelect();
    bindEvents();
  }

  function renderMeta() {
    const { meta } = state.data;
    if (meta && meta.gjelderAar) {
      els.gjelderAar.textContent = meta.gjelderAar;
      els.placeholderBanner.hidden = false;
    }
    if (meta && meta.kilde) {
      els.kildeLink.href = meta.kilde;
    }
  }

  function renderLegend() {
    els.legendList.innerHTML = "";
    state.data.avfallstyper.forEach((type) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="dot" style="background:${type.farge}"></span>
        <span><strong>${type.navn}</strong> — <span class="beholder">${type.beholder}</span></span>
      `;
      els.legendList.appendChild(li);
    });
  }

  function populateRuteSelect() {
    state.data.ruter.forEach((rute) => {
      const opt = document.createElement("option");
      opt.value = rute.id;
      opt.textContent = rute.navn;
      els.ruteSelect.appendChild(opt);
    });
  }

  function bindEvents() {
    els.gateInput.addEventListener("input", onGateInput);
    els.ruteSelect.addEventListener("change", () => {
      if (els.ruteSelect.value) {
        selectRute(els.ruteSelect.value);
      }
    });
    document.addEventListener("click", (e) => {
      if (!els.gateSuggestions.contains(e.target) && e.target !== els.gateInput) {
        els.gateSuggestions.hidden = true;
      }
    });
  }

  function onGateInput() {
    const query = els.gateInput.value.trim().toLocaleLowerCase("no");
    if (!query) {
      els.gateSuggestions.hidden = true;
      return;
    }

    const matches = [];
    state.data.ruter.forEach((rute) => {
      rute.gater.forEach((gate) => {
        if (gate.toLocaleLowerCase("no").includes(query)) {
          matches.push({ gate, rute });
        }
      });
    });

    renderSuggestions(matches);
  }

  function renderSuggestions(matches) {
    els.gateSuggestions.innerHTML = "";
    if (matches.length === 0) {
      els.gateSuggestions.hidden = true;
      return;
    }

    matches.slice(0, 8).forEach(({ gate, rute }) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = `${gate} — ${rute.navn}`;
      btn.addEventListener("click", () => {
        els.gateInput.value = gate;
        els.gateSuggestions.hidden = true;
        selectRute(rute.id);
      });
      els.gateSuggestions.appendChild(btn);
    });

    els.gateSuggestions.hidden = false;
  }

  function selectRute(ruteId) {
    state.selectedRuteId = ruteId;
    els.ruteSelect.value = ruteId;

    const rute = state.data.ruter.find((r) => r.id === ruteId);
    if (!rute) return;

    els.valgtRuteNavn.textContent = rute.navn;
    els.valgtRuteGater.textContent = rute.gater.join(", ");
    els.valgtRuteJuletre.textContent = rute.juletreUke
      ? `Juletre hentes i uke ${rute.juletreUke}.`
      : "";

    renderNextPickup(rute);
    renderPickupList(rute);

    els.resultSection.hidden = false;
    els.resultSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function getUpcomingHentinger(rute) {
    const today = startOfDay(new Date());
    return rute.hentinger
      .map((h) => ({ ...h, dateObj: parseIsoDate(h.dato) }))
      .filter((h) => h.dateObj >= today)
      .sort((a, b) => a.dateObj - b.dateObj);
  }

  function renderNextPickup(rute) {
    const upcoming = getUpcomingHentinger(rute);
    if (upcoming.length === 0) {
      els.nextPickup.innerHTML = "<p>Ingen kommende hentinger i datasettet.</p>";
      return;
    }

    const next = upcoming[0];
    const daysUntil = diffInDays(startOfDay(new Date()), next.dateObj);
    const daysLabel =
      daysUntil === 0 ? "I dag" : daysUntil === 1 ? "I morgen" : `Om ${daysUntil} dager`;

    els.nextPickup.innerHTML = `
      <div class="date">${formatDate(next.dateObj)}</div>
      <div class="days-until">${daysLabel}</div>
      <div class="badge-row">${badgesHtml(next.typer)}</div>
    `;
  }

  function renderPickupList(rute) {
    const upcoming = getUpcomingHentinger(rute);
    els.pickupList.innerHTML = "";

    if (upcoming.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Ingen kommende hentinger i datasettet.";
      els.pickupList.appendChild(li);
      return;
    }

    upcoming.forEach((h) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${formatDate(h.dateObj)}</span>
        <span class="badge-row">${badgesHtml(h.typer)}</span>
      `;
      els.pickupList.appendChild(li);
    });
  }

  function badgesHtml(typeIds) {
    return typeIds
      .map((id) => {
        const type = state.data.avfallstyper.find((t) => t.id === id);
        if (!type) return "";
        return `<span class="badge" style="background:${type.farge}"><span class="dot"></span>${type.navn}</span>`;
      })
      .join("");
  }

  function parseIsoDate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function diffInDays(a, b) {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.round((b - a) / msPerDay);
  }

  function formatDate(date) {
    return date.toLocaleDateString("no-NO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
})();
