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

