// =====================================================================
//  공통 렌더링 스크립트
//  - 헤더/푸터를 모든 페이지에 자동 삽입
//  - data/*.js 의 내용을 각 페이지에 그려줌
//  내용 수정은 data 폴더에서만 하면 됩니다. 이 파일은 보통 건드릴 필요 없습니다.
// =====================================================================
(function () {
  const L = window.LAB;

  const NAV = [
    { href: "index.html", label: "Home" },
    { href: "about.html", label: "About" },
    { href: "research.html", label: "Research" },
    { href: "members.html", label: "Members" },
    { href: "publications.html", label: "Publications" },
    { href: "news.html", label: "News" },
    { href: "contact.html", label: "Contact" },
  ];

  // ---------- helpers ----------
  const $ = (sel) => document.querySelector(sel);
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const initials = (name) =>
    String(name || "?").split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const avatar = (photo, name, cls) =>
    photo
      ? `<img class="${cls}" src="${esc(photo)}" alt="${esc(name)}" loading="lazy">`
      : `<div class="${cls} avatar-initial" aria-hidden="true">${esc(initials(name))}</div>`;
  const cardImg = (image, label) =>
    image
      ? `<div class="card-img" style="background-image:url('${esc(image)}')"></div>`
      : `<div class="card-img placeholder">${esc(label || "")}</div>`;
  const num = (i) => String(i + 1).padStart(2, "0");
  const fmtDate = (d) => String(d || "").replace(/-/g, ". ");

  // ---------- header / footer ----------
  function renderHeader() {
    const page = location.pathname.split("/").pop() || "index.html";
    const el = $("#site-header");
    if (!el) return;
    el.className = "site-header";
    el.innerHTML = `
      <div class="container">
        <a class="brand" href="index.html">
          <strong>${esc(L.shortName)}</strong>
          <span>${esc(L.department)}</span>
        </a>
        <button class="nav-toggle" aria-label="메뉴 열기" aria-expanded="false"><span></span></button>
        <nav class="nav">
          ${NAV.map((n) => `<a href="${n.href}" class="${n.href === page ? "active" : ""}">${n.label}</a>`).join("")}
        </nav>
      </div>`;
    const btn = el.querySelector(".nav-toggle");
    const nav = el.querySelector(".nav");
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
    });
  }

  function renderFooter() {
    const el = $("#site-footer");
    if (!el) return;
    el.className = "site-footer";
    const c = L.contact;
    el.innerHTML = `
      <div class="container">
        <div class="cols">
          <div>
            <strong>${esc(L.nameEn)}</strong><br>
            ${esc(L.nameKo)} · ${esc(L.department)}
          </div>
          <div>
            ${esc(c.address)}<br>
            Tel. ${esc(c.labPhone)} · <a href="mailto:${esc(c.email)}">${esc(c.email)}</a>
          </div>
        </div>
        <div class="copy">© ${new Date().getFullYear()} ${esc(L.nameEn)}. All rights reserved.</div>
      </div>`;
  }

  // ---------- components ----------
  function researchCards(list) {
    return list
      .map(
        (r, i) => `
      <a class="card" href="research.html#${esc(r.id)}">
        ${cardImg(r.image, num(i))}
        <div class="card-body">
          <h3>${esc(r.title)}</h3>
          <p>${esc(r.summary)}</p>
          <div class="tags">${(r.keywords || []).map((k) => `<span class="tag">${esc(k)}</span>`).join("")}</div>
        </div>
      </a>`
      )
      .join("");
  }

  function newsCards(list) {
    return list
      .map(
        (n) => `
      <article class="card news-item">
        ${cardImg(n.image, "")}
        <div class="card-body">
          <div class="news-date">${esc(fmtDate(n.date))}</div>
          <h3>${esc(n.title)}</h3>
          <p>${esc(n.body)}</p>
        </div>
      </article>`
      )
      .join("");
  }

  function boldPI(authors) {
    const safe = esc(authors);
    const pi = window.PI_NAME;
    return pi ? safe.split(esc(pi)).join(`<b>${esc(pi)}</b>`) : safe;
  }

  function pubItem(p, i) {
    const badge = { journal: "Journal", conference: "Conference", patent: "Patent" }[p.type] || p.type;
    return `
      <div class="pub">
        <div class="num">${i}.</div>
        <div>
          <div class="title">${esc(p.title)}</div>
          <div class="authors">${boldPI(p.authors)}</div>
          <div class="venue"><span class="badge">${esc(badge)}</span><i>${esc(p.venue)}</i>${p.detail ? ", " + esc(p.detail) : ""} (${esc(p.year)})</div>
        </div>
        <div>${p.link ? `<a class="link-btn" href="${esc(p.link)}" target="_blank" rel="noopener">Link ↗</a>` : ""}</div>
      </div>`;
  }

  const sortedPubs = () => [...(window.PUBLICATIONS || [])].sort((a, b) => b.year - a.year);
  const sortedNews = () => [...(window.NEWS || [])].sort((a, b) => (a.date < b.date ? 1 : -1));

  // ---------- pages ----------
  const pages = {
    home() {
      $("#hero-eyebrow").textContent = L.department;
      $("#hero-title").textContent = L.nameEn;
      $("#hero-lead").textContent = L.tagline;
      $("#home-intro").textContent = L.intro;
      $("#home-research").innerHTML = researchCards(window.RESEARCH || []);
      $("#home-news").innerHTML = newsCards(sortedNews().slice(0, 3));
      const pubs = sortedPubs().filter((p) => p.type === "journal").slice(0, 5);
      $("#home-pubs").innerHTML = pubs.map((p, i) => pubItem(p, i + 1)).join("") || `<p class="empty">아직 등록된 논문이 없습니다.</p>`;
    },

    about() {
      const p = L.pi;
      $("#about-intro").textContent = L.intro;
      $("#pi").innerHTML = `
        ${avatar(p.photo, p.nameEn, "pi-photo")}
        <div class="pi-info">
          <h3>${esc(p.nameEn)} <span style="color:var(--muted);font-weight:500;font-size:1.1rem">${esc(p.nameKo)}</span></h3>
          <div class="role">${esc(p.title)}, ${esc(L.department)}</div>
          <dl class="info-list">
            <dt>Email</dt><dd><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></dd>
            <dt>Phone</dt><dd>${esc(p.phone)}</dd>
            <dt>Office</dt><dd>${esc(p.office)}</dd>
          </dl>
          <h4 class="subhead">Research Interests</h4>
          <ul>${p.interests.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
          <h4 class="subhead">Education</h4>
          <ul>${p.education.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
          <h4 class="subhead">Career</h4>
          <ul>${p.career.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        </div>`;
    },

    research() {
      $("#research-list").innerHTML = (window.RESEARCH || [])
        .map(
          (r, i) => `
        <div class="research-row" id="${esc(r.id)}">
          ${cardImg(r.image, num(i))}
          <div>
            <h2>${esc(r.title)}</h2>
            <p>${esc(r.detail)}</p>
            <div class="tags">${(r.keywords || []).map((k) => `<span class="tag">${esc(k)}</span>`).join("")}</div>
          </div>
        </div>`
        )
        .join("");
      const projects = window.PROJECTS || [];
      if (!projects.length) {
        $("#projects-section").remove();
        return;
      }
      $("#project-list").innerHTML = projects
        .map(
          (p) => `
        <div class="project">
          <h3>${esc(p.title)}</h3>
          <div class="meta">${esc(p.sponsor)} · ${esc(p.period)}</div>
          ${p.description ? `<p style="margin:6px 0 0">${esc(p.description)}</p>` : ""}
        </div>`
        )
        .join("");
    },

    members() {
      const members = window.MEMBERS || [];
      $("#member-list").innerHTML = (window.MEMBER_GROUPS || [])
        .map((g) => {
          const list = members.filter((m) => m.group === g);
          if (!list.length) return "";
          return `
          <div class="member-group">
            <h2>${esc(g)}</h2>
            <div class="grid grid-4 members">
              ${list
                .map(
                  (m) => `
                <div class="card member-card">
                  ${avatar(m.photo, m.nameEn, "member-photo")}
                  <h3>${esc(m.nameEn)}</h3>
                  <div class="ko">${esc(m.nameKo)}</div>
                  ${m.topic ? `<div class="topic">${esc(m.topic)}</div>` : ""}
                  ${m.since ? `<div class="meta">Since ${esc(m.since)}</div>` : ""}
                  ${m.email ? `<a class="mail" href="mailto:${esc(m.email)}">${esc(m.email)}</a>` : ""}
                </div>`
                )
                .join("")}
            </div>
          </div>`;
        })
        .join("");

      const alumni = window.ALUMNI || [];
      if (!alumni.length) {
        $("#alumni-section").remove();
        return;
      }
      $("#alumni-body").innerHTML = alumni
        .map(
          (a) => `<tr>
            <td><b>${esc(a.nameEn)}</b><br><span style="color:var(--muted)">${esc(a.nameKo)}</span></td>
            <td>${esc(a.degree)}</td>
            <td>${esc(a.thesis)}</td>
            <td>${esc(a.position)}</td>
          </tr>`
        )
        .join("");
    },

    publications() {
      const all = sortedPubs();
      const box = $("#pub-list");
      const draw = (type) => {
        const list = type === "all" ? all : all.filter((p) => p.type === type);
        if (!list.length) {
          box.innerHTML = `<p class="empty">등록된 항목이 없습니다.</p>`;
          return;
        }
        let html = "";
        let year = null;
        let n = list.length;
        list.forEach((p) => {
          if (p.year !== year) {
            year = p.year;
            html += `<div class="pub-year">${esc(year)}</div>`;
          }
          html += pubItem(p, n--);
        });
        box.innerHTML = html;
      };
      document.querySelectorAll(".filter-btn").forEach((b) =>
        b.addEventListener("click", () => {
          document.querySelectorAll(".filter-btn").forEach((x) => x.classList.remove("active"));
          b.classList.add("active");
          draw(b.dataset.type);
        })
      );
      draw("all");
    },

    news() {
      $("#news-list").innerHTML = sortedNews()
        .map(
          (n) => `
        <article class="news-row">
          ${cardImg(n.image, "")}
          <div>
            <div class="news-date">${esc(fmtDate(n.date))}</div>
            <h3>${esc(n.title)}</h3>
            <p>${esc(n.body)}</p>
          </div>
        </article>`
        )
        .join("");
    },

    contact() {
      const c = L.contact;
      const p = L.pi;
      $("#contact-info").innerHTML = `
        <h3 style="margin-top:0;color:var(--primary)">${esc(L.nameEn)}</h3>
        <dl class="info-list">
          <dt>Address</dt><dd>${esc(c.address)}</dd>
          <dt>Lab</dt><dd>${esc(c.labRoom)}</dd>
          <dt>Tel</dt><dd>${esc(c.labPhone)}</dd>
          <dt>Email</dt><dd><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></dd>
        </dl>
        <h4 class="subhead">Principal Investigator</h4>
        <dl class="info-list">
          <dt>Name</dt><dd>${esc(p.title)} ${esc(p.nameEn)} (${esc(p.nameKo)})</dd>
          <dt>Office</dt><dd>${esc(p.office)}</dd>
          <dt>Tel</dt><dd>${esc(p.phone)}</dd>
          <dt>Email</dt><dd><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></dd>
        </dl>
        <h4 class="subhead">Join Us</h4>
        <p style="margin:0;color:var(--muted)">대학원 진학 및 인턴에 관심 있는 학생은 CV와 함께 이메일로 연락 주세요.</p>`;
      $("#map").innerHTML = c.mapEmbed
        ? `<iframe class="map" src="${esc(c.mapEmbed)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="map"></iframe>`
        : `<div class="map map-placeholder">data/lab.js 의 contact.mapEmbed 에<br>구글 지도 퍼가기 주소를 넣으면 여기에 지도가 표시됩니다.</div>`;
    },
  };

  // ---------- boot ----------
  document.title = document.title.replace("{{LAB}}", L.shortName);
  renderHeader();
  renderFooter();
  const page = document.body.dataset.page;
  if (pages[page]) pages[page]();
})();
