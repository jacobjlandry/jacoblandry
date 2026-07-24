async function fetchJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

function formatDate(str) {
  if (!str) return '';
  const [year, month] = str.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return month ? `${months[parseInt(month, 10) - 1]} ${year}` : year;
}

function renderProjects(projects) {
  const grid = document.getElementById('project-grid');
  if (!grid) return;

  const featured = projects.filter(p => p.featured !== false);

  grid.innerHTML = featured.map(p => `
    <a class="card" href="${p.url}" target="_blank" rel="noopener noreferrer">
      <div class="card-name">
        <span>${p.name}</span>
        <span class="card-arrow">↗</span>
      </div>
      <p class="card-desc">${p.description}</p>
      <div class="tag-strip">
        ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    </a>
  `).join('');
}

function renderArticles(articles) {
  const list = document.getElementById('article-list');
  if (!list) return;

  const featured = articles.filter(a => a.featured !== false);

  list.innerHTML = featured.map(a => `
    <a class="article-row" href="${a.url}" target="_blank" rel="noopener noreferrer">
      <span class="pub-badge ${a.publication}">${a.publication}</span>
      <div class="article-body">
        <div class="article-title">${a.title}</div>
        <div class="article-summary">${a.summary}</div>
      </div>
      <span class="article-date">${formatDate(a.date)}</span>
    </a>
  `).join('');
}

async function init() {
  try {
    const [projects, articles] = await Promise.all([
      fetchJSON('./projects.json'),
      fetchJSON('./articles.json')
    ]);
    renderProjects(projects);
    renderArticles(articles);
  } catch (err) {
    console.error('Data load error:', err);
  }
}

document.addEventListener('DOMContentLoaded', init);

