document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const links = document.querySelectorAll('.sidebar .nav a');

  links.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});
// ===== Step 2: Panic button with confirmation popup =====
document.addEventListener('DOMContentLoaded', () => {
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

  const openModal = () => overlay.classList.add('show');
  const closeModal = () => overlay.classList.remove('show');

  panicBtn.addEventListener('click', openModal);
  document.getElementById('panicCancel').addEventListener('click', closeModal);

  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.getElementById('panicConfirm').addEventListener('click', () => {
    closeModal();
    alert('Alert sent to campus security. Stay safe!'); 
  });
});

// ===== Step 3: Select one emergency type at a time =====
document.addEventListener('DOMContentLoaded', () => {
  const typeCards = document.querySelectorAll('.type-card');
  if (typeCards.length === 0) return; 

  typeCards.forEach(card => {
    card.addEventListener('click', () => {
      typeCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });
});

// ===== Step 4: Form validation for complaint form =====
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (!form || !document.querySelector('.card form')) return;

  const nameInput = form.querySelector('input[placeholder="Your name"]');
  const idInput = form.querySelector('input[placeholder^="e.g. 2026"]');
  const detailsInput = form.querySelector('textarea');
  const checkbox = form.querySelector('input[type="checkbox"]');

  function showError(input, message) {
    clearError(input);
    input.style.borderColor = 'var(--red)';
    const msg = document.createElement('div');
    msg.className = 'field-error';
    msg.textContent = message;
    input.parentElement.appendChild(msg);
  }

  function clearError(input) {
    input.style.borderColor = '';
    const old = input.parentElement.querySelector('.field-error');
    if (old) old.remove();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Name validation
    if (nameInput.value.trim() === '') {
      showError(nameInput, 'Please enter your full name.');
      valid = false;
    } else {
      clearError(nameInput);
    }

    // Student ID
    if (idInput.value.trim() === '') {
      showError(idInput, 'Please enter your Student ID.');
      valid = false;
    } else {
      clearError(idInput);
    }

    // Details validation
    if (detailsInput.value.trim().length < 20) {
      showError(detailsInput, 'Description must be at least 20 characters.');
      valid = false;
    } else {
      clearError(detailsInput);
    }

    // Checkbox validation
    if (!checkbox.checked) {
      alert('Please confirm that the information is accurate.');
      valid = false;
    }

    if (valid) {
      alert('Complaint submitted successfully!');
      form.reset();
    }
  });
});

// ===== Step 5: Emergency report submit simulation =====
document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.querySelector('.btn-danger.btn-block');
  const sosBtn = document.querySelector('.emergency-hero .btn');
  if (!submitBtn) return; // Emergency report form not present on this page

  // Report ID generation using localStorage
  function makeReportId() {
    const last = parseInt(localStorage.getItem('cg_last_id') || '1020', 10);
    const next = last + 1;
    localStorage.setItem('cg_last_id', next);
    return '#CG-' + next;
  }

  function submitReport(source) {
    const selected = document.querySelector('.type-card.selected');
    const type = selected ? selected.querySelector('b').textContent : 'Unknown';
    const location = document.querySelector('input[placeholder^="e.g. Main Gate"]');
    const place = location ? location.value.trim() : '';

    // Validate location for form submission
    if (source === 'form' && place === '') {
      alert('Please enter the location of the incident.');
      return;
    }

    const id = makeReportId();
    alert(
      'Report submitted successfully!\n\n' +
      'Report ID: ' + id + '\n' +
      'Type: ' + type + '\n' +
      'Location: ' + (place || 'Not specified') + '\n\n' +
      'Security team has been notified.'
    );

    // Reset form fields only if the submission was from the form
    if (source === 'form') {
      document.querySelector('textarea').value = '';
      location.value = '';
    }
  }

  submitBtn.addEventListener('click', () => submitReport('form'));

  if (sosBtn) {
    sosBtn.addEventListener('click', () => {
      if (confirm('Send an SOS alert to campus security now?')) {
        submitReport('sos');
      }
    });
  }
});

// ===== Step 6: Report List filter and search =====
document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('.table');
  if (!table) return; // Report List not present on this page

  const rows = table.querySelectorAll('tbody tr');
  const chips = document.querySelectorAll('.chip');
  const searchInput = document.querySelector('.search input');

  let currentFilter = 'All';
  let currentQuery = '';

  // Get the status text of a row
  function rowStatus(row) {
    return row.querySelector('.status').textContent.trim();
  }

  // Filter and search together
  function applyFilters() {
    rows.forEach(row => {
      const matchStatus = currentFilter === 'All' || rowStatus(row) === currentFilter;
      const text = row.textContent.toLowerCase();
      const matchSearch = text.includes(currentQuery);
      row.classList.toggle('hidden', !(matchStatus && matchSearch));
    });
  }

  // Chip click
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.dataset.filter;
      applyFilters();
    });
  });

  // Search typing
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentQuery = searchInput.value.trim().toLowerCase();
      applyFilters();
    });
  }
});

// ===== Step 7: Live clock and number count-up animation =====
document.addEventListener('DOMContentLoaded', () => {
  // ---- Live clock ----
  const clock = document.getElementById('liveClock');
  if (clock) {
    function updateClock() {
      const now = new Date();
      clock.textContent = now.toLocaleString('en-GB', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    }
    updateClock();
    setInterval(updateClock, 1000); // Update every second
  }

  // ---- Count-up animation for stat values ----
  const statValues = document.querySelectorAll('.stat-value');
  statValues.forEach(el => {
    // Remove commas and parse the number
    const raw = el.textContent.replace(/,/g, '');
    const target = parseFloat(raw);
    if (isNaN(target)) return;

    const hasComma = el.textContent.includes(',');
    const duration = 1000; // 1 second
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic easing function
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = hasComma ? value.toLocaleString('en-US') : value;
      if (progress < 1) requestAnimationFrame(frame);
    }

    el.textContent = '0';
    requestAnimationFrame(frame);
  });
});

// ===== Step 8: Login and Register validation =====
document.addEventListener('DOMContentLoaded', () => {
  const authForm = document.querySelector('.auth-card form');
  if (!authForm) return; // Login/Register form not present on this page

  const isRegister = window.location.pathname.includes('register');

  function showMessage(text, ok) {
    let box = document.querySelector('.auth-msg');
    if (!box) {
      box = document.createElement('div');
      box.className = 'auth-msg';
      authForm.prepend(box);
    }
    box.textContent = text;
    box.className = 'auth-msg ' + (ok ? 'ok' : 'err');
  }

  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = authForm.querySelectorAll('input');
    const checkbox = authForm.querySelector('input[type="checkbox"]');

    if (!isRegister) {
      // ---- Login ----
      const id = inputs[0].value.trim();
      const password = inputs[1].value;

      if (id === '') return showMessage('Please enter your email or Student ID.', false);
      if (password.length < 6) return showMessage('Password must be at least 6 characters.', false);

      showMessage('Login successful! (Backend will be added later)', true);
    } else {
      // ---- Register ----
      const name = inputs[0].value.trim();
      const studentId = inputs[1].value.trim();
      const email = inputs[2].value.trim();
      const pass = inputs[3].value;
      const confirm = inputs[4].value;

      if (name === '' || studentId === '' || email === '') {
        return showMessage('Please fill in all fields.', false);
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return showMessage('Please enter a valid email address.', false);
      }
      if (pass.length < 6) {
        return showMessage('Password must be at least 6 characters.', false);
      }
      if (pass !== confirm) {
        return showMessage('Passwords do not match.', false);
      }
      if (!checkbox.checked) {
        return showMessage('Please accept the terms and conditions.', false);
      }

      showMessage('Registration successful! (Backend will be added later)', true);
      authForm.reset();
    }
  });
});

// ===== Step 9: Click a 3D building to show its info =====
document.addEventListener('DOMContentLoaded', () => {
  const buildings = document.querySelectorAll('.campus-plane .b');
  const info = document.getElementById('buildingInfo');
  if (buildings.length === 0 || !info) return;

  buildings.forEach(building => {
    building.style.cursor = 'pointer';

    building.addEventListener('click', () => {
      // Remove 'picked' class from all buildings and add to the clicked one
      buildings.forEach(b => b.classList.remove('picked'));
      building.classList.add('picked');

      info.innerHTML =
        '<b>' + building.dataset.name + '</b>' +
        '<p>' + building.dataset.info + '</p>';
    });
  });
});

// ===== Sidebar: hidden by default, opens on hover or ☰ click =====
document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  // Create a small invisible edge on the left side to detect mouse hover
  const edge = document.createElement('div');
  edge.className = 'menu-edge';
  document.body.appendChild(edge);

  // small ☰ icon
  const icon = document.createElement('button');
  icon.className = 'menu-icon';
  icon.setAttribute('aria-label', 'Open menu');
  icon.textContent = '☰';
  document.body.appendChild(icon);

  let hideTimer = null;

  function openMenu() {
    clearTimeout(hideTimer);
    sidebar.classList.add('open');
    icon.classList.add('hide');
  }

  function closeMenu() {
    sidebar.classList.remove('open');
    icon.classList.remove('hide');
  }

  // Mouse leave delay to close menu
  function closeLater() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(closeMenu, 300);
  }

  // Hover
  edge.addEventListener('mouseenter', openMenu);
  sidebar.addEventListener('mouseenter', openMenu);
  sidebar.addEventListener('mouseleave', closeLater);

  // Touch screen icon click to open
  icon.addEventListener('click', (e) => {
    e.stopPropagation();
    openMenu();
  });

  // Sidebar outside click to close
  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && e.target !== icon) closeMenu();
  });

  // Escape key to close sidebar
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
});
// ===== Profile page: tabs, privacy toggle, edit modal =====
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  if (tabs.length === 0) return; // Profile পেজ না হলে কিছু করবে না

  // ---- Tabs ----
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
  });

  // ---- Privacy toggle ----
  const privacyBtn = document.getElementById('togglePrivacy');
  const masked = document.querySelectorAll('.masked');
  let shown = false;
  privacyBtn.addEventListener('click', () => {
    shown = !shown;
    masked.forEach(m => m.classList.toggle('show', shown));
    privacyBtn.textContent = shown ? '🙈 Hide private details' : '👁️ Show private details';
  });

  // ---- Edit modal ----
  const modal = document.getElementById('editModal');
  const form = document.getElementById('editForm');
  const inEmail = document.getElementById('inEmail');
  const inPhone = document.getElementById('inPhone');
  const inHall = document.getElementById('inHall');
  const inEmergency = document.getElementById('inEmergency');

  const get = field => document.querySelector('[data-field="' + field + '"]');

  document.getElementById('openEdit').addEventListener('click', () => {
    inEmail.value = get('email').textContent;
    inPhone.value = get('phone').textContent;
    inHall.value = get('hall').textContent;
    inEmergency.value = get('emergency').textContent;
    modal.classList.add('show');
  });

  function closeModal() { modal.classList.remove('show'); }
  document.getElementById('cancelEdit').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = inEmail.value.trim();
    const phone = inPhone.value.trim();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!/^\+?[0-9\s-]{8,}$/.test(phone)) {
      alert('Please enter a valid phone number.');
      return;
    }

    get('email').textContent = email;
    get('phone').textContent = phone;
    get('hall').textContent = inHall.value.trim() || get('hall').textContent;
    get('emergency').textContent = inEmergency.value.trim() || get('emergency').textContent;
    closeModal();
    alert('Profile updated.');
  });
});
// ===== Complaint page: progress bar and character counter =====
document.addEventListener('DOMContentLoaded', () => {
  const fill = document.getElementById('progressFill');
  const text = document.getElementById('progressText');
  const counter = document.getElementById('charCount');
  const form = document.querySelector('.section-form');
  if (!fill || !form) return;

  const nameInput = form.querySelector('input[placeholder="Your name"]');
  const idInput = form.querySelector('input[placeholder^="e.g. 2026"]');
  const details = form.querySelector('textarea');
  const confirmBox = form.querySelector('.confirm-box input');

  function updateProgress() {
    let done = 0;
    if (nameInput.value.trim() !== '') done++;
    if (idInput.value.trim() !== '') done++;
    if (details.value.trim().length >= 20) done++;
    if (confirmBox.checked) done++;

    const pct = Math.round((done / 4) * 100);
    fill.style.width = pct + '%';
    text.textContent = pct + '%';
  }

  function updateCounter() {
    const len = details.value.trim().length;
    counter.textContent = len + ' / 20';
    counter.style.color = len >= 20 ? 'var(--green)' : 'var(--muted)';
  }

  form.addEventListener('input', () => { updateProgress(); updateCounter(); });
  form.addEventListener('change', updateProgress);
  form.addEventListener('reset', () => {
    setTimeout(() => { updateProgress(); updateCounter(); }, 0);
  });

  updateProgress();
  updateCounter();
});
// ===== Emergency page: live location + Google Maps =====
document.addEventListener('DOMContentLoaded', () => {
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
    console.log('Location button clicked');

    if (!navigator.geolocation) {
      status.textContent = '❌ Your browser does not support location.';
      return;
    }

    status.textContent = 'Getting your location...';

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(5);
        const lng = pos.coords.longitude.toFixed(5);
        const acc = Math.round(pos.coords.accuracy);

        status.textContent = '✅ Location found (accuracy about ' + acc + ' m)';
        coords.textContent = 'Lat: ' + lat + ', Lng: ' + lng;
        hidden.value = lat + ',' + lng; 
        btn.textContent = '🔄 Refresh location';
        showMap(lat, lng);
      },
      (err) => {
        console.log('Geolocation error:', err);
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
});