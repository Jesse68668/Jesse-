const DATA_URL = `./data/latest.json?t=${Date.now()}`;

const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");
const content = document.getElementById("content");

function text(value) {
  return value == null ? "" : String(value);
}

function escapeHTML(value) {
  return text(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderArticle(item) {
  return `
    <article class="card">
      <div class="card-meta">
        <span class="category">${escapeHTML(item.category)}</span>
        <span class="status">${escapeHTML(item.status)}</span>
      </div>

      <h3>${escapeHTML(item.title)}</h3>

      <p>${escapeHTML(item.summary)}</p>

      ${
        item.impact
          ? `<div class="impact">
              <strong>影响</strong>
              ${escapeHTML(item.impact)}
            </div>`
          : ""
      }
    </article>
  `;
}

function renderSport(item) {
  const result =
    item.finished && item.finalResult
      ? `<div class="result">${escapeHTML(item.finalResult)}</div>`
      : "";

  return `
    <article class="card sport-card">

      <div class="card-meta">
        <span class="category">${escapeHTML(item.league)}</span>
        <span class="status">${escapeHTML(item.statusLabel)}</span>
      </div>

      <div class="sport-time">
        ${escapeHTML(item.time)}
      </div>

      <h3>${escapeHTML(item.matchup)}</h3>

      ${result}

      ${
        item.stage
          ? `<p class="stage">${escapeHTML(item.stage)}</p>`
          : ""
      }

      ${
        item.note
          ? `<p>${escapeHTML(item.note)}</p>`
          : ""
      }

    </article>
  `;
}

function showError() {
  loading.classList.add("hidden");
  content.classList.add("hidden");
  errorBox.classList.remove("hidden");
}

async function loadBrief() {
  try {
    const response = await fetch(DATA_URL, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (
      data.ready !== true ||
      !data.reportDate ||
      !Array.isArray(data.news) ||
      !Array.isArray(data.tech) ||
      !Array.isArray(data.sports)
    ) {
      throw new Error("Brief is not ready");
    }

    document.getElementById("dateInfo").textContent =
      `${text(data.reportDate)} · ${text(data.weekday)}`;

    document.getElementById("headline").textContent =
      text(data.headline);

    document.getElementById("summary").textContent =
      text(data.summary);

    document.getElementById("generatedAt").textContent =
      text(data.generatedAt);

    document.getElementById("newsCount").textContent =
      `${data.news.length} 条`;

    document.getElementById("techCount").textContent =
      `${data.tech.length} 条`;

    document.getElementById("sportsCount").textContent =
      `${data.sports.length} 场`;

    document.getElementById("newsList").innerHTML =
      data.news.map(renderArticle).join("");

    document.getElementById("techList").innerHTML =
      data.tech.map(renderArticle).join("");

    document.getElementById("sportsList").innerHTML =
      data.sports.map(renderSport).join("");

    document.getElementById("sportsNote").textContent =
      text(data.sportsNote);

    loading.classList.add("hidden");
    errorBox.classList.add("hidden");
    content.classList.remove("hidden");

  } catch (error) {
    console.error("Failed to load daily brief:", error);
    showError();
  }
}

loadBrief();
