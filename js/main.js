/* =========================================
   CampusGuardian - Main Script
   Load on every page with: <script src="js/main.js"></script>
   Each feature checks for its own elements and does nothing if they are missing.
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  initActiveMenu();
  initSidebar();
  initPanic();
  initTypeSelect();
  initLiveClock();
  initCountUp();
  initReveal();
  initBuildings();
  initComplaintForm();
  initReportFilter();
  initEmergencyReport();
  initLocation();
  initAuth();
  initProfile();
});

/* ---------- Sidebar: highlight the current page ---------- */
function initActiveMenu() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar .nav a').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === current);
  });
}

/* ---------- Sidebar: opens on hover or ☰ click ---------- */
function initSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  const edge = document.createElement('div');
  edge.className = 'menu-edge';
  document.body.appendChild(edge);

  const icon = document.createElement('button');
  icon.className = 'menu-icon';
  icon.setAttribute('aria-label', 'Open menu');
  icon.textContent = '☰';
  document.body.appendChild(icon);

  let hideTimer = null;

  const openMenu = () => {
    clearTimeout(hideTimer);
    sidebar.classList.add('open');
    icon.classList.add('hide');
  };
  const closeMenu = () => {
    sidebar.classList.remove('open');
    icon.classList.remove('hide');
  };
  const closeLater = () => {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(closeMenu, 300);
  };

  edge.addEventListener('mouseenter', openMenu);
  sidebar.addEventListener('mouseenter', openMenu);
  sidebar.addEventListener('mouseleave', closeLater);

  icon.addEventListener('click', e => {
    e.stopPropagation();
    openMenu();
  });

  document.addEventListener('click', e => {
    if (!sidebar.contains(e.target) && e.target !== icon) closeMenu();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ---------- Panic button with confirmation ---------- */
function initPanic() {
  const panicBtn = document.querySelector('.panic-btn');
  if (!panicBtn) return;

  const overlay = document.createElement('div');
  overlay.className = 'panic-overlay';
  overlay.innerHTML = `
    <div class="panic-modal">
      <div class="panic-icon">🚨</div>
      <h2>Send emergency alert?</h2>
      <p>This will notify the campus security team immediately.</p>
      <div class="panic-actions">
        <button class="btn btn-ghost" id="panicCancel">Cancel</button>
        <button class="btn btn-danger" id="panicConfirm">Confirm</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const close = () => overlay.classList.remove('show');

  panicBtn.addEventListener('click', () => overlay.classList.add('show'));
  document.getElementById('panicCancel').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.getElementById('panicConfirm').addEventListener('click', () => {
    close();
    alert('Alert sent to campus security. Stay safe!');
  });
}

/* ---------- Emergency type: select one at a time ---------- */
function initTypeSelect() {
  const cards = document.querySelectorAll('.type-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });
}

/* ---------- Dashboard: live clock ---------- */
function initLiveClock() {
  const clock = document.getElementById('liveClock');
  if (!clock) return;

  const update = () => {
    clock.textContent = new Date().toLocaleString('en-GB', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };
  update();
  setInterval(update, 1000);
}

/* ---------- Count-up animation for every .stat-value ---------- */
function initCountUp() {
  document.querySelectorAll('.stat-value').forEach(el => {
    const target = parseFloat(el.textContent.replace(/,/g, ''));
    if (isNaN(target)) return;

    const hasComma = el.textContent.includes(',');
    const duration = 1000;
    const start = performance.now();

    const frame = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = hasComma ? value.toLocaleString('en-US') : value;
      if (progress < 1) requestAnimationFrame(frame);
    };

    el.textContent = '0';
    requestAnimationFrame(frame);
  });
}

/* ---------- Scroll reveal for every .reveal element ---------- */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (items.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(el => io.observe(el));
}

/* ---------- Home: click a 3D building to see its info ---------- */
function initBuildings() {
  const buildings = document.querySelectorAll('.campus-plane .b');
  const info = document.getElementById('buildingInfo');
  if (buildings.length === 0 || !info) return;

  buildings.forEach(building => {
    building.addEventListener('click', () => {
      buildings.forEach(b => b.classList.remove('picked'));
      building.classList.add('picked');
      info.innerHTML = '<b>' + building.dataset.name + '</b><p>' + building.dataset.info + '</p>';
    });
  });
}

/* ---------- Complaint form: validation, progress and counter ---------- */
function initComplaintForm() {
  const form = document.querySelector('.section-form');
  if (!form) return;

  const nameInput = form.querySelector('input[placeholder="Your name"]');
  const idInput = form.querySelector('input[placeholder^="e.g. 2026"]');
  const details = form.querySelector('textarea');
  const confirmBox = form.querySelector('.confirm-box input');
  const fill = document.getElementById('progressFill');
  const pctText = document.getElementById('progressText');
  const counter = document.getElementById('charCount');

  // Shows or clears an error under a field. Returns true when the field is valid.
  function markError(input, message) {
    input.parentElement.querySelector('.field-error')?.remove();
    input.style.borderColor = '';
    if (!message) return true;

    input.style.borderColor = 'var(--red)';
    const p = document.createElement('div');
    p.className = 'field-error';
    p.textContent = message;
    input.parentElement.appendChild(p);
    return false;
  }

  function updateProgress() {
    let done = 0;
    if (nameInput.value.trim()) done++;
    if (idInput.value.trim()) done++;
    if (details.value.trim().length >= 20) done++;
    if (confirmBox.checked) done++;

    const pct = Math.round((done / 4) * 100);
    if (fill) fill.style.width = pct + '%';
    if (pctText) pctText.textContent = pct + '%';
  }

  function updateCounter() {
    if (!counter) return;
    const len = details.value.trim().length;
    counter.textContent = len + ' / 20';
    counter.style.color = len >= 20 ? 'var(--green)' : 'var(--muted)';
  }

  form.addEventListener('input', () => { updateProgress(); updateCounter(); });
  form.addEventListener('change', updateProgress);
  form.addEventListener('reset', () => {
    setTimeout(() => { updateProgress(); updateCounter(); }, 0);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Check every field so all errors show at once
    const valid = [
      markError(nameInput, nameInput.value.trim() ? '' : 'Please enter your full name.'),
      markError(idInput, idInput.value.trim() ? '' : 'Please enter your Student ID.'),
      markError(details, details.value.trim().length >= 20 ? '' : 'Description must be at least 20 characters.')
    ].every(Boolean);

    if (!confirmBox.checked) {
      alert('Please confirm that the information is accurate.');
      return;
    }
    if (!valid) return;

    alert('Complaint submitted successfully!');
    form.reset();
  });

  updateProgress();
  updateCounter();
}

/* ---------- Report list: status filter and search ---------- */
function initReportFilter() {
  const table = document.querySelector('.table');
  if (!table) return;

  const rows = table.querySelectorAll('tbody tr');
  const chips = document.querySelectorAll('.chip');
  const searchInput = document.querySelector('.search input');

  let currentFilter = 'All';
  let currentQuery = '';

  const rowStatus = row => row.querySelector('.status')?.textContent.trim() || '';

  function applyFilters() {
    rows.forEach(row => {
      const matchStatus = currentFilter === 'All' || rowStatus(row) === currentFilter;
      const matchSearch = row.textContent.toLowerCase().includes(currentQuery);
      row.classList.toggle('hidden', !(matchStatus && matchSearch));
    });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.dataset.filter;
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentQuery = searchInput.value.trim().toLowerCase();
      applyFilters();
    });
  }
}

/* ---------- Emergency report: submit simulation ---------- */
function initEmergencyReport() {
  const submitBtn = document.querySelector('.submit-btn');
  const sosBtn = document.querySelector('.sos-btn');
  if (!submitBtn) return;

  const locInput = document.querySelector('input[placeholder^="e.g. Main Gate"]');
  const descInput = document.querySelector('.report-card textarea');
  const gpsInput = document.getElementById('locValue');

  function nextReportId() {
    let last = 1020;
    try { last = parseInt(localStorage.getItem('cg_last_id') || '1020', 10); } catch (e) {}
    const next = last + 1;
    try { localStorage.setItem('cg_last_id', next); } catch (e) {}
    return '#CG-' + next;
  }

  function send(source) {
    const selected = document.querySelector('.type-card.selected');
    const type = selected ? selected.querySelector('b').textContent : 'Unknown';
    const place = locInput ? locInput.value.trim() : '';
    const gps = gpsInput && gpsInput.value ? gpsInput.value : 'Not shared';

    if (source === 'form' && place === '') {
      alert('Please enter the location of the incident.');
      return;
    }

    const id = nextReportId();
    alert(
      'Report submitted successfully!\n\n' +
      'Report ID: ' + id + '\n' +
      'Type: ' + type + '\n' +
      'Location: ' + (place || 'Not specified') + '\n' +
      'GPS: ' + gps + '\n\n' +
      'Security team has been notified.'
    );

    if (source === 'form') {
      if (descInput) descInput.value = '';
      if (locInput) locInput.value = '';
    }
  }

  submitBtn.addEventListener('click', () => send('form'));

  if (sosBtn) {
    sosBtn.addEventListener('click', () => {
      if (confirm('Send an SOS alert to campus security now?')) send('sos');
    });
  }
}

/* ---------- Emergency page: live location and Google Maps ---------- */
function initLocation() {
  const btn = document.getElementById('locBtn');
  if (!btn) return;

  const status = document.getElementById('locStatus');
  const coords = document.getElementById('locCoords');
  const hidden = document.getElementById('locValue');
  const frame = document.getElementById('mapFrame');
  const placeholder = document.getElementById('mapPlaceholder');
  const link = document.getElementById('mapLink');

  function showMap(lat, lng) {
    frame.src = `https://maps.google.com/maps?q=${lat},${lng}&z=17&output=embed`;
    frame.hidden = false;
    placeholder.hidden = true;
    link.href = `https://www.google.com/maps?q=${lat},${lng}`;
    link.hidden = false;
  }

  btn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      status.textContent = '❌ Your browser does not support location.';
      return;
    }

    status.textContent = 'Getting your location...';

    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude.toFixed(5);
        const lng = pos.coords.longitude.toFixed(5);
        status.textContent = '✅ Location found (accuracy about ' + Math.round(pos.coords.accuracy) + ' m)';
        coords.textContent = 'Lat: ' + lat + ', Lng: ' + lng;
        hidden.value = lat + ',' + lng;
        btn.textContent = '🔄 Refresh location';
        showMap(lat, lng);
      },
      err => {
        const reasons = {
          1: 'Permission denied. Click the lock icon in the address bar and allow location.',
          2: 'Location unavailable. Check that GPS or Wi-Fi location is on.',
          3: 'Timed out. Try again.'
        };
        status.textContent = '❌ ' + (reasons[err.code] || 'Unknown error.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

/* ---------- Login and register: validation ---------- */
function initAuth() {
  const form = document.querySelector('.auth-card form');
  if (!form) return;

  const isRegister = window.location.pathname.includes('register');
  const inputs = form.querySelectorAll('input');
  const terms = form.querySelector('input[type="checkbox"]');

  function showMessage(text, ok) {
    let box = form.querySelector('.auth-msg');
    if (!box) {
      box = document.createElement('div');
      form.prepend(box);
    }
    box.textContent = text;
    box.className = 'auth-msg ' + (ok ? 'ok' : 'err');
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    if (!isRegister) {
      const id = inputs[0].value.trim();
      const password = inputs[1].value;

      if (!id) return showMessage('Please enter your email or Student ID.', false);
      if (password.length < 6) return showMessage('Password must be at least 6 characters.', false);
      return showMessage('Login successful!', true);
    }

    const name = inputs[0].value.trim();
    const studentId = inputs[1].value.trim();
    const email = inputs[2].value.trim();
    const password = inputs[3].value;
    const confirmPassword = inputs[4].value;

    if (!name || !studentId || !email) return showMessage('Please fill in all fields.', false);
    if (!/^\S+@\S+\.\S+$/.test(email)) return showMessage('Please enter a valid email address.', false);
    if (password.length < 6) return showMessage('Password must be at least 6 characters.', false);
    if (password !== confirmPassword) return showMessage('Passwords do not match.', false);
    if (!terms.checked) return showMessage('Please accept the terms and conditions.', false);

    showMessage('Registration successful!', true);
    form.reset();
  });
}

/* ---------- Profile: tabs, privacy toggle, edit modal ---------- */
function initProfile() {
  const tabs = document.querySelectorAll('.tab');
  if (tabs.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab)?.classList.add('active');
    });
  });

  const privacyBtn = document.getElementById('togglePrivacy');
  if (privacyBtn) {
    let shown = false;
    privacyBtn.addEventListener('click', () => {
      shown = !shown;
      document.querySelectorAll('.masked').forEach(m => m.classList.toggle('show', shown));
      privacyBtn.textContent = shown ? '🙈 Hide private details' : '👁️ Show private details';
    });
  }

  const modal = document.getElementById('editModal');
  const form = document.getElementById('editForm');
  const openBtn = document.getElementById('openEdit');
  const cancelBtn = document.getElementById('cancelEdit');
  if (!modal || !form || !openBtn) return;

  const input = id => document.getElementById(id);
  const field = name => document.querySelector('[data-field="' + name + '"]');

  // Input id → the matching data-field on the page
  const pairs = { inEmail: 'email', inPhone: 'phone', inHall: 'hall', inEmergency: 'emergency' };

  function openModal() {
    Object.entries(pairs).forEach(([inputId, fieldName]) => {
      const inp = input(inputId);
      const src = field(fieldName);
      if (inp && src) inp.value = src.textContent.trim();
    });
    modal.classList.add('show');
  }

  function closeModal() {
    modal.classList.remove('show');
  }

  openBtn.addEventListener('click', openModal);
  cancelBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const emailInput = input('inEmail');
    const phoneInput = input('inPhone');
    const email = emailInput ? emailInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';

    if (emailInput && !/^\S+@\S+\.\S+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (phoneInput && !/^\+?[0-9\s-]{8,}$/.test(phone)) {
      alert('Please enter a valid phone number.');
      return;
    }

    const setText = (name, value) => {
      const el = field(name);
      if (el && value) el.textContent = value;
    };

    setText('email', email);
    setText('phone', phone);
    setText('hall', input('inHall')?.value.trim());
    setText('emergency', input('inEmergency')?.value.trim());

    closeModal();
    showMessage('Profile updated.', true);
  });
}