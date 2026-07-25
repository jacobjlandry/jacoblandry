(() => {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Data                                                                */
  /* ------------------------------------------------------------------ */

  const PROJECTS = [
    {
      icon: '>_',
      name: 'Exodus Protocol',
      desc: 'A Matrix-inspired idle game about survival, hope, and humanity\'s last city.',
      url: '#'
    },
    {
      icon: '[ ]',
      name: 'GameSprout',
      desc: 'Curated game reviews for kids. Safe, parent-approved, and actually fun to read.',
      url: '#'
    },
    {
      icon: '</>',
      name: 'Dev Tools',
      desc: 'Open source tools and utilities that solve real problems I run into.',
      url: '#'
    }
  ];

  const ARTICLES = [
    { title: 'The Reboot: On Resets, Systems, and Starting Over', date: 'May 12, 2024', url: '#' },
    { title: 'Building Games in the Margins', date: 'Apr 28, 2024', url: '#' },
    { title: 'Why I Still Bet on PHP (in 2024)', date: 'Apr 15, 2024', url: '#' }
  ];

  const THEMES = ['matrix', 'github', 'cyber', 'amber'];
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

  /* ------------------------------------------------------------------ */
  /* Render projects & articles                                         */
  /* ------------------------------------------------------------------ */

  function renderProjects() {
    const grid = document.getElementById('project-grid');
    grid.innerHTML = PROJECTS.map(p => `
      <div class="project-card">
        <div class="project-icon">${p.icon}</div>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <a href="${p.url}">View Project →</a>
      </div>
    `).join('');
  }

  function renderArticles() {
    const list = document.getElementById('article-list');
    list.innerHTML = ARTICLES.map(a => `
      <div class="article-row">
        <a href="${a.url}">${a.title}</a>
        <span class="article-date">${a.date}</span>
      </div>
    `).join('');
  }

  /* ------------------------------------------------------------------ */
  /* Theme system                                                        */
  /* ------------------------------------------------------------------ */

  function applyTheme(name, { persist = true } = {}) {
    if (!THEMES.includes(name)) return;
    if (name === 'amber' && !isAmberUnlocked()) return;
    document.body.className = `theme-${name}`;
    document.querySelectorAll('.theme-dot').forEach(btn => {
      btn.setAttribute('data-active', String(btn.dataset.theme === name));
    });
    if (persist) localStorage.setItem('jacobos-theme', name);
  }

  function isAmberUnlocked() {
    return localStorage.getItem('jacobos-amber-unlocked') === 'true';
  }

  function unlockAmber() {
    localStorage.setItem('jacobos-amber-unlocked', 'true');
    const amberBtn = document.querySelector('.theme-dot[data-theme="amber"]');
    if (amberBtn) amberBtn.hidden = false;
  }

  function initTheme() {
    if (isAmberUnlocked()) {
      const amberBtn = document.querySelector('.theme-dot[data-theme="amber"]');
      if (amberBtn) amberBtn.hidden = false;
    }
    const saved = localStorage.getItem('jacobos-theme');
    const startTheme = (saved && THEMES.includes(saved) && (saved !== 'amber' || isAmberUnlocked())) ? saved : 'matrix';
    applyTheme(startTheme, { persist: false });

    document.querySelectorAll('.theme-dot').forEach(btn => {
      btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
    });
  }

  /* ------------------------------------------------------------------ */
  /* Boot sequence                                                       */
  /* ------------------------------------------------------------------ */

  function runBootSequence() {
    const screen = document.getElementById('boot-screen');
    const log = document.getElementById('boot-log');
    const lines = [
      'JacobOS v1.0',
      'Initializing...',
      'Loading Projects...',
      'Loading Articles...',
      'Loading Resume...',
      'Ready.'
    ];

    if (sessionStorage.getItem('jacobos-booted') === 'true') {
      screen.classList.add('hidden');
      screen.remove();
      return;
    }

    let i = 0;
    const step = 800 / lines.length;
    const interval = setInterval(() => {
      log.textContent = lines.slice(0, i + 1).join('\n') + (i === lines.length - 1 ? ' █' : '');
      i++;
      if (i >= lines.length) {
        clearInterval(interval);
        setTimeout(() => {
          screen.classList.add('hidden');
          sessionStorage.setItem('jacobos-booted', 'true');
          setTimeout(() => screen.remove(), 450);
        }, 250);
      }
    }, step);
  }

  /* ------------------------------------------------------------------ */
  /* Hidden terminal                                                     */
  /* ------------------------------------------------------------------ */

  const terminalState = { open: false, buffer: '' };

  function terminalEl() { return document.getElementById('terminal'); }
  function terminalBody() { return document.getElementById('terminal-body'); }

  function openTerminal() {
    terminalState.open = true;
    terminalEl().classList.add('open');
    renderTerminalPrompt();
  }

  function closeTerminal() {
    terminalState.open = false;
    terminalState.buffer = '';
    terminalEl().classList.remove('open');
  }

  function printLine(text, cls) {
    const body = terminalBody();
    const row = document.createElement('div');
    row.className = 'terminal-line' + (cls ? ' ' + cls : '');
    row.textContent = text;
    body.insertBefore(row, body.lastElementChild);
    body.scrollTop = body.scrollHeight;
  }

  function renderTerminalPrompt() {
    const body = terminalBody();
    body.innerHTML = '';
    const welcome = document.createElement('div');
    welcome.className = 'terminal-line out';
    welcome.textContent = "JacobOS terminal. Type 'help' for commands.";
    body.appendChild(welcome);

    const row = document.createElement('div');
    row.className = 'terminal-prompt-row';
    row.innerHTML = `<span class="prompt">&gt;</span><span class="terminal-buffer" id="terminal-buffer"></span>`;
    body.appendChild(row);
    updateBuffer();
  }

  function updateBuffer() {
    const el = document.getElementById('terminal-buffer');
    if (el) el.textContent = terminalState.buffer;
  }

  const COMMANDS = {
    help: () => [
      'help          show this list',
      'about         jump to About',
      'projects      jump to Projects',
      'writing       jump to Writing',
      'resume        jump to Resume',
      'theme <name>  matrix | github | cyber | amber',
      'stats         a few numbers',
      'whoami        who you are talking to',
      'coffee        ☕',
      'clear         clear the screen',
      'exit          close the terminal'
    ],
    about: () => (scrollToSection('about'), ['Scrolling to About...']),
    projects: () => (scrollToSection('projects'), ['Scrolling to Projects...']),
    writing: () => (scrollToSection('writing'), ['Scrolling to Writing...']),
    resume: () => (scrollToSection('resume'), ['Scrolling to Resume...']),
    stats: () => ['17 years of shipping software.', `${PROJECTS.length} projects listed, ${ARTICLES.length} articles published.`],
    whoami: () => ['A visitor poking around Jacob Landry\'s portfolio.'],
    coffee: () => ['☕ brewing... here you go.'],
    clear: () => { renderTerminalPrompt(); return null; },
    exit: () => { closeTerminal(); return null; }
  };

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  function runCommand(raw) {
    const input = raw.trim();
    if (!input) return;
    printLine('> ' + input, 'cmd');

    const [cmd, ...args] = input.toLowerCase().split(/\s+/);

    if (cmd === 'theme') {
      const name = args[0];
      if (name === 'amber' && !isAmberUnlocked()) {
        printLine('Theme locked. Find the Konami code.', 'out');
        return;
      }
      if (THEMES.includes(name)) {
        applyTheme(name);
        printLine(`Theme set to ${name}.`, 'out');
      } else {
        printLine('Usage: theme matrix | github | cyber | amber', 'out');
      }
      return;
    }

    const handler = COMMANDS[cmd];
    if (!handler) {
      printLine(`Command not found: ${cmd}. Type 'help'.`, 'out');
      return;
    }
    const output = handler();
    if (output) output.forEach(line => printLine(line, 'out'));
  }

  function initTerminal() {
    document.getElementById('terminal-close').addEventListener('click', closeTerminal);

    document.addEventListener('keydown', (e) => {
      // Ignore modifier combos and typing inside form fields
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target;
      const isFormField = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (isFormField) return;

      if (!terminalState.open) {
        // Open on any printable character typed anywhere on the page
        if (e.key.length === 1 && /[a-z0-9]/i.test(e.key)) {
          openTerminal();
          terminalState.buffer = e.key;
          updateBuffer();
        }
        return;
      }

      // Terminal is open
      if (e.key === 'Escape') {
        closeTerminal();
        return;
      }
      if (e.key === 'Enter') {
        const cmd = terminalState.buffer;
        terminalState.buffer = '';
        runCommand(cmd);
        if (terminalState.open) updateBuffer();
        return;
      }
      if (e.key === 'Backspace') {
        terminalState.buffer = terminalState.buffer.slice(0, -1);
        updateBuffer();
        return;
      }
      if (e.key.length === 1) {
        terminalState.buffer += e.key;
        updateBuffer();
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Konami code                                                         */
  /* ------------------------------------------------------------------ */

  function initKonami() {
    let progress = 0;
    document.addEventListener('keydown', (e) => {
      const expected = KONAMI[progress];
      const matches = e.key === expected || e.key.toLowerCase() === expected;
      if (matches) {
        progress++;
        if (progress === KONAMI.length) {
          progress = 0;
          if (!isAmberUnlocked()) {
            unlockAmber();
            openTerminal();
            printLine('Access granted...', 'out');
            printLine('Loading legacy interface...', 'out');
            printLine('Amber Terminal unlocked.', 'out');
            applyTheme('amber');
          }
        }
      } else {
        progress = (e.key === KONAMI[0]) ? 1 : 0;
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Console easter egg                                                   */
  /* ------------------------------------------------------------------ */

  function printConsoleEasterEgg() {
    const msg = [
      '------------------------------------------------',
      "Hello, fellow developer.",
      "Looks like you're inspecting the source.",
      "If you're hiring, I'd love to chat.",
      'github.com/jacobjlandry',
      '------------------------------------------------'
    ].join('\n');
    console.log(msg);
  }

  /* ------------------------------------------------------------------ */
  /* Nav toggle & misc                                                    */
  /* ------------------------------------------------------------------ */

  function initNav() {
    const toggle = document.getElementById('nav-toggle');
    const nav = toggle.closest('nav');
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    nav.querySelectorAll('a, button[data-theme]').forEach(el => {
      el.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  function initBackToTop() {
    document.getElementById('back-top').addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Init                                                                 */
  /* ------------------------------------------------------------------ */

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();
    renderProjects();
    renderArticles();
    initTheme();
    initTerminal();
    initKonami();
    initNav();
    initBackToTop();
    runBootSequence();
    printConsoleEasterEgg();
  });
})();

