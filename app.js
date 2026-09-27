const DATA_URL = `./data/latest.json?t=${Date.now()}`;

const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");
const content = document.getElementById("content");


function safe(value) {
  return value == null ? "" : String(value);
}


function escapeHTML(value) {
  return safe(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function formatGeneratedTime(value) {

  if (!value) {
    return "--";
  }

  try {

    const date = new Date(value);

    return new Intl.DateTimeFormat(
      "zh-CN",
      {
        timeZone: "Asia/Shanghai",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }
    ).format(date);

  } catch {

    return safe(value);

  }
}


function renderArticle(item) {

  const category =
    escapeHTML(item.category || "今日资讯");

  const status =
    escapeHTML(item.status || "");

  const title =
    escapeHTML(item.title || "");

  const summary =
    escapeHTML(item.summary || "");

  const impact =
    escapeHTML(item.impact || "");


  return `

    <article class="article-card">

      <div class="article-top">

        <span class="category-pill">
          ${category}
        </span>

        ${
          status
            ? `<span class="status-label">${status}</span>`
            : ""
        }

      </div>


      <h3>
        ${title}
      </h3>


      ${
        summary
          ? `<p class="article-summary">${summary}</p>`
          : ""
      }


      ${
        impact
          ? `
            <div class="impact-box">

              <span>
                影响
              </span>

              <p>
                ${impact}
              </p>

            </div>
          `
          : ""
      }

    </article>

  `;

}


function renderSport(item) {

  const league =
    escapeHTML(item.league || "赛事");

  const status =
    escapeHTML(item.statusLabel || "");

  const time =
    escapeHTML(item.time || "");

  const stage =
    escapeHTML(item.stage || "");

  const matchup =
    escapeHTML(item.matchup || "");

  const finalResult =
    escapeHTML(item.finalResult || "");

  const note =
    escapeHTML(item.note || "");


  return `

    <article class="sport-card">

      <div class="sport-top">

        <div>

          <span class="league-pill">
            ${league}
          </span>

          ${
            stage
              ? `<span class="sport-stage">${stage}</span>`
              : ""
          }

        </div>


        ${
          status
            ? `<span class="sport-status">${status}</span>`
            : ""
        }

      </div>


      ${
        time
          ? `<div class="sport-time">${time}</div>`
          : ""
      }


      <div class="matchup">
        ${matchup}
      </div>


      ${
        finalResult
          ? `
            <div class="final-result">
              ${finalResult}
            </div>
          `
          : ""
      }


      ${
        note
          ? `<p class="sport-description">${note}</p>`
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


function renderEmptySports() {

  return `

    <div class="empty-card">

      <div class="empty-icon">
        ◌
      </div>

      <strong>
        暂无符合条件的赛事
      </strong>

      <p>
        当前时间窗口内暂无已经核验的体育赛事。
      </p>

    </div>

  `;

}


async function loadBrief() {

  try {

    const response =
      await fetch(
        DATA_URL,
        {
          cache: "no-store"
        }
      );


    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}`
      );

    }


    const data =
      await response.json();


    if (
      data.ready !== true ||
      !data.reportDate ||
      !Array.isArray(data.news) ||
      !Array.isArray(data.tech) ||
      !Array.isArray(data.sports)
    ) {

      throw new Error(
        "Brief is not ready or JSON is invalid"
      );

    }


    /*
     * Header
     */

    document
      .getElementById("reportDate")
      .textContent =
      safe(data.reportDate);


    document
      .getElementById("weekday")
      .textContent =
      safe(data.weekday);


    document
      .getElementById("heroGeneratedAt")
      .textContent =
      `更新 ${formatGeneratedTime(data.generatedAt)}`;


    /*
     * Headline
     */

    document
      .getElementById("headline")
      .textContent =
      safe(data.headline);


    document
      .getElementById("summary")
      .textContent =
      safe(data.summary);


    document
      .getElementById("leadDate")
      .textContent =
      safe(data.reportDate);


    /*
     * Stats
     */

    document
      .getElementById("newsStat")
      .textContent =
      data.news.length;


    document
      .getElementById("techStat")
      .textContent =
      data.tech.length;


    document
      .getElementById("sportsStat")
      .textContent =
      data.sports.length;


    /*
     * Section count
     */

    document
      .getElementById("newsCount")
      .textContent =
      `${data.news.length} 条`;


    document
      .getElementById("techCount")
      .textContent =
      `${data.tech.length} 条`;


    document
      .getElementById("sportsCount")
      .textContent =
      `${data.sports.length} 场`;


    /*
     * News
     */

    document
      .getElementById("newsList")
      .innerHTML =
      data.news.length
        ? data.news
            .map(renderArticle)
            .join("")
        : `
          <div class="empty-card">
            暂无符合今日时间窗口的新闻。
          </div>
        `;


    /*
     * Tech
     */

    document
      .getElementById("techList")
      .innerHTML =
      data.tech.length
        ? data.tech
            .map(renderArticle)
            .join("")
        : `
          <div class="empty-card">
            暂无符合今日时间窗口的 AI / 科技资讯。
          </div>
        `;


    /*
     * Sports
     */

    document
      .getElementById("sportsList")
      .innerHTML =
      data.sports.length
        ? data.sports
            .map(renderSport)
            .join("")
        : renderEmptySports();


    document
      .getElementById("sportsNote")
      .textContent =
      safe(data.sportsNote);


    /*
     * Footer
     */

    document
      .getElementById("generatedAt")
      .textContent =
      safe(data.generatedAt);


    /*
     * Show
     */

    loading.classList.add("hidden");

    errorBox.classList.add("hidden");

    content.classList.remove("hidden");


  } catch (error) {

    console.error(
      "Failed to load daily brief:",
      error
    );

    showError();

  }

}


loadBrief();
