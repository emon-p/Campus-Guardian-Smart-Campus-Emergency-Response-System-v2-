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