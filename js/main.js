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

